"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import {
  Brain, Users, Globe, Sparkles, Shield, Star,
  Award, TrendingUp, Clock, Zap
} from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export function TrustSection() {
  const { t } = useI18n()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  const y = useTransform(scrollYProgress, [0, 1], [50, -50])

  const STATS = [
    { icon: <Globe className="size-5 lg:size-6" />, value: t("trustSection.stat1"), label: t("trustSection.stat1Label"), color: "text-blue-600 bg-blue-50" },
    { icon: <Users className="size-5 lg:size-6" />, value: t("trustSection.stat2"), label: t("trustSection.stat2Label"), color: "text-emerald-600 bg-emerald-50" },
    { icon: <Star className="size-5 lg:size-6" />, value: t("trustSection.stat3"), label: t("trustSection.stat3Label"), color: "text-amber-600 bg-amber-50" },
    { icon: <TrendingUp className="size-5 lg:size-6" />, value: t("trustSection.stat4"), label: t("trustSection.stat4Label"), color: "text-purple-600 bg-purple-50" },
  ]

  const TRUST_ITEMS = [
    { icon: <Brain className="size-6" />, title: t("trustSection.trust1Title"), description: t("trustSection.trust1Desc"), color: "bg-purple-50 text-purple-600" },
    { icon: <Shield className="size-6" />, title: t("trustSection.trust2Title"), description: t("trustSection.trust2Desc"), color: "bg-emerald-50 text-emerald-600" },
    { icon: <Clock className="size-6" />, title: t("trustSection.trust3Title"), description: t("trustSection.trust3Desc"), color: "bg-blue-50 text-blue-600" },
    { icon: <Award className="size-6" />, title: t("trustSection.trust4Title"), description: t("trustSection.trust4Desc"), color: "bg-amber-50 text-amber-600" },
    { icon: <Zap className="size-6" />, title: t("trustSection.trust5Title"), description: t("trustSection.trust5Desc"), color: "bg-rose-50 text-rose-600" },
    { icon: <Sparkles className="size-6" />, title: t("trustSection.trust6Title"), description: t("trustSection.trust6Desc"), color: "bg-teal-50 text-teal-600" },
  ]

  return (
    <section ref={ref} className="py-16 sm:py-20 lg:py-20 xl:py-24 bg-gradient-to-b from-secondary/30 to-background relative overflow-hidden">
      {/* Background Decoration */}
      <motion.div
        style={{ y }}
        className="absolute -end-32 -top-32 size-64 lg:size-96 rounded-full bg-forest/5 blur-3xl"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [-30, 30]) }}
        className="absolute -start-32 -bottom-32 size-64 lg:size-96 rounded-full bg-amber-500/5 blur-3xl"
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Stats Bar — bigger on desktop, glass-morphism cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 xl:gap-8 mb-16 lg:mb-20"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center lg:rounded-2xl lg:border lg:bg-card/60 lg:backdrop-blur-sm lg:p-7 xl:p-8 lg:hover:shadow-lg lg:transition-all lg:duration-300 lg:hover:-translate-y-1"
            >
              <div className={`size-12 lg:size-14 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-3 lg:mb-4`}>
                {stat.icon}
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-serif">{stat.value}</div>
              <div className="text-xs lg:text-sm text-muted-foreground mt-0.5 lg:mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-14 xl:mb-16"
        >
          <h2 className="font-serif text-3xl font-bold sm:text-4xl lg:text-4xl xl:text-[2.75rem] mb-3 lg:mb-4">
            {t("trustSection.title")} <span className="text-forest">{t("trustSection.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground max-w-md lg:max-w-xl mx-auto lg:text-base xl:text-lg">
            {t("trustSection.subtitle")}
          </p>
        </motion.div>

        {/* Features Grid — desktop: 3 cols, larger cards with hover */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 xl:gap-6 max-w-5xl lg:max-w-6xl mx-auto">
          {TRUST_ITEMS.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group"
            >
              <div className="rounded-2xl border bg-card p-5 lg:p-6 xl:p-7 h-full hover:shadow-lg hover:border-forest/20 transition-all duration-300 lg:hover:-translate-y-1">
                <div className={`size-12 lg:size-12 rounded-xl ${item.color} flex items-center justify-center mb-4 lg:mb-5 transition-transform group-hover:scale-110`}>
                  {item.icon}
                </div>
                <h3 className="font-semibold mb-2 lg:mb-2.5 lg:text-base xl:text-lg">{item.title}</h3>
                <p className="text-sm lg:text-sm xl:text-base text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
