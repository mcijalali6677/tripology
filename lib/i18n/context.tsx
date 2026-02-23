"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"
import { type Locale, defaultLocale, isRtl, getTranslation } from "@/lib/i18n"

// Import all translation files
import en from "@/lib/i18n/locales/en"
import fa from "@/lib/i18n/locales/fa"
import ar from "@/lib/i18n/locales/ar"
import fr from "@/lib/i18n/locales/fr"

const translations: Record<Locale, Record<string, any>> = { en, fa, ar, fr }

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
  dir: "ltr" | "rtl"
  isRtl: boolean
}

const I18nContext = createContext<I18nContextType | null>(null)

const STORAGE_KEY = "tripology-locale"

// Read locale synchronously to avoid flash of wrong language
function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "fa" // SSR default = Farsi
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (saved && (saved in translations)) return saved
  } catch {}
  return "fa" // Default to Farsi for Iranian users
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)
  const [mounted, setMounted] = useState(false)

  // On mount: if no saved locale, try geo-detection
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (saved && translations[saved]) {
      setMounted(true)
      return
    }
    // No saved locale — try geo-detection
    fetch("/api/geo")
      .then(res => res.json())
      .then(data => {
        if (data.isIran) {
          setLocaleState("fa")
          localStorage.setItem(STORAGE_KEY, "fa")
        }
      })
      .catch(() => {})
      .finally(() => setMounted(true))
  }, [])

  // Apply dir and lang to <html> element
  useEffect(() => {
    if (!mounted) return
    const html = document.documentElement
    const rtl = isRtl(locale)
    html.setAttribute("lang", locale)
    html.setAttribute("dir", rtl ? "rtl" : "ltr")
    // Add/remove RTL class for Tailwind
    if (rtl) {
      html.classList.add("rtl")
    } else {
      html.classList.remove("rtl")
    }
  }, [locale, mounted])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem(STORAGE_KEY, newLocale)
  }, [])

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      let text = getTranslation(translations[locale], key)
      // Fallback to English if key not found in current locale
      if (text === key && locale !== "en") {
        text = getTranslation(translations.en, key)
      }
      // Replace {{param}} placeholders
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          text = text.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), String(v))
        })
      }
      return text
    },
    [locale]
  )

  const dir: "ltr" | "rtl" = isRtl(locale) ? "rtl" : "ltr"

  const value: I18nContextType = useMemo(
    () => ({ locale, setLocale, t, dir, isRtl: isRtl(locale) }),
    [locale, setLocale, t, dir]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

// Fallback for SSR / static generation (e.g. _not-found page)
const fallbackContext: I18nContextType = {
  locale: defaultLocale,
  setLocale: () => {},
  t: (key: string) => getTranslation(translations.en, key),
  dir: "ltr",
  isRtl: false,
}

export function useI18n() {
  const context = useContext(I18nContext)
  return context ?? fallbackContext
}

// Re-export for convenience
export { type Locale } from "@/lib/i18n"
