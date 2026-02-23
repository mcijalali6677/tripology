"use client"

import { useI18n } from "@/lib/i18n/context"
import { locales, localeNames, localeFlags, type Locale } from "@/lib/i18n"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LanguageSwitcher({ variant = "icon" }: { variant?: "icon" | "full" }) {
  const { locale, setLocale, t } = useI18n()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === "icon" ? (
          <Button variant="ghost" size="icon" className="shrink-0">
            <Globe className="size-4" />
            <span className="sr-only">{t("languageSwitcher.label")}</span>
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="gap-2 shrink-0">
            <Globe className="size-4" />
            <span>{localeFlags[locale]} {localeNames[locale]}</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => setLocale(loc)}
            className={`gap-3 cursor-pointer ${locale === loc ? "bg-accent font-medium" : ""}`}
          >
            <span className="text-base">{localeFlags[loc]}</span>
            <span>{localeNames[loc]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
