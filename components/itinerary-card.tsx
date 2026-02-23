"use client"

import React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Star, MapPin, Calendar, ShieldCheck, Sparkles, Zap, UtensilsCrossed, Wallet, Palmtree, Heart, Building, Hotel, Home, Bed, User, Crown, BadgeCheck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Itinerary, PersonalityScores } from "@/lib/types"
import { useI18n } from "@/lib/i18n/context"
import { englishDateToJalali, toPersianDigits } from "@/lib/jalali"
import { formatPrice, getCurrencyLabel } from "@/lib/utils"

interface ItineraryCardProps {
  itinerary: Itinerary
}

// Score labels are resolved from translations inside the component

const scoreIcons: Record<string, React.ReactNode> = {
  adventure: <Zap className="size-3" />,
  culinary: <UtensilsCrossed className="size-3" />,
  budget: <Wallet className="size-3" />,
  relaxation: <Heart className="size-3" />,
  cultural: <Building className="size-3" />,
  nature: <Palmtree className="size-3" />,
}

const levelColors: Record<string, string> = {
  high: "bg-primary/15 text-primary border-primary/30",
  medium: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  low: "bg-muted text-muted-foreground border-border",
}

function getTopScores(scores: PersonalityScores): { key: string; level: string }[] {
  const entries = Object.entries(scores)
  // Sort by level priority: high > medium > low
  const levelPriority = { high: 3, medium: 2, low: 1 }
  return entries
    .sort((a, b) => levelPriority[b[1] as keyof typeof levelPriority] - levelPriority[a[1] as keyof typeof levelPriority])
    .slice(0, 3)
    .map(([key, level]) => ({ key, level }))
}

export function ItineraryCard({ itinerary }: ItineraryCardProps) {
  const { t, locale } = useI18n()
  const topScores = getTopScores(itinerary.personalityScores)

  const scoreLabels: Record<string, string> = {
    adventure: t("itineraryCard.adventure"),
    culinary: t("itineraryCard.culinary"),
    budget: t("itineraryCard.budget"),
    relaxation: t("itineraryCard.relaxation"),
    cultural: t("itineraryCard.cultural"),
    nature: t("itineraryCard.nature"),
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg relative p-0 gap-0">
      {/* Premium Lock Overlay */}
      {itinerary.isPremium && (
        <div className="absolute inset-0 z-30 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      )}

      <Link href={`/itinerary/${itinerary.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={itinerary.coverImage || "/placeholder.svg"}
            alt={itinerary.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover object-[center_35%] transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Plan Number Badge */}
          <div className="absolute start-2 top-2 flex items-center gap-1.5 rounded-full bg-background/95 px-3 py-1.5 text-sm font-bold backdrop-blur sm:start-3 sm:top-3">
            <span className="text-primary">{t("itineraryCard.plan")} {itinerary.planNumber}</span>
          </div>

          {/* Plan Type Badge */}
          <div className="absolute end-2 top-2 sm:end-3 sm:top-3">
            {itinerary.planType === "raw" ? (
              <div className="flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                <User className="size-3" />
                <span>{t("itineraryCard.realTraveler")}</span>
              </div>
            ) : itinerary.isPremium ? (
              <div className="flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                <Crown className="size-3" />
                <span>{t("itineraryCard.premium")}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground backdrop-blur">
                <Sparkles className="size-3" />
                <span>{t("itineraryCard.aiOptimized")}</span>
              </div>
            )}
          </div>

          {itinerary.verified && (
            <div className="absolute bottom-2 start-2 flex items-center gap-1 rounded-full bg-background/95 px-2 py-1 text-xs font-medium backdrop-blur sm:bottom-3 sm:start-3">
              <ShieldCheck className="size-3 text-primary" />
              <span>{t("itineraryCard.verified")}</span>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-3 sm:p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex-1">
            <Link href={`/itinerary/${itinerary.id}`}>
              <h3 className="mb-1 font-serif text-base font-semibold leading-tight text-balance transition-colors group-hover:text-primary sm:text-lg">
                {itinerary.title}
              </h3>
            </Link>
            <div className="flex items-center gap-1 text-xs text-muted-foreground sm:text-sm">
              <MapPin className="size-3 sm:size-3.5" />
              <span>{itinerary.country}</span>
            </div>
          </div>
        </div>

        {/* Personality Scores */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {topScores.map(({ key, level }) => (
            <Badge 
              key={key} 
              variant="outline" 
              className={`text-xs gap-1 ${levelColors[level]}`}
            >
              {scoreIcons[key]}
              <span className="capitalize">{level}</span>
              <span>{scoreLabels[key]}</span>
            </Badge>
          ))}
        </div>

        

        <div className="mb-3 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="size-3 text-muted-foreground sm:size-3.5" />
            <span className="font-medium">{itinerary.duration} {t("itineraryCard.days")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="size-3 fill-amber-400 text-amber-400 sm:size-3.5" />
            <span className="font-semibold">{itinerary.rating}</span>
            <span className="text-muted-foreground">({itinerary.reviewCount})</span>
          </div>
        </div>

        {/* Accommodations Info */}
        {itinerary.accommodations && itinerary.accommodations.totalCount > 0 && (
        <div className="mb-3 rounded-lg border bg-secondary/30 p-2.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium flex items-center gap-1.5">
              <Hotel className="size-3.5 text-primary" />
              {itinerary.accommodations.totalCount} {t("itineraryCard.accommodationsAvailable")}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {itinerary.accommodations.hotels > 0 && (
              <span className="flex items-center gap-1">
                <Hotel className="size-3" /> {itinerary.accommodations.hotels} {t("itineraryCard.hotels")}
              </span>
            )}
            {itinerary.accommodations.airbnb > 0 && (
              <span className="flex items-center gap-1">
                <Home className="size-3" /> {itinerary.accommodations.airbnb} {t("itineraryCard.airbnb")}
              </span>
            )}
            {itinerary.accommodations.hostels > 0 && (
              <span className="flex items-center gap-1">
                <Bed className="size-3" /> {itinerary.accommodations.hostels} {t("itineraryCard.hostels")}
              </span>
            )}
          </div>
        </div>
        )}

        {/* Traveler Profile for Raw Plans */}
        {itinerary.planType === "raw" && itinerary.traveler ? (
          <div className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800 p-2.5">
            <div className="flex items-center gap-3">
              <div className="relative size-10 rounded-full overflow-hidden shrink-0">
                <Image src={itinerary.traveler.avatar || "/placeholder.svg"} alt={itinerary.traveler.name} fill sizes="40px" className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-sm truncate">{itinerary.traveler.name}</span>
                  {itinerary.traveler.verified && <BadgeCheck className="size-3.5 text-emerald-600 shrink-0" />}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{itinerary.traveler.country}</span>
                  <span>•</span>
                  <span>{itinerary.traveler.tripsShared} {t("itineraryCard.tripsShared")}</span>
                </div>
              </div>
              <div className="text-end shrink-0">
                <div className="flex items-center gap-0.5">
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold">{itinerary.traveler.rating}</span>
                </div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-emerald-200 dark:border-emerald-800">
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                {t("itineraryCard.authenticData")}
              </p>
            </div>
          </div>
        ) : (
          /* AI Data Source Banner */
          itinerary.aiDataSource ? (
          <div className="mb-3 rounded-lg border border-primary/20 bg-primary/5 p-2.5">
            <div className="flex items-start gap-2">
              <Sparkles className="size-4 text-primary shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <span className="font-medium text-foreground">{t("itineraryCard.aiOptimized")}</span>
                <p className="text-muted-foreground mt-0.5">
                  {locale === "fa"
                    ? `از ${toPersianDigits(itinerary.aiDataSource.travelersCount.toLocaleString("fa-IR"))} مسافر، به‌روزرسانی ${englishDateToJalali(itinerary.aiDataSource.lastUpdated)}`
                    : `From ${itinerary.aiDataSource.travelersCount.toLocaleString()} travelers, updated ${itinerary.aiDataSource.lastUpdated}`
                  }
                </p>
              </div>
            </div>
          </div>
          ) : null
        )}

        {/* Travel Budget Range */}
        <div className="border-t pt-3">
          <div className="text-xs text-muted-foreground mb-1">{t("itineraryCard.estimatedBudget")}</div>
          <div className="font-serif text-xl font-bold text-foreground sm:text-2xl">
            {formatPrice(itinerary.budgetRange.min, locale)} - {formatPrice(itinerary.budgetRange.max, locale, { unit: false })} 
            <span className="text-base font-normal text-muted-foreground ms-1">{getCurrencyLabel(locale)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-2 p-3 pt-0 sm:p-4 sm:pt-0">
        <Button asChild variant="outline" className="flex-1 text-xs sm:text-sm bg-transparent">
          <Link href={`/itinerary/${itinerary.id}`}>{t("itineraryCard.viewDetails")}</Link>
        </Button>
        {itinerary.planType === "raw" && itinerary.price ? (
          <Button className="flex-1 text-xs sm:text-sm gap-1.5 bg-emerald-600 hover:bg-emerald-700">
            <span className="font-bold">{formatPrice(itinerary.price, locale)}</span>
            <span>{t("itineraryCard.buyTrip")}</span>
          </Button>
        ) : itinerary.isPremium ? (
          <Button className="flex-1 text-xs sm:text-sm gap-1.5 bg-amber-500 hover:bg-amber-600">
            <Crown className="size-3.5" />
            Premium
          </Button>
        ) : (
          <Button asChild className="flex-1 text-xs sm:text-sm">
            <Link href={`/itinerary/${itinerary.id}`}>{t("itineraryCard.getFreePlan")}</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
