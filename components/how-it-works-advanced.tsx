"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Sparkles, ArrowRight, Check, Zap, Brain, Map, Calendar, CreditCard, MessageSquare, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n/context"
import Link from "next/link"

const STEP_IMAGES = [
  "/paris-cafe-terrace.jpg",
  "/paris-eiffel-tower-sunset.jpg",
  "/paris-montmartre-streets.jpg",
  "/scenic-road-trip-landscape.jpg",
]

export function HowItWorksAdvanced() {
  const { t } = useI18n()

  const STEPS = [
    {
      number: "01",
      icon: <MessageSquare className="size-6" />,
      title: t("howItWorksAdv.step1Title"),
      description: t("howItWorksAdv.step1Desc"),
      color: "bg-blue-50 text-blue-600 border-blue-200",
      iconBg: "bg-blue-100",
      accent: "border-blue-200",
      features: [t("howItWorksAdv.step1F1"), t("howItWorksAdv.step1F2"), t("howItWorksAdv.step1F3")],
      image: STEP_IMAGES[0],
    },
    {
      number: "02",
      icon: <Brain className="size-6" />,
      title: t("howItWorksAdv.step2Title"),
      description: t("howItWorksAdv.step2Desc"),
      color: "bg-purple-50 text-purple-600 border-purple-200",
      iconBg: "bg-purple-100",
      accent: "border-purple-200",
      features: [t("howItWorksAdv.step2F1"), t("howItWorksAdv.step2F2"), t("howItWorksAdv.step2F3")],
      image: STEP_IMAGES[1],
    },
    {
      number: "03",
      icon: <Map className="size-6" />,
      title: t("howItWorksAdv.step3Title"),
      description: t("howItWorksAdv.step3Desc"),
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
      iconBg: "bg-emerald-100",
      accent: "border-emerald-200",
      features: [t("howItWorksAdv.step3F1"), t("howItWorksAdv.step3F2"), t("howItWorksAdv.step3F3")],
      image: STEP_IMAGES[2],
    },
    {
      number: "04",
      icon: <CreditCard className="size-6" />,
      title: t("howItWorksAdv.step4Title"),
      description: t("howItWorksAdv.step4Desc"),
      color: "bg-amber-50 text-amber-600 border-amber-200",
      iconBg: "bg-amber-100",
      accent: "border-amber-200",
      features: [t("howItWorksAdv.step4F1"), t("howItWorksAdv.step4F2"), t("howItWorksAdv.step4F3")],
      image: STEP_IMAGES[3],
    },
  ]

  return (
    <section className="py-16 sm:py-20 lg:py-20 xl:py-24 bg-gradient-to-b from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 lg:mb-16 xl:mb-20"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-forest/10 px-4 py-1.5 text-sm text-forest mb-4">
            <Zap className="size-4" />
            {t("howItWorksAdv.badge")}
          </div>
          <h2 className="font-serif text-3xl font-bold sm:text-4xl lg:text-4xl xl:text-[2.75rem] mb-3 lg:mb-4">
            {t("howItWorksAdv.title")} <span className="text-forest">{t("howItWorksAdv.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground max-w-lg lg:max-w-xl mx-auto lg:text-base xl:text-lg">
            {t("howItWorksAdv.subtitle")}
          </p>
        </motion.div>

        {/* Mobile: card grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto lg:hidden">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group relative"
            >
              <div className="rounded-2xl border bg-card h-full hover:shadow-lg transition-all duration-300 hover:border-forest/20 overflow-hidden">
                <div className="relative h-36 sm:h-40 w-full overflow-hidden">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                  <div className="absolute bottom-3 start-4 flex items-center gap-2">
                    <div className={`size-10 rounded-xl ${step.iconBg} flex items-center justify-center shadow-lg`}>
                      {step.icon}
                    </div>
                    <span className="text-3xl font-serif font-bold text-foreground/80 drop-shadow">{step.number}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{step.description}</p>
                  <div className="space-y-1.5">
                    {step.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check className="size-3.5 text-forest shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop: alternating left-right timeline */}
        <div className="hidden lg:block max-w-6xl mx-auto relative">
          {/* Center timeline line */}
          <div className="absolute start-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent -translate-x-1/2" />

          {STEPS.map((step, index) => {
            const isEven = index % 2 === 0
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: isEven ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`relative flex items-center gap-10 xl:gap-14 mb-20 xl:mb-24 last:mb-0 ${isEven ? "flex-row" : "flex-row-reverse"}`}
              >
                {/* Image side */}
                <div className="flex-1 group w-full">
                  <div className="relative w-full rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500 aspect-[4/3]">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      sizes="(min-width: 1280px) 520px, (min-width: 1024px) 420px, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute bottom-5 start-5">
                      <span className="text-5xl xl:text-6xl font-serif font-bold text-white/20">{step.number}</span>
                    </div>
                  </div>
                </div>

                {/* Center dot on timeline */}
                <div className="absolute start-1/2 -translate-x-1/2 z-10">
                  <div className={`size-14 rounded-2xl ${step.iconBg} flex items-center justify-center shadow-lg border-4 border-background`}>
                    {step.icon}
                  </div>
                </div>

                {/* Content side */}
                <div className="flex-1">
                  <div className={`rounded-2xl border bg-card p-6 xl:p-8 hover:shadow-xl transition-all duration-300 hover:border-forest/20 ${step.accent}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-4xl xl:text-5xl font-serif font-bold text-forest/15">{step.number}</span>
                      <h3 className="text-lg xl:text-xl font-semibold leading-snug">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-5 lg:text-sm xl:text-base">{step.description}</p>
                    <div className="space-y-2.5">
                      {step.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                          <div className="size-6 rounded-lg bg-forest/10 flex items-center justify-center shrink-0">
                            <Check className="size-4 text-forest" />
                          </div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16 sm:mt-20 lg:mt-24 xl:mt-28"
        >
          <Button size="lg" className="rounded-xl bg-forest hover:bg-forest/90 px-8 lg:px-10 lg:h-12 lg:text-sm" asChild>
            <Link href="/explore">
              <Sparkles className="size-4 me-2" />
              {t("howItWorksAdv.cta")}
              <ArrowRight className="size-4 ms-2" />
            </Link>
          </Button>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="size-3.5" />
              {t("howItWorksAdv.freeToStart")}
            </div>
            <div className="flex items-center gap-1">
              <Zap className="size-3.5" />
              {t("howItWorksAdv.noCreditCard")}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
