"use client"

import Link from "next/link"
import { Globe, Instagram, Twitter, Youtube, Mail, MapPin, Phone, Heart, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n/context"

const SOCIAL_LINKS = [
  { icon: <Instagram className="size-4" />, href: "#", label: "Instagram" },
  { icon: <Twitter className="size-4" />, href: "#", label: "Twitter" },
  { icon: <Youtube className="size-4" />, href: "#", label: "YouTube" },
  { icon: <Mail className="size-4" />, href: "#", label: "Email" },
]

export function FooterAdvanced() {
  const { t } = useI18n()

  const FOOTER_LINKS = {
    [t("footerAdv.planTrip")]: [
      { label: t("footerAdv.exploreDestinations"), href: "/explore" },
      { label: t("footerAdv.aiPlanner"), href: "/explore?ai=true" },
      { label: t("footerAdv.personalityQuiz"), href: "/quiz" },
      { label: t("footerAdv.customTrip"), href: "/custom-trip" },
      { label: t("footerAdv.browseItineraries"), href: "/#itineraries" },
    ],
    [t("footerAdv.forCreators")]: [
      { label: t("footerAdv.shareYourTrip"), href: "/submit-trip" },
      { label: t("footerAdv.creatorDashboard"), href: "/profile" },
      { label: t("vendor.becomeVendor"), href: "/vendor/register" },
      { label: t("footerAdv.earningGuide"), href: "#" },
      { label: t("footerAdv.communityGuidelines"), href: "#" },
      { label: t("footerAdv.becomeCreator"), href: "/submit-trip" },
    ],
    [t("footerAdv.company")]: [
      { label: t("footerAdv.aboutTripology"), href: "#" },
      { label: t("footerAdv.careers"), href: "#" },
      { label: t("footerAdv.pressKit"), href: "#" },
      { label: t("footerAdv.blog"), href: "#" },
      { label: t("footerAdv.contactUs"), href: "#" },
    ],
    [t("footerAdv.support")]: [
      { label: t("footerAdv.helpCenter"), href: "#" },
      { label: t("footerAdv.privacyPolicy"), href: "#" },
      { label: t("footerAdv.termsOfService"), href: "#" },
      { label: t("footerAdv.cookiePolicy"), href: "#" },
      { label: t("footerAdv.cancellationPolicy"), href: "#" },
    ],
  }

  return (
    <footer className="border-t bg-card">
      {/* Newsletter — wider layout on desktop */}
      <div className="border-b">
        <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-10 xl:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 lg:gap-8">
            <div className="lg:max-w-md">
              <h3 className="font-serif text-lg lg:text-xl font-semibold mb-1 lg:mb-1.5">{t("footerAdv.newsletterTitle")}</h3>
              <p className="text-sm lg:text-sm text-muted-foreground">{t("footerAdv.newsletterDesc")}</p>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder={t("footerAdv.emailPlaceholder")}
                className="flex-1 md:w-72 lg:w-80 rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
              <Button className="rounded-xl bg-forest hover:bg-forest/90 shrink-0 lg:h-10 lg:px-5">
                {t("footerAdv.subscribe")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer — professional multi-column on desktop */}
      <div className="container mx-auto px-4 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-8 lg:gap-10 xl:gap-12">
          {/* Brand — wider on desktop */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="size-9 lg:size-10 rounded-full bg-forest flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-serif text-xl lg:text-xl font-semibold">Tripology</span>
            </Link>
            <p className="text-sm lg:text-sm text-muted-foreground mb-4 lg:mb-5 leading-relaxed lg:max-w-xs">
              {t("footerAdv.brandDesc")}
            </p>
            <div className="flex items-center gap-2 lg:gap-3">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="size-9 lg:size-9 rounded-xl border flex items-center justify-center text-muted-foreground hover:text-forest hover:border-forest/30 transition-colors"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold mb-3 lg:mb-3">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t">
        <div className="container mx-auto px-4 lg:px-8 py-4 lg:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs lg:text-sm text-muted-foreground">
            <p>{t("footerAdv.copyright")}</p>
            <p className="flex items-center gap-1">
              {t("footerAdv.madeWith")} <Heart className="size-3 lg:size-4 text-rose-500 fill-rose-500" /> {t("footerAdv.madeWithEnd")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
