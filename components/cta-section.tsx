"use client"

import { motion } from "framer-motion"
import { Sparkles, ArrowRight, Send, Globe, Map, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"

export function CTASection() {
  const { t } = useI18n()
  return (
    <section className="py-16 sm:py-20 lg:py-20 xl:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl lg:rounded-[2rem] bg-gradient-to-br from-forest via-forest/95 to-emerald-800 p-8 sm:p-12 lg:p-14 xl:p-16 text-center"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 start-0 size-72 lg:size-96 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 end-0 size-72 lg:size-96 rounded-full bg-amber-400/10 translate-x-1/2 translate-y-1/2 blur-3xl" />
          
          {/* Floating Icons — more on desktop */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-8 start-8 size-12 lg:size-16 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/50 hidden md:flex"
          >
            <Globe className="size-6 lg:size-8" />
          </motion.div>
          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute bottom-8 end-12 size-12 lg:size-16 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/50 hidden md:flex"
          >
            <Send className="size-6 lg:size-8" />
          </motion.div>
          <motion.div
            animate={{ y: [-8, 12, -8], x: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-20 end-24 size-14 rounded-xl bg-white/5 backdrop-blur-sm flex items-center justify-center text-white/30 hidden lg:flex"
          >
            <Map className="size-7" />
          </motion.div>
          <motion.div
            animate={{ y: [8, -8, 8], x: [0, -5, 0] }}
            transition={{ duration: 7, repeat: Infinity }}
            className="absolute bottom-20 start-24 size-14 rounded-xl bg-white/5 backdrop-blur-sm flex items-center justify-center text-white/30 hidden lg:flex"
          >
            <Plane className="size-7" />
          </motion.div>

          <div className="relative z-10 max-w-2xl lg:max-w-3xl mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="size-16 lg:size-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-5 lg:mb-6"
            >
              <Sparkles className="size-8 lg:size-8 text-amber-300" />
            </motion.div>

            <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl lg:text-4xl xl:text-5xl mb-4 lg:mb-6 lg:leading-tight">
              {t("ctaSection.title")}
              <br />
              <span className="bg-gradient-to-r from-amber-200 to-yellow-200 bg-clip-text text-transparent">
                {t("ctaSection.titleHighlight")}
              </span>
            </h2>
            <p className="text-white/70 mb-8 lg:mb-10 max-w-md lg:max-w-xl mx-auto text-sm sm:text-base lg:text-base xl:text-lg">
              {t("ctaSection.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 lg:gap-4">
              <Button
                size="lg"
                className="rounded-xl bg-white text-forest hover:bg-white/90 px-8 lg:px-8 lg:h-12 lg:text-sm font-semibold"
                asChild
              >
                <Link href="/explore">
                  {t("ctaSection.startPlanning")}
                  <ArrowRight className="size-4 ms-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl border-white/30 text-white hover:bg-white/10 px-8 lg:px-8 lg:h-12 lg:text-sm bg-transparent"
                asChild
              >
                <Link href="/quiz">
                  {t("ctaSection.takeQuiz")}
                  <Sparkles className="size-4 ms-2" />
                </Link>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="mt-8 lg:mt-10 flex items-center justify-center gap-3">
              <div className="flex -space-x-2">
                {["SC", "MR", "AP", "AK"].map((initials) => (
                  <div
                    key={initials}
                    className="size-8 lg:size-10 rounded-full bg-white/20 border-2 border-forest flex items-center justify-center text-[10px] lg:text-xs font-bold text-white"
                  >
                    {initials}
                  </div>
                ))}
                <div className="size-8 lg:size-10 rounded-full bg-emerald-400/30 border-2 border-forest flex items-center justify-center text-[10px] lg:text-xs font-bold text-white">
                  +50K
                </div>
              </div>
              <div className="text-start">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="size-3 lg:size-4 fill-amber-300 text-amber-300" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[11px] lg:text-xs text-white/50">{t("ctaSection.reviewCount")}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
