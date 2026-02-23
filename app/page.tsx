"use client"

import React, { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { HeroSearch } from "@/components/hero-search"
import { FeaturedDestinations } from "@/components/featured-destinations"
import { ItineraryCard } from "@/components/itinerary-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Itinerary } from "@/lib/types"
import {
  SlidersHorizontal, Sparkles, MapPin, User, Crown,
  MessageSquare, X
} from "lucide-react"
import { FooterAdvanced } from "@/components/footer-advanced"
import { useI18n } from "@/lib/i18n/context"

// Lazy-loaded heavy components
const HowItWorksAdvanced = dynamic(() => import("@/components/how-it-works-advanced").then(m => ({ default: m.HowItWorksAdvanced })))
const TrustSection = dynamic(() => import("@/components/trust-section").then(m => ({ default: m.TrustSection })))
const TestimonialsAdvanced = dynamic(() => import("@/components/testimonials-advanced").then(m => ({ default: m.TestimonialsAdvanced })))
const PricingSection = dynamic(() => import("@/components/pricing-section").then(m => ({ default: m.PricingSection })))
const CTASection = dynamic(() => import("@/components/cta-section").then(m => ({ default: m.CTASection })))
const FilterSidebar = dynamic(() => import("@/components/filter-sidebar").then(m => ({ default: m.FilterSidebar })), { ssr: false })
const AIChatPlanner = dynamic(() => import("@/components/ai-chat-planner").then(m => ({ default: m.AIChatPlanner })), { ssr: false })

export default function MarketplacePage() {
  const [planFilter, setPlanFilter] = useState<"all" | "raw" | "ai-optimized">("all")
  const [sortBy, setSortBy] = useState<string>("popular")
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [allItineraries, setAllItineraries] = useState<Itinerary[]>([])
  const [isChatOpen, setIsChatOpen] = useState(false)
  const { t, locale } = useI18n()

  useEffect(() => {
    fetch(`/api/itineraries?locale=${locale}`)
      .then(res => res.json())
      .then(data => setAllItineraries(Array.isArray(data) ? data : []))
      .catch(() => setAllItineraries([]))
  }, [locale])

  const rawPlans = allItineraries.filter(i => i.planType === "raw")
  const aiPlans = allItineraries.filter(i => i.planType === "ai-optimized")

  const interleavedItineraries: typeof allItineraries = []
  const maxLen = Math.max(rawPlans.length, aiPlans.length)
  for (let i = 0; i < maxLen; i++) {
    if (rawPlans[i]) interleavedItineraries.push(rawPlans[i])
    if (aiPlans[i]) interleavedItineraries.push(aiPlans[i])
  }

  const filteredItineraries = (planFilter === "all"
    ? interleavedItineraries
    : interleavedItineraries.filter(i => i.planType === planFilter)
  ).sort((a, b) => {
    switch (sortBy) {
      case "rating": return (b.rating || 0) - (a.rating || 0)
      case "price-low": return (a.price || 0) - (b.price || 0)
      case "price-high": return (b.price || 0) - (a.price || 0)
      case "newest": return b.id.localeCompare(a.id)
      default: return 0
    }
  })

  const rawPlansCount = rawPlans.length
  const aiPlansCount = aiPlans.length

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* New Hero with AI-Powered Search */}
      <HeroSearch />

      {/* Featured Destinations */}
      <FeaturedDestinations />

      {/* How It Works */}
      <HowItWorksAdvanced />

      {/* Main Marketplace */}
      <div id="itineraries" className="container mx-auto px-4 lg:px-8 xl:px-10 py-8 sm:py-12 lg:py-16 xl:py-20 scroll-mt-20">
        <div className="mb-6 lg:mb-8 xl:mb-10">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs lg:text-sm font-medium text-primary">
              <MapPin className="size-3 lg:size-3.5" />
              {locale === "fa" ? t("home.marketplace.iranTag") : t("home.marketplace.parisTag")}
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-[3.2rem]">{locale === "fa" ? t("home.marketplace.iranTitle") : t("home.marketplace.parisTitle")}</h2>
          <p className="text-muted-foreground text-sm lg:text-base xl:text-lg mt-0.5 lg:mt-2">
            {filteredItineraries.length} {t("home.marketplace.found")}
          </p>

          {/* Plan Type Tabs */}
          <div className="mt-3 lg:mt-5 flex flex-wrap gap-1.5 lg:gap-2">
            <Button
              variant={planFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setPlanFilter("all")}
              className={`text-xs lg:text-sm h-8 lg:h-10 lg:px-5 ${planFilter === "all" ? "" : "bg-transparent"}`}
            >
              {t("home.marketplace.all")}
              <Badge variant="secondary" className="ms-1.5 text-[10px] lg:text-xs h-4 lg:h-5 px-1.5">{allItineraries.length}</Badge>
            </Button>
            <Button
              variant={planFilter === "raw" ? "default" : "outline"}
              size="sm"
              onClick={() => setPlanFilter("raw")}
              className={`text-xs lg:text-sm h-8 lg:h-10 lg:px-5 ${planFilter === "raw" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-transparent border-emerald-300 text-emerald-700 hover:bg-emerald-50"}`}
            >
              <User className="size-3 lg:size-4 me-1" />
              {t("home.marketplace.travelerPlans")}
              <Badge variant="secondary" className="ms-1.5 text-[10px] lg:text-xs h-4 lg:h-5 px-1.5 bg-emerald-100 text-emerald-700">{rawPlansCount}</Badge>
            </Button>
            <Button
              variant={planFilter === "ai-optimized" ? "default" : "outline"}
              size="sm"
              onClick={() => setPlanFilter("ai-optimized")}
              className={`text-xs lg:text-sm h-8 lg:h-10 lg:px-5 ${planFilter === "ai-optimized" ? "bg-amber-500 hover:bg-amber-600" : "bg-transparent border-amber-300 text-amber-700 hover:bg-amber-50"}`}
            >
              <Crown className="size-3 lg:size-4 me-1" />
              {t("home.marketplace.aiPremium")}
              <Badge variant="secondary" className="ms-1.5 text-[10px] lg:text-xs h-4 lg:h-5 px-1.5 bg-amber-100 text-amber-700">{aiPlansCount}</Badge>
            </Button>
          </div>
        </div>

        {/* Mobile Filter */}
        {showMobileFilter && (
          <div className="lg:hidden mb-4">
            <FilterSidebar />
          </div>
        )}

        <div className="flex gap-6 lg:gap-8 xl:gap-10">
          {/* Desktop Filter */}
          <aside className="hidden w-64 lg:w-72 xl:w-80 shrink-0 lg:block">
            <div className="sticky top-28">
              <FilterSidebar />
            </div>
          </aside>

          {/* Itinerary Grid */}
          <main className="flex-1">
            <div className="mb-4 lg:mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="lg:hidden bg-transparent text-xs h-8" onClick={() => setShowMobileFilter(!showMobileFilter)}>
                  <SlidersHorizontal className="me-1.5 size-3.5" />
                  {t("home.marketplace.all")}
                </Button>
                <p className="text-xs lg:text-sm xl:text-base text-muted-foreground">{filteredItineraries.length} {t("home.marketplace.found")}</p>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px] lg:w-[180px] h-8 lg:h-10 text-xs lg:text-sm">
                  <SelectValue placeholder={t("home.sort.popular")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">{t("home.sort.popular")}</SelectItem>
                  <SelectItem value="rating">{t("home.sort.rating")}</SelectItem>
                  <SelectItem value="price-low">{t("home.sort.priceLow")}</SelectItem>
                  <SelectItem value="price-high">{t("home.sort.priceHigh")}</SelectItem>
                  <SelectItem value="newest">{t("home.sort.newest")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 lg:gap-5 xl:gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredItineraries.map((itinerary) => (
                <ItineraryCard key={itinerary.id} itinerary={itinerary} />
              ))}
            </div>

            {filteredItineraries.length === 0 && (
              <div className="text-center py-16 lg:py-24">
                <div className="size-16 lg:size-20 rounded-2xl bg-secondary/60 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="size-8 lg:size-10 text-muted-foreground/40" />
                </div>
                <h3 className="font-semibold lg:text-lg mb-1">{t("home.marketplace.parisTitle")}</h3>
                <p className="text-sm lg:text-base text-muted-foreground">{t("home.marketplace.found")}</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Trust & Why Tripology */}
      <TrustSection />

      {/* Testimonials */}
      <TestimonialsAdvanced />

      {/* Pricing */}
      <PricingSection />

      {/* Final CTA */}
      <CTASection />

      {/* Footer */}
      <FooterAdvanced />

      {/* Floating AI Chat Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-24 end-4 z-40 size-14 lg:size-16 rounded-2xl bg-forest text-white shadow-lg hover:bg-forest/90 flex items-center justify-center transition-all hover:scale-105 active:scale-95 md:bottom-6 lg:bottom-8 lg:end-8"
      >
        {isChatOpen ? (
          <X className="size-6 lg:size-7" />
        ) : (
          <MessageSquare className="size-6 lg:size-7" />
        )}
        {!isChatOpen && (
          <span className="absolute -top-1 -end-1 size-4 lg:size-5 rounded-full bg-amber-400 animate-pulse" />
        )}
      </button>

      {/* AI Chat Panel */}
      <AIChatPlanner isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  )
}
