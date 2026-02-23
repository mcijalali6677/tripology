"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { FooterAdvanced } from "@/components/footer-advanced"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ItineraryCard } from "@/components/itinerary-card"
import type { Itinerary } from "@/lib/types"
import {
  Search, MapPin, SlidersHorizontal, X, Star, Clock, DollarSign,
  Grid3X3, List, Map as MapIcon, Sparkles, ArrowRight, Globe,
  ChevronDown, Heart, Users, Calendar, Compass, TrendingUp,
  Mountain, Utensils, Camera, Palette, TreePalm, Waves, Building2,
  Plane, Filter
} from "lucide-react"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"
import { useI18n } from "@/lib/i18n/context"

const AIChatPlanner = dynamic(
  () => import("@/components/ai-chat-planner").then(m => ({ default: m.AIChatPlanner })),
  { ssr: false }
)

const TRAVEL_STYLES = [
  { id: "adventure", label: "Adventure", icon: <Mountain className="size-4" />, color: "bg-orange-50 text-orange-700 border-orange-200" },
  { id: "cultural", label: "Cultural", icon: <Palette className="size-4" />, color: "bg-purple-50 text-purple-700 border-purple-200" },
  { id: "beach", label: "Beach", icon: <Waves className="size-4" />, color: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "city", label: "City Break", icon: <Building2 className="size-4" />, color: "bg-slate-50 text-slate-700 border-slate-200" },
  { id: "nature", label: "Nature", icon: <TreePalm className="size-4" />, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { id: "foodie", label: "Foodie", icon: <Utensils className="size-4" />, color: "bg-amber-50 text-amber-700 border-amber-200" },
  { id: "photography", label: "Photography", icon: <Camera className="size-4" />, color: "bg-rose-50 text-rose-700 border-rose-200" },
  { id: "budget", label: "Budget", icon: <DollarSign className="size-4" />, color: "bg-green-50 text-green-700 border-green-200" },
]

const DESTINATIONS = [
  { id: "paris", name: "Paris", country: "France", emoji: "🇫🇷", plans: 48 },
  { id: "tokyo", name: "Tokyo", country: "Japan", emoji: "🇯🇵", plans: 35 },
  { id: "bali", name: "Bali", country: "Indonesia", emoji: "🇮🇩", plans: 42 },
  { id: "istanbul", name: "Istanbul", country: "Turkey", emoji: "🇹🇷", plans: 28 },
  { id: "barcelona", name: "Barcelona", country: "Spain", emoji: "🇪🇸", plans: 31 },
  { id: "marrakech", name: "Marrakech", country: "Morocco", emoji: "🇲🇦", plans: 22 },
  { id: "rome", name: "Rome", country: "Italy", emoji: "🇮🇹", plans: 38 },
  { id: "london", name: "London", country: "UK", emoji: "🇬🇧", plans: 44 },
  { id: "new-york", name: "New York", country: "USA", emoji: "🇺🇸", plans: 52 },
  { id: "dubai", name: "Dubai", country: "UAE", emoji: "🇦🇪", plans: 19 },
]

const BUDGET_RANGES_EN = [
  { id: "budget", label: "Budget", range: "$0 - $50/day" },
  { id: "mid", label: "Mid-Range", range: "$50 - $150/day" },
  { id: "luxury", label: "Luxury", range: "$150+/day" },
]

const BUDGET_RANGES_FA = [
  { id: "budget", label: "اقتصادی", range: "۰ - ۲,۰۰۰,۰۰۰ تومان/روز" },
  { id: "mid", label: "متوسط", range: "۲,۰۰۰,۰۰۰ - ۶,۰۰۰,۰۰۰ تومان/روز" },
  { id: "luxury", label: "لاکچری", range: "۶,۰۰۰,۰۰۰+ تومان/روز" },
]

const DURATION_OPTIONS = [
  { id: "weekend", label: "Weekend", days: "1-3 days" },
  { id: "week", label: "One Week", days: "4-7 days" },
  { id: "extended", label: "Extended", days: "8-14 days" },
  { id: "long", label: "Long Trip", days: "15+ days" },
]

export default function ExplorePage() {
  const { t, locale } = useI18n()
  const searchParams = useSearchParams()
  const isFa = locale === "fa"
  const BUDGET_RANGES = isFa ? BUDGET_RANGES_FA : BUDGET_RANGES_EN
  const initialQuery = searchParams.get("q") || ""
  const initialDestination = searchParams.get("destination") || ""

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [selectedDestination, setSelectedDestination] = useState(initialDestination)
  const [selectedBudget, setSelectedBudget] = useState<string>("")
  const [selectedDuration, setSelectedDuration] = useState<string>("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("popular")
  const [allItineraries, setAllItineraries] = useState<Itinerary[]>([])
  const [isChatOpen, setIsChatOpen] = useState(searchParams.get("ai") === "true")
  const [savedTrips, setSavedTrips] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch("/api/itineraries")
      .then(res => res.json())
      .then(data => setAllItineraries(Array.isArray(data) ? data : []))
      .catch(() => setAllItineraries([]))
  }, [])

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev =>
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    )
  }

  const toggleSaved = (id: string) => {
    setSavedTrips(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filteredItineraries = useMemo(() => {
    let filtered = [...allItineraries]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(it =>
        it.title.toLowerCase().includes(q) ||
        it.destination.toLowerCase().includes(q) ||
        it.country.toLowerCase().includes(q) ||
        it.travelStyles.some(s => s.toLowerCase().includes(q))
      )
    }

    if (selectedDestination) {
      filtered = filtered.filter(it =>
        it.destination.toLowerCase().includes(selectedDestination.toLowerCase())
      )
    }

    if (selectedStyles.length > 0) {
      filtered = filtered.filter(it =>
        selectedStyles.some(style =>
          it.travelStyles.some(s => s.toLowerCase().includes(style))
        )
      )
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating": return (b.rating || 0) - (a.rating || 0)
        case "price-low": return (a.price || 0) - (b.price || 0)
        case "price-high": return (b.price || 0) - (a.price || 0)
        case "newest": return b.id.localeCompare(a.id)
        default: return 0
      }
    })
  }, [allItineraries, searchQuery, selectedDestination, selectedStyles, sortBy])

  const activeFilterCount = [selectedDestination, ...selectedStyles, selectedBudget, selectedDuration].filter(Boolean).length

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedStyles([])
    setSelectedDestination("")
    setSelectedBudget("")
    setSelectedDuration("")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Search Header */}
      <section className="border-b bg-gradient-to-b from-secondary/30 to-background sticky top-16 z-30">
        <div className="container mx-auto px-4 py-4">
          {/* Search Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("explorePage.searchPlaceholder")}
                className="w-full rounded-xl border bg-card ps-10 pe-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute end-3 top-1/2 -translate-y-1/2"
                >
                  <X className="size-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className={cn("bg-transparent relative", showFilters && "bg-forest text-white hover:bg-forest/90")}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="size-4 me-1.5" />
              {t("explorePage.filters")}
              {activeFilterCount > 0 && (
                <Badge className="ms-1.5 size-5 p-0 justify-center text-[10px] bg-forest text-white">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent"
              onClick={() => setIsChatOpen(true)}
            >
              <Sparkles className="size-4 me-1.5 text-amber-500" />
              {t("explorePage.aiPlanner")}
            </Button>
          </div>

          {/* Travel Style Chips */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
            {TRAVEL_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => toggleStyle(style.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all",
                  selectedStyles.includes(style.id)
                    ? "bg-forest text-white border-forest"
                    : style.color
                )}
              >
                {style.icon}
                {style.label}
              </button>
            ))}
          </div>

          {/* Expanded Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                  {/* Destination */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">{t("explorePage.destination")}</label>
                    <div className="flex flex-wrap gap-1.5">
                      {DESTINATIONS.slice(0, 6).map((dest) => (
                        <button
                          key={dest.id}
                          onClick={() => setSelectedDestination(selectedDestination === dest.id ? "" : dest.id)}
                          className={cn(
                            "rounded-full border px-2.5 py-1 text-xs transition-all",
                            selectedDestination === dest.id
                              ? "bg-forest text-white border-forest"
                              : "bg-card hover:bg-secondary/60"
                          )}
                        >
                          {dest.emoji} {dest.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">{t("explorePage.budget")}</label>
                    <div className="flex flex-wrap gap-1.5">
                      {BUDGET_RANGES.map((budget) => (
                        <button
                          key={budget.id}
                          onClick={() => setSelectedBudget(selectedBudget === budget.id ? "" : budget.id)}
                          className={cn(
                            "rounded-full border px-2.5 py-1 text-xs transition-all",
                            selectedBudget === budget.id
                              ? "bg-forest text-white border-forest"
                              : "bg-card hover:bg-secondary/60"
                          )}
                        >
                          {budget.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">{t("explorePage.duration")}</label>
                    <div className="flex flex-wrap gap-1.5">
                      {DURATION_OPTIONS.map((dur) => (
                        <button
                          key={dur.id}
                          onClick={() => setSelectedDuration(selectedDuration === dur.id ? "" : dur.id)}
                          className={cn(
                            "rounded-full border px-2.5 py-1 text-xs transition-all",
                            selectedDuration === dur.id
                              ? "bg-forest text-white border-forest"
                              : "bg-card hover:bg-secondary/60"
                          )}
                        >
                          {dur.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <div className="flex justify-end mt-3">
                    <button onClick={clearAllFilters} className="text-xs text-forest hover:underline">
                      {t("explorePage.clearAll")}
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Results */}
      <div className="container mx-auto px-4 py-6">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-serif text-xl font-bold sm:text-2xl">
              {searchQuery ? `${t("explorePage.resultsFor")} "${searchQuery}"` : t("explorePage.exploreAll")}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {filteredItineraries.length} {t("explorePage.plansFound")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 rounded-lg border p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "rounded-md p-1.5 transition-colors",
                  viewMode === "grid" ? "bg-secondary" : "hover:bg-secondary/60"
                )}
              >
                <Grid3X3 className="size-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "rounded-md p-1.5 transition-colors",
                  viewMode === "list" ? "bg-secondary" : "hover:bg-secondary/60"
                )}
              >
                <List className="size-4" />
              </button>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border bg-card px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-forest/30"
            >
              <option value="popular">{t("explorePage.sortPopular")}</option>
              <option value="rating">{t("explorePage.sortRating")}</option>
              <option value="price-low">{t("explorePage.sortPriceLow")}</option>
              <option value="price-high">{t("explorePage.sortPriceHigh")}</option>
              <option value="newest">{t("explorePage.sortNewest")}</option>
            </select>
          </div>
        </div>

        {/* Active Filters Summary */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs text-muted-foreground">{t("explorePage.activeFilters")}:</span>
            {selectedDestination && (
              <Badge variant="secondary" className="gap-1 text-xs">
                <MapPin className="size-3" />
                {DESTINATIONS.find(d => d.id === selectedDestination)?.name || selectedDestination}
                <button onClick={() => setSelectedDestination("")}>
                  <X className="size-3" />
                </button>
              </Badge>
            )}
            {selectedStyles.map(style => (
              <Badge key={style} variant="secondary" className="gap-1 text-xs">
                {TRAVEL_STYLES.find(s => s.id === style)?.label}
                <button onClick={() => toggleStyle(style)}>
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Grid */}
        {filteredItineraries.length > 0 ? (
          <div className={cn(
            "grid gap-4",
            viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 max-w-3xl"
          )}>
            {filteredItineraries.map((itinerary, i) => (
              <motion.div
                key={itinerary.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ItineraryCard itinerary={itinerary} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="size-20 rounded-2xl bg-secondary/60 flex items-center justify-center mx-auto mb-4">
              <Compass className="size-10 text-muted-foreground/40" />
            </div>
            <h3 className="font-serif text-xl font-semibold mb-2">{t("explorePage.noResults")}</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              {t("explorePage.noResultsDesc")}
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" className="bg-transparent" onClick={clearAllFilters}>
                {t("explorePage.clearFilters")}
              </Button>
              <Button className="bg-forest hover:bg-forest/90" onClick={() => setIsChatOpen(true)}>
                <Sparkles className="size-4 me-2" />
                {t("explorePage.askAI")}
              </Button>
            </div>
          </div>
        )}

        {/* Load More */}
        {filteredItineraries.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" className="bg-transparent rounded-xl">
              {t("explorePage.loadMore")}
              <ArrowRight className="size-4 ms-2" />
            </Button>
          </div>
        )}
      </div>

      <FooterAdvanced />

      {/* AI Chat */}
      <AIChatPlanner isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  )
}
