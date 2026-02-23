"use client"

import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { useI18n } from "@/lib/i18n/context"

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="bg-charcoal text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="size-7 rounded-full bg-forest flex items-center justify-center">
                <span className="text-white font-bold text-xs">T</span>
              </div>
              <span className="font-serif text-lg font-semibold">{t("common.appName")}</span>
            </Link>
            <p className="text-xs text-white/60 leading-relaxed">
              {t("footer.tagline")}
            </p>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-semibold">{t("footer.explore")}</h4>
            <ul className="space-y-1.5 text-xs text-white/60">
              <li><Link href="/" className="hover:text-white">{t("footer.itineraries")}</Link></li>
              <li><Link href="#" className="hover:text-white">{t("footer.destinations")}</Link></li>
              <li><Link href="#" className="hover:text-white">{t("footer.budgetTravel")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-semibold">{t("footer.creators")}</h4>
            <ul className="space-y-1.5 text-xs text-white/60">
              <li><Link href="/submit-trip" className="hover:text-white">{t("footer.sellItinerary")}</Link></li>
              <li><Link href="#" className="hover:text-white">{t("footer.guidelines")}</Link></li>
              <li><Link href="#" className="hover:text-white">{t("footer.successStories")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-semibold">{t("footer.support")}</h4>
            <ul className="space-y-1.5 text-xs text-white/60">
              <li><Link href="#" className="hover:text-white">{t("footer.helpCenter")}</Link></li>
              <li><Link href="#" className="hover:text-white">{t("footer.privacy")}</Link></li>
              <li><Link href="#" className="hover:text-white">{t("footer.terms")}</Link></li>
            </ul>
          </div>
        </div>

        <Separator className="my-6 bg-white/10" />

        <p className="text-xs text-white/40 text-center">
          {t("footer.copyright", { year: new Date().getFullYear().toString() })}
        </p>
      </div>
    </footer>
  )
}
