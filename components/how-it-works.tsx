"use client"

import { Search, ShoppingCart, Map, Sparkles } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

const stepIcons = [Search, Sparkles, ShoppingCart, Map]
const stepKeys = ["step1", "step2", "step3", "step4"] as const

export function HowItWorks() {
  const { t } = useI18n()

  return (
    <section id="how-it-works" className="border-y bg-secondary/30 py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="mb-4 font-serif text-3xl font-bold sm:text-4xl">{t("howItWorks.title")}</h2>
          <p className="text-muted-foreground">{t("howItWorks.subtitle")}</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stepKeys.map((key, index) => {
            const Icon = stepIcons[index]
            return (
              <div key={key} className="relative text-center">
                <div className="mb-4 inline-flex size-16 items-center justify-center rounded-full bg-forest text-white">
                  <Icon className="size-7" />
                </div>
                <div
                  className="absolute start-1/2 top-8 hidden h-0.5 w-full bg-forest/20 lg:block"
                  style={{ display: index === 3 ? "none" : undefined }}
                />
                <h3 className="mb-2 font-serif text-xl font-semibold">{t(`howItWorks.${key}.title`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`howItWorks.${key}.description`)}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
