"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, DollarSign, TrendingUp, ArrowRight, Sparkles } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export function DataMonetizationCTA() {
  const { t } = useI18n()

  return (
    <section className="py-4 sm:py-6">
      <div className="container mx-auto px-4">
        <Card className="overflow-hidden border-forest/20 bg-gradient-to-br from-forest/5 via-emerald-50/50 to-background">
          <div className="p-5 sm:p-6">
            <Badge className="bg-forest text-primary-foreground mb-2">
              <DollarSign className="size-3 me-1" />
              {t("dataMonetization.earning")}
            </Badge>

            <h2 className="font-serif text-lg sm:text-xl font-bold mb-2 text-balance">
              {t("dataMonetization.title")}
            </h2>

            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {t("dataMonetization.subtitle")}
            </p>

            {/* Compact steps */}
            <div className="flex flex-wrap gap-4 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <Camera className="size-4 text-forest" />
                <span>{t("submitTrip.guidelines.rule4")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-forest" />
                <span>{t("submitTrip.guidelines.rule1")}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="size-4 text-forest" />
                <span>$10-$50</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-emerald-600" />
                <span>$200+</span>
              </div>
            </div>

            <Button asChild size="sm">
              <Link href="/submit-trip">
                {t("dataMonetization.cta")}
                <ArrowRight className="size-3.5 ms-1.5" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
