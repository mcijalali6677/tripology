"use client"

import { ShieldCheck, CreditCard, RefreshCcw, Headphones } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

const badgeIcons = [ShieldCheck, CreditCard, RefreshCcw, Headphones]
const badgeKeys = [
  { title: "trustBadges.verifiedCreators", desc: "trustBadges.verifiedCreatorsDesc" },
  { title: "trustBadges.securePayments", desc: "trustBadges.securePaymentsDesc" },
  { title: "trustBadges.moneyBack", desc: "trustBadges.moneyBackDesc" },
  { title: "trustBadges.support", desc: "trustBadges.supportDesc" },
]

export function TrustBadges() {
  const { t } = useI18n()

  return (
    <section className="border-y py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {badgeKeys.map((badge, i) => {
            const Icon = badgeIcons[i]
            return (
              <div key={badge.title} className="flex items-center gap-3">
                <div className="rounded-full bg-forest/10 p-2 shrink-0">
                  <Icon className="size-5 text-forest" />
                </div>
                <div>
                  <p className="font-medium text-sm">{t(badge.title)}</p>
                  <p className="text-xs text-muted-foreground hidden sm:block">{t(badge.desc)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
