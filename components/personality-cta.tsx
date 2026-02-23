"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Compass, ArrowRight, Sparkles } from "lucide-react"
import { personalityArchetypes } from "@/lib/personality-quiz"
import { useI18n } from "@/lib/i18n/context"

const featuredTypes = ["BookTripy", "SocialTripy", "FlowTripy", "ActionTripy"] as const

export function PersonalityCTA() {
  const { t } = useI18n()
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden border-2 border-forest/20 bg-gradient-to-br from-forest/5 to-transparent">
            <CardContent className="p-6 sm:p-10">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Left Content */}
                <div className="flex-1 text-center lg:text-start">
                  <Badge className="mb-4 bg-forest/10 text-forest border-forest/20">
                    <Compass className="size-3 me-1" />
                    {t("personalityCta.badge")}
                  </Badge>
                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 text-balance">
                    {t("personalityCta.title")}
                  </h2>
                  <p className="text-muted-foreground mb-6 text-balance">
                    {t("personalityCta.description")}
                  </p>
                  <Button asChild size="lg" className="bg-forest hover:bg-forest/90 gap-2">
                    <Link href="/quiz">
                      <Sparkles className="size-4" />
                      {t("personalityCta.takeQuiz")}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>

                {/* Right - Personality Types Preview */}
                <div className="grid grid-cols-2 gap-3 w-full lg:w-auto">
                  {featuredTypes.map((typeId) => {
                    const type = personalityArchetypes[typeId]
                    return (
                      <div
                        key={typeId}
                        className="p-4 rounded-xl bg-card border border-border/50 text-center hover:border-forest/30 transition-colors"
                      >
                        <span className="text-3xl block mb-2">{type.emoji}</span>
                        <span className="text-sm font-medium">{type.name}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Bottom Stats */}
              <div className="mt-8 pt-6 border-t border-border/50 flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-forest" />
                  {t("personalityCta.stat1")}
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-forest" />
                  {t("personalityCta.stat2")}
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-forest" />
                  {t("personalityCta.stat3")}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
