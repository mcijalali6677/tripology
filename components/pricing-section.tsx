"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight, Check, Crown, Zap, Star, Users, Brain, Gift, Rocket, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn, cadToToman, formatPrice } from "@/lib/utils"
import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"

export function PricingSection() {
  const [annual, setAnnual] = useState(false)
  const { t, locale } = useI18n()
  const isFa = locale === "fa"

  const PLANS = [
    {
      id: "free",
      name: t("pricing.explorerName"),
      rawPriceCad: 0,
      period: "",
      description: t("pricing.explorerDesc"),
      icon: <Sparkles className="size-5" />,
      color: "border-border",
      buttonVariant: "outline" as const,
      features: [
        t("pricing.explorerF1"),
        t("pricing.explorerF2"),
        t("pricing.explorerF3"),
        t("pricing.explorerF4"),
        t("pricing.explorerF5"),
      ],
      notIncluded: [
        t("pricing.explorerN1"),
        t("pricing.explorerN2"),
        t("pricing.explorerN3"),
        t("pricing.explorerN4"),
      ],
    },
    {
      id: "pro",
      name: t("pricing.voyagerName"),
      rawPriceCad: 9.99,
      period: t("pricing.perMonth"),
      description: t("pricing.voyagerDesc"),
      icon: <Zap className="size-5" />,
      color: "border-forest ring-2 ring-forest/20",
      popular: true,
      buttonVariant: "default" as const,
      features: [
        t("pricing.voyagerF1"),
        t("pricing.voyagerF2"),
        t("pricing.voyagerF3"),
        t("pricing.voyagerF4"),
        t("pricing.voyagerF5"),
        t("pricing.voyagerF6"),
        t("pricing.voyagerF7"),
        t("pricing.voyagerF8"),
      ],
      notIncluded: [
        t("pricing.voyagerN1"),
        t("pricing.voyagerN2"),
      ],
    },
    {
      id: "premium",
      name: t("pricing.navigatorName"),
      rawPriceCad: 24.99,
      period: t("pricing.perMonth"),
      description: t("pricing.navigatorDesc"),
      icon: <Crown className="size-5" />,
      color: "border-amber-300 bg-gradient-to-b from-amber-50/50 to-transparent",
      buttonVariant: "outline" as const,
      features: [
        t("pricing.navigatorF1"),
        t("pricing.navigatorF2"),
        t("pricing.navigatorF3"),
        t("pricing.navigatorF4"),
        t("pricing.navigatorF5"),
        t("pricing.navigatorF6"),
        t("pricing.navigatorF7"),
        t("pricing.navigatorF8"),
        t("pricing.navigatorF9"),
        t("pricing.navigatorF10"),
      ],
      notIncluded: [],
    },
  ]

  return (
    <section className="py-16 sm:py-20 lg:py-20 xl:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-14 xl:mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-forest/10 px-4 py-1.5 text-sm text-forest mb-4">
            <Gift className="size-4" />
            {t("pricing.badge")}
          </div>
          <h2 className="font-serif text-3xl font-bold sm:text-4xl lg:text-4xl xl:text-[2.75rem] mb-3 lg:mb-4">
            {t("pricing.title")} <span className="text-forest">{t("pricing.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground max-w-md lg:max-w-xl mx-auto mb-6 lg:mb-8 lg:text-base xl:text-lg">
            {t("pricing.subtitle")}
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 rounded-full bg-secondary/60 p-1">
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all",
                !annual ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"
              )}
            >
              {t("pricing.monthly")}
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all flex items-center gap-1.5",
                annual ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"
              )}
            >
              {t("pricing.annual")}
              <span className="rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[10px] font-bold">-20%</span>
            </button>
          </div>
        </motion.div>

        {/* Plans — desktop: larger cards with scale on popular */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-6 xl:gap-8 max-w-5xl lg:max-w-6xl mx-auto lg:items-start">
          {PLANS.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className={cn(
                "relative rounded-2xl border bg-card p-6 lg:p-7 xl:p-8 flex flex-col",
                plan.color,
                plan.popular && "lg:scale-[1.04] lg:shadow-xl lg:z-10"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 inset-x-0 flex justify-center">
                  <span className="rounded-full bg-forest text-white px-4 py-1 text-xs font-medium flex items-center gap-1.5 shadow-lg">
                    <Star className="size-3 fill-amber-300 text-amber-300" />
                    {t("pricing.mostPopular")}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4 lg:mb-6">
                <div className={cn(
                  "size-10 lg:size-12 rounded-xl flex items-center justify-center",
                  plan.popular ? "bg-forest/10 text-forest" : "bg-secondary text-muted-foreground"
                )}>
                  {plan.icon}
                </div>
                <div>
                  <h3 className="font-semibold lg:text-lg">{plan.name}</h3>
                  <p className="text-xs lg:text-sm text-muted-foreground">{plan.description}</p>
                </div>
              </div>

              <div className="mb-6 lg:mb-8">
                <span className="text-3xl lg:text-4xl xl:text-5xl font-bold">
                  {plan.rawPriceCad === 0
                    ? t("pricing.free")
                    : isFa
                    ? formatPrice(Math.round(cadToToman(plan.rawPriceCad * (annual ? 0.8 : 1))), locale)
                    : annual ? `$${(plan.rawPriceCad * 0.8).toFixed(2)}` : `$${plan.rawPriceCad}`}
                </span>
                {plan.period && (
                  <span className="text-sm lg:text-base text-muted-foreground">{plan.period}</span>
                )}
              </div>

              <Button
                variant={plan.buttonVariant}
                className={cn(
                  "mb-6 lg:mb-6 rounded-xl lg:h-11 lg:text-sm",
                  plan.popular ? "bg-forest hover:bg-forest/90" : "bg-transparent"
                )}
                asChild
              >
                <Link href={plan.id === "free" ? "/explore" : "/login"}>
                  {plan.id === "free" ? t("pricing.getStarted") : t("pricing.startTrial")}
                  <ArrowRight className="size-4 ms-2" />
                </Link>
              </Button>

              <div className="flex-1 space-y-2.5 lg:space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2 text-sm lg:text-base">
                    <Check className="size-4 lg:size-5 text-forest shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
                {plan.notIncluded.map((feature) => (
                  <div key={feature} className="flex items-start gap-2 text-sm lg:text-base text-muted-foreground/50">
                    <div className="size-4 lg:size-5 shrink-0 mt-0.5 flex items-center justify-center">
                      <div className="size-1.5 rounded-full bg-muted-foreground/20" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8 lg:mt-12"
        >
          <div className="flex items-center justify-center gap-6 text-xs lg:text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Shield className="size-3.5 lg:size-4" />
              {t("pricing.guarantee")}
            </div>
            <div className="flex items-center gap-1.5">
              <Rocket className="size-3.5 lg:size-4" />
              {t("pricing.trial")}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
