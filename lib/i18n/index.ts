/**
 * Tripology i18n — Lightweight internationalization system
 * Supports: English (en), Persian/Farsi (fa), Arabic (ar), French (fr)
 *
 * RTL languages: fa, ar
 */

export type Locale = "en" | "fa" | "ar" | "fr"

export const locales: Locale[] = ["en", "fa", "ar", "fr"]

export const localeNames: Record<Locale, string> = {
  en: "English",
  fa: "فارسی",
  ar: "العربية",
  fr: "Français",
}

export const localeFlags: Record<Locale, string> = {
  en: "🇬🇧",
  fa: "🇮🇷",
  ar: "🇸🇦",
  fr: "🇫🇷",
}

export const rtlLocales: Locale[] = ["fa", "ar"]

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale)
}

export const defaultLocale: Locale = "en"

/**
 * Get a nested translation value by dot-notation key.
 * e.g. t("home.hero.title") => translations.home.hero.title
 */
export function getTranslation(translations: Record<string, any>, key: string): string {
  const keys = key.split(".")
  let value: any = translations
  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k]
    } else {
      // Return key as fallback
      return key
    }
  }
  return typeof value === "string" ? value : key
}
