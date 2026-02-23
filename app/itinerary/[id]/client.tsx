"use client"

import React, { useState, useMemo, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Star, MapPin, Calendar, Heart, Share2, ArrowLeft, Clock,
  Camera, DollarSign, Sparkles, ChevronDown, ChevronUp,
  Utensils, Bed, Lightbulb, Users, Train, Wand2, Hotel,
  Home, Building, CheckCircle2, Circle, FileText, Plane,
  Shirt, Smartphone, Sun, Sunset, Moon, Sunrise, Footprints,
  Bus, Car, Bike, Navigation, MessageCircle, ArrowDown,
  RefreshCw, Shield, Download, ExternalLink, Map as MapIcon,
  ListChecks, Luggage, Check, BookOpen, Coffee, Play,
  ChevronRight, Loader2, X, Maximize2, Minimize2
} from "lucide-react"
import type { Itinerary, DayActivity, TripDay } from "@/lib/types"
import { useI18n } from "@/lib/i18n/context"
import { cn, formatPrice } from "@/lib/utils"

const TripMapDynamic = dynamic(
  () => import("@/components/trip-map").then(m => ({ default: m.TripMap })),
  { ssr: false, loading: () => <div className="h-full min-h-[300px] bg-secondary/30 rounded-xl animate-pulse" /> }
)

const AIChatPlanner = dynamic(
  () => import("@/components/ai-chat-planner").then(m => ({ default: m.AIChatPlanner })),
  { ssr: false }
)

const AgenticBooking = dynamic(
  () => import("@/components/agentic-booking").then(m => ({ default: m.AgenticBooking })),
  { ssr: false }
)

interface ItineraryDetailPageClientProps {
  itinerary: Itinerary | null
}

/* ─── Time Period Styling ─── */
const TIME_PERIODS: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  earlyMorning: { label: "Early Morning", icon: <Sunrise className="size-4" />, color: "text-amber-600 bg-amber-50 border-amber-200" },
  morning: { label: "Morning", icon: <Sun className="size-4" />, color: "text-orange-600 bg-orange-50 border-orange-200" },
  afternoon: { label: "Afternoon", icon: <Coffee className="size-4" />, color: "text-blue-600 bg-blue-50 border-blue-200" },
  evening: { label: "Evening", icon: <Sunset className="size-4" />, color: "text-purple-600 bg-purple-50 border-purple-200" },
  night: { label: "Night", icon: <Moon className="size-4" />, color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
}

const typeIcons: Record<string, React.ReactNode> = {
  transport: <Train className="size-3.5" />,
  accommodation: <Bed className="size-3.5" />,
  activity: <Camera className="size-3.5" />,
  food: <Utensils className="size-3.5" />,
}

const typeColors: Record<string, string> = {
  transport: "bg-slate-100 text-slate-600",
  accommodation: "bg-violet-100 text-violet-600",
  activity: "bg-blue-100 text-blue-600",
  food: "bg-orange-100 text-orange-600",
}

/* ─── ActivityCard Sub-component ─── */
function ActivityCard({ activity, index }: { activity: DayActivity; index: number }) {
  const [showAlternatives, setShowAlternatives] = useState(false)
  const { locale } = useI18n()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group relative"
    >
      <div className="flex gap-3">
        {/* Timeline dot + line */}
        <div className="flex flex-col items-center pt-2">
          <div className={cn("size-3 rounded-full ring-2 ring-offset-1 shrink-0", typeColors[activity.type] || "bg-gray-200")} />
          <div className="w-0.5 flex-1 bg-border mt-1" />
        </div>

        {/* Content */}
        <div className="flex-1 pb-3">
          <div className="rounded-xl border bg-card p-3.5 hover:shadow-md transition-all duration-200 hover:border-forest/20">
            <div className="flex items-start justify-between mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <div className={cn("size-7 rounded-lg flex items-center justify-center shrink-0", typeColors[activity.type] || "bg-gray-100 text-gray-600")}>
                  {typeIcons[activity.type] || <MapPin className="size-3.5" />}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold leading-tight truncate">{activity.title}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-0.5 truncate">
                      <MapPin className="size-2.5 shrink-0" />{activity.location}
                    </span>
                    {activity.duration && (
                      <><span>•</span><span className="flex items-center gap-0.5 shrink-0"><Clock className="size-2.5" />{activity.duration}</span></>
                    )}
                    {activity.cost !== undefined && activity.cost > 0 && (
                      <><span>•</span><span className="text-forest font-medium shrink-0">{formatPrice(activity.cost, locale)}</span></>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons (visible on hover) */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ms-2">
                {activity.alternatives && activity.alternatives.length > 0 && (
                  <button
                    onClick={() => setShowAlternatives(!showAlternatives)}
                    className="size-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-forest transition-colors"
                    title="Swap activity"
                  >
                    <RefreshCw className="size-3.5" />
                  </button>
                )}
                <button className="size-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-rose-500 transition-colors" title="Save">
                  <Heart className="size-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">{activity.description}</p>

            {/* AI Pro-tip */}
            {activity.tips && (
              <div className="mt-2 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[11px] text-amber-800 flex items-start gap-1.5">
                <Lightbulb className="size-3 shrink-0 mt-0.5 text-amber-600" />
                <span>{activity.tips}</span>
              </div>
            )}

            {/* Transport to next */}
            {activity.transportToNext && activity.transportToNext.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {activity.transportToNext.map((t, i) => (
                  <span key={i} className="inline-flex items-center gap-1 rounded-full bg-secondary/60 px-2 py-0.5 text-[10px] text-muted-foreground">
                    <Navigation className="size-2.5" />
                    {t.type}: {t.duration}{t.cost !== undefined && t.cost > 0 && ` (${formatPrice(t.cost, locale)})`}
                  </span>
                ))}
              </div>
            )}

            {/* Alternatives */}
            <AnimatePresence>
              {showAlternatives && activity.alternatives && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="mt-3 pt-3 border-t space-y-2">
                    <p className="text-[11px] font-medium text-muted-foreground flex items-center gap-1"><RefreshCw className="size-3" /> Alternative activities:</p>
                    {activity.alternatives.map((alt, i) => (
                      <button key={i} className="w-full text-start rounded-lg border border-dashed p-2.5 hover:border-forest hover:bg-forest/5 transition-colors">
                        <div className="text-xs font-medium">{alt.title}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{alt.description}</div>
                        {alt.cost !== undefined && <span className="text-[10px] text-forest font-medium">{formatPrice(alt.cost, locale)}</span>}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── DaySection Sub-component ─── */
function DaySection({ day, isExpanded, onToggle }: { day: TripDay; isExpanded: boolean; onToggle: () => void }) {
  const { locale } = useI18n()
  const allActivities = Object.entries(day.periods)
    .filter(([, acts]) => acts && acts.length > 0)
    .flatMap(([, acts]) => acts || [])

  const dayCost = allActivities.reduce((s, a) => s + (a.cost || 0), 0)

  return (
    <div className={cn("rounded-2xl border bg-card overflow-hidden transition-all", isExpanded && "ring-1 ring-forest/10 shadow-sm")}>
      <button onClick={onToggle} className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors text-start">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-forest text-white flex items-center justify-center font-bold text-sm shrink-0">{day.day}</div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm">{day.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{day.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <span>{allActivities.length} activities</span>
            <span>•</span>
            <span className="text-forest font-medium">{formatPrice(dayCost, locale)}</span>
          </div>
          <ChevronDown className={cn("size-5 text-muted-foreground transition-transform duration-200", isExpanded && "rotate-180")} />
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4 space-y-4">
              {Object.entries(day.periods).map(([period, activities]) => {
                if (!activities || activities.length === 0) return null
                const timeInfo = TIME_PERIODS[period] || { label: period, icon: <Clock className="size-4" />, color: "text-gray-600 bg-gray-50 border-gray-200" }
                return (
                  <div key={period}>
                    <div className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium mb-3 border", timeInfo.color)}>
                      {timeInfo.icon}{timeInfo.label}
                    </div>
                    <div className="space-y-0">
                      {activities.map((activity, i) => (
                        <ActivityCard key={i} activity={activity} index={i} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Main Page Component ─── */
export default function ItineraryDetailPageClient({ itinerary }: ItineraryDetailPageClientProps) {
  const { t, locale } = useI18n()
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]))
  const [liked, setLiked] = useState(false)
  const [activeTab, setActiveTab] = useState<"itinerary" | "map" | "checklist" | "booking">("itinerary")
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [showMapPanel, setShowMapPanel] = useState(false)

  const toggleDay = (d: number) => setExpandedDays(prev => {
    const next = new Set(prev)
    if (next.has(d)) next.delete(d); else next.add(d)
    return next
  })

  const totalCost = useMemo(() => {
    if (!itinerary) return 0
    return itinerary.tripDays.reduce((sum, day) =>
      sum + Object.values(day.periods).flat().filter(Boolean).reduce((s, a) => s + ((a as DayActivity)?.cost || 0), 0)
    , 0)
  }, [itinerary])

  const totalActivities = useMemo(() => {
    if (!itinerary) return 0
    return itinerary.tripDays.reduce((sum, day) =>
      sum + Object.values(day.periods).flat().filter(Boolean).length
    , 0)
  }, [itinerary])

  /* ─── Not Found ─── */
  if (!itinerary) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="size-20 rounded-2xl bg-secondary/60 flex items-center justify-center mx-auto mb-4">
            <MapPin className="size-10 text-muted-foreground/40" />
          </div>
          <h2 className="font-serif text-2xl font-bold mb-2">{t("itineraryDetail.notFound")}</h2>
          <p className="text-muted-foreground mb-6">This plan may have been removed or doesn&apos;t exist.</p>
          <Button asChild><Link href="/explore"><ArrowLeft className="size-4 me-2" />{t("common.back")}</Link></Button>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: "itinerary" as const, label: "Itinerary", icon: <Calendar className="size-4" /> },
    { id: "map" as const, label: "Map", icon: <MapIcon className="size-4" /> },
    { id: "checklist" as const, label: "Checklist", icon: <ListChecks className="size-4" /> },
    { id: "booking" as const, label: "Book", icon: <Luggage className="size-4" /> },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ─── Hero Cover Section ─── */}
      <section className="relative h-[260px] sm:h-[340px] overflow-hidden">
        <Image
          src={itinerary.coverImage || "/placeholder.svg"}
          alt={itinerary.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

        {/* Top Controls */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
          <Button variant="ghost" size="sm" className="rounded-xl bg-white/20 backdrop-blur-md text-white hover:bg-white/30" asChild>
            <Link href="/"><ArrowLeft className="size-4 me-1.5" />{t("common.back")}</Link>
          </Button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLiked(!liked)}
              className={cn("size-9 rounded-xl backdrop-blur-md flex items-center justify-center transition-colors",
                liked ? "bg-rose-500 text-white" : "bg-white/20 text-white hover:bg-white/30"
              )}
            >
              <Heart className={cn("size-4", liked && "fill-current")} />
            </button>
            <button className="size-9 rounded-xl bg-white/20 backdrop-blur-md text-white hover:bg-white/30 flex items-center justify-center">
              <Share2 className="size-4" />
            </button>
            <button className="size-9 rounded-xl bg-white/20 backdrop-blur-md text-white hover:bg-white/30 flex items-center justify-center">
              <Download className="size-4" />
            </button>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6">
          <div className="container max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-1.5 mb-2">
              <Badge className={cn("text-[10px]",
                itinerary.planType === "ai-optimized"
                  ? "bg-amber-500/20 text-amber-200 border-amber-400/30"
                  : "bg-emerald-500/20 text-emerald-200 border-emerald-400/30"
              )}>
                <Sparkles className="size-2.5 me-1" />
                {itinerary.planType === "ai-optimized" ? t("itineraryDetail.aiOptimized") : "Traveler Plan"}
              </Badge>
              {itinerary.isPremium && <Badge className="bg-white/20 text-white border-white/30 text-[10px]">Premium</Badge>}
              <Badge className="bg-white/15 text-white/90 border-white/20 text-[10px]">{itinerary.level}</Badge>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-1">{itinerary.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
              <span className="flex items-center gap-1"><MapPin className="size-3.5" />{itinerary.destination}, {itinerary.country}</span>
              <span className="flex items-center gap-1"><Calendar className="size-3.5" />{itinerary.duration} days</span>
              <span className="flex items-center gap-1"><Star className="size-3.5 fill-amber-400 text-amber-400" />{itinerary.rating} ({itinerary.reviewCount} reviews)</span>
              <span className="flex items-center gap-1"><Users className="size-3.5" />{itinerary.aiDataSource?.travelersCount?.toLocaleString() || "5K+"} data points</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Tab Navigation (sticky) ─── */}
      <div className="border-b sticky top-16 z-20 bg-card/95 backdrop-blur-md">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-1 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                  activeTab === tab.id ? "border-forest text-forest" : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.icon}{tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Content ─── */}
      <div className="container max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-8">
          {/* Main column */}
          <main className="flex-1 min-w-0">

            {/* ITINERARY TAB */}
            {activeTab === "itinerary" && (
              <div className="space-y-4">
                {/* AI Source Card */}
                {itinerary.planType === "ai-optimized" && (
                  <Card className="p-4 border-forest/20 bg-forest/5 mb-2">
                    <div className="flex items-start gap-3">
                      <div className="size-10 rounded-full bg-forest/10 flex items-center justify-center shrink-0">
                        <Sparkles className="size-5 text-forest" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm">{t("itineraryDetail.aiGenerated")}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Optimized from {itinerary.aiDataSource?.travelersCount?.toLocaleString() || "5,000+"} real traveler experiences.
                          Last updated {itinerary.aiDataSource?.lastUpdated || "recently"}.
                        </p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Quick Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-xl border bg-card p-3 text-center">
                    <Calendar className="size-5 text-forest mx-auto mb-1" />
                    <div className="text-lg font-bold">{itinerary.duration}</div>
                    <div className="text-[11px] text-muted-foreground">{t("itineraryDetail.daysPlanned")}</div>
                  </div>
                  <div className="rounded-xl border bg-card p-3 text-center">
                    <DollarSign className="size-5 text-forest mx-auto mb-1" />
                    <div className="text-lg font-bold">${totalCost || `${itinerary.budgetRange.min}-${itinerary.budgetRange.max}`}</div>
                    <div className="text-[11px] text-muted-foreground">{t("itineraryDetail.totalBudget")}</div>
                  </div>
                  <div className="rounded-xl border bg-card p-3 text-center">
                    <Camera className="size-5 text-forest mx-auto mb-1" />
                    <div className="text-lg font-bold">{totalActivities}</div>
                    <div className="text-[11px] text-muted-foreground">{t("itineraryDetail.activities")}</div>
                  </div>
                  <div className="rounded-xl border bg-card p-3 text-center">
                    <Star className="size-5 text-amber-500 mx-auto mb-1" />
                    <div className="text-lg font-bold">{itinerary.rating}</div>
                    <div className="text-[11px] text-muted-foreground">Rating</div>
                  </div>
                </div>

                {/* Inline Map Toggle (for mobile) */}
                <button
                  onClick={() => setShowMapPanel(!showMapPanel)}
                  className="lg:hidden w-full flex items-center justify-between rounded-xl border bg-card p-3 hover:bg-secondary/30 transition-colors"
                >
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <MapIcon className="size-4 text-forest" /> View Route Map
                  </span>
                  <ChevronRight className={cn("size-4 transition-transform", showMapPanel && "rotate-90")} />
                </button>
                <AnimatePresence>
                  {showMapPanel && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden overflow-hidden">
                      <div className="h-[250px] rounded-xl overflow-hidden border">
                        <TripMapDynamic roadmap={{
                          totalDays: itinerary.duration,
                          cities: [{ id: 1, name: itinerary.destination, country: itinerary.country, startDay: 1, endDay: itinerary.duration, days: itinerary.duration, coordinates: { lat: 48.8566, lng: 2.3522 }, highlights: itinerary.travelStyles, activities: [], photos: [], costs: { total: totalCost } }],
                          transport: [],
                        }} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Day-by-Day Timeline */}
                <div className="space-y-3">
                  {itinerary.tripDays.map((day) => (
                    <DaySection key={day.day} day={day} isExpanded={expandedDays.has(day.day)} onToggle={() => toggleDay(day.day)} />
                  ))}
                </div>

                {/* CTA */}
                <Card className="p-5 bg-gradient-to-r from-forest/5 via-emerald-50 to-forest/5 border-forest/20">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 text-center sm:text-start">
                      <h3 className="font-semibold">Want a Personalized Version?</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">Customize this itinerary for your dates, budget, and interests.</p>
                    </div>
                    <Button size="lg" className="shrink-0 bg-forest hover:bg-forest/90 rounded-xl" asChild>
                      <Link href="/custom-trip"><Wand2 className="size-4 me-2" />Build My Trip</Link>
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {/* MAP TAB */}
            {activeTab === "map" && (
              <div className="space-y-4">
                <div className="h-[500px] rounded-2xl overflow-hidden border">
                  <TripMapDynamic roadmap={{
                    totalDays: itinerary.duration,
                    cities: [{ id: 1, name: itinerary.destination, country: itinerary.country, startDay: 1, endDay: itinerary.duration, days: itinerary.duration, coordinates: { lat: 48.8566, lng: 2.3522 }, highlights: itinerary.travelStyles, activities: [], photos: [], costs: { total: totalCost } }],
                    transport: [],
                  }} />
                </div>
                <p className="text-xs text-muted-foreground text-center">Interactive map showing key locations in {itinerary.destination}</p>
              </div>
            )}

            {/* CHECKLIST TAB */}
            {activeTab === "checklist" && (
              <div className="space-y-4">
                {itinerary.checklist?.items && itinerary.checklist.items.length > 0 ? (
                  <>
                    {["essential", "documents", "packing", "booking"].map((category) => {
                      const items = itinerary.checklist.items.filter(i => i.category === category)
                      if (items.length === 0) return null
                      const catIcons: Record<string, React.ReactNode> = { essential: <Shield className="size-4" />, documents: <FileText className="size-4" />, packing: <Shirt className="size-4" />, booking: <Plane className="size-4" /> }
                      return (
                        <Card key={category} className="p-4">
                          <h3 className="font-semibold text-sm capitalize mb-3 flex items-center gap-2 text-forest">
                            {catIcons[category] || <ListChecks className="size-4" />}{category}
                          </h3>
                          <div className="space-y-2">
                            {items.map((item) => (
                              <label key={item.id} className="flex items-start gap-3 cursor-pointer group p-2 rounded-lg hover:bg-secondary/30 transition-colors">
                                <input type="checkbox" className="mt-1 rounded border-gray-300 text-forest focus:ring-forest" />
                                <div className="flex-1 min-w-0">
                                  <span className="text-sm group-hover:text-forest transition-colors">{item.title}</span>
                                  {item.description && <p className="text-[11px] text-muted-foreground">{item.description}</p>}
                                </div>
                                <Badge variant="secondary" className={cn("text-[10px] shrink-0",
                                  item.priority === "high" && "bg-rose-50 text-rose-700",
                                  item.priority === "medium" && "bg-amber-50 text-amber-700",
                                  item.priority === "low" && "bg-blue-50 text-blue-700"
                                )}>{item.priority}</Badge>
                              </label>
                            ))}
                          </div>
                        </Card>
                      )
                    })}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <ListChecks className="size-12 text-muted-foreground/30 mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">No checklist yet</h3>
                    <p className="text-sm text-muted-foreground">Checklist will be generated when you purchase this plan.</p>
                  </div>
                )}
              </div>
            )}

            {/* BOOKING TAB */}
            {activeTab === "booking" && (
              <div className="space-y-4">
                <Card className="p-6 text-center bg-gradient-to-br from-forest/5 to-emerald-50 border-forest/20">
                  <Luggage className="size-12 text-forest mx-auto mb-3" />
                  <h3 className="font-serif text-xl font-bold mb-2">Ready to book this trip?</h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">Get the full itinerary with booking links, offline access, and AI assistance.</p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button size="lg" className="bg-forest hover:bg-forest/90 rounded-xl px-8">
                      <DollarSign className="size-4 me-1" />Purchase Plan — ${itinerary.price || 29}
                    </Button>
                    <Button size="lg" variant="outline" className="bg-transparent rounded-xl border-forest/30 text-forest hover:bg-forest/10" onClick={() => setIsBookingOpen(true)}>
                      <Plane className="size-4 me-1" />AI Book Everything
                    </Button>
                    <Button size="lg" variant="outline" className="bg-transparent rounded-xl" onClick={() => setIsChatOpen(true)}>
                      <Sparkles className="size-4 me-1" />Try AI Version Free
                    </Button>
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Shield className="size-3" /> Money-back guarantee</span>
                    <span className="flex items-center gap-1"><Download className="size-3" /> PDF download</span>
                    <span className="flex items-center gap-1"><MessageCircle className="size-3" /> AI support</span>
                  </div>
                </Card>

                {/* Accommodations */}
                {itinerary.accommodations?.listings && itinerary.accommodations.listings.length > 0 && (
                  <Card className="p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2"><Hotel className="size-4 text-forest" />Recommended Accommodations</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {itinerary.accommodations.listings.slice(0, 4).map((acc) => (
                        <div key={acc.id} className="rounded-xl border p-3 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium truncate">{acc.name}</h4>
                            <Badge variant="secondary" className="text-[10px] shrink-0 ms-2">{acc.type}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <span className="flex items-center gap-0.5"><Star className="size-3 fill-amber-400 text-amber-400" />{acc.rating}</span>
                            <span>•</span>
                            <span className="truncate">{acc.neighborhood}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-forest">${acc.pricePerNight}/night</span>
                            <Button size="sm" variant="outline" className="text-xs h-7 bg-transparent">View <ExternalLink className="size-3 ms-1" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            )}
          </main>

          {/* ─── Sidebar (desktop) ─── */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-32 space-y-4">
              {/* Purchase Card */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold">${itinerary.price || 29}</span>
                  <Badge className={cn(
                    itinerary.planType === "ai-optimized" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                  )}>
                    {itinerary.planType === "ai-optimized" ? "AI Premium" : "Traveler Plan"}
                  </Badge>
                </div>
                <Button className="w-full bg-forest hover:bg-forest/90 rounded-xl mb-2">Purchase This Plan</Button>
                <Button variant="outline" className="w-full bg-transparent rounded-xl mb-2 border-forest/30 text-forest hover:bg-forest/10" onClick={() => setIsBookingOpen(true)}>
                  <Plane className="size-4 me-1.5" />AI Book Everything
                </Button>
                <Button variant="outline" className="w-full bg-transparent rounded-xl" onClick={() => setIsChatOpen(true)}>
                  <Sparkles className="size-4 me-1.5" />Ask AI About This Trip
                </Button>
                <div className="mt-3 pt-3 border-t space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2"><Check className="size-3.5 text-forest" /> Full day-by-day itinerary</div>
                  <div className="flex items-center gap-2"><Check className="size-3.5 text-forest" /> Interactive map access</div>
                  <div className="flex items-center gap-2"><Check className="size-3.5 text-forest" /> Packing checklist</div>
                  <div className="flex items-center gap-2"><Check className="size-3.5 text-forest" /> Booking links & tips</div>
                  <div className="flex items-center gap-2"><Check className="size-3.5 text-forest" /> PDF download</div>
                  <div className="flex items-center gap-2"><Check className="size-3.5 text-forest" /> AI trip assistance</div>
                </div>
              </Card>

              {/* Map Preview */}
              <Card className="p-0 overflow-hidden">
                <div className="h-40 relative">
                  <TripMapDynamic roadmap={{
                    totalDays: itinerary.duration,
                    cities: [{ id: 1, name: itinerary.destination, country: itinerary.country, startDay: 1, endDay: itinerary.duration, days: itinerary.duration, coordinates: { lat: 48.8566, lng: 2.3522 }, highlights: itinerary.travelStyles, activities: [], photos: [], costs: { total: totalCost } }],
                    transport: [],
                  }} />
                  <button
                    onClick={() => setActiveTab("map")}
                    className="absolute bottom-2 end-2 size-8 rounded-lg bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Maximize2 className="size-3.5" />
                  </button>
                </div>
              </Card>

              {/* Travel Styles */}
              <Card className="p-4">
                <h4 className="text-sm font-semibold mb-2">Travel Styles</h4>
                <div className="flex flex-wrap gap-1.5">
                  {itinerary.travelStyles.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                  ))}
                </div>
              </Card>

              {/* Personality Match */}
              <Card className="p-4">
                <h4 className="text-sm font-semibold mb-3">Personality Match</h4>
                <div className="space-y-2">
                  {Object.entries(itinerary.personalityScores).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="text-xs capitalize w-16 text-muted-foreground">{key}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-secondary">
                        <div className="h-full rounded-full bg-forest transition-all" style={{ width: value === "high" ? "90%" : value === "medium" ? "60%" : "30%" }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground capitalize">{value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Suitable For */}
              {itinerary.suitableFor && itinerary.suitableFor.length > 0 && (
                <Card className="p-4">
                  <h4 className="text-sm font-semibold mb-2">Suitable For</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {itinerary.suitableFor.map((s) => (
                      <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                  {itinerary.bestSeason && (
                    <div className="mt-2 pt-2 border-t text-xs text-muted-foreground flex items-center gap-1">
                      <Sun className="size-3" /> Best season: <span className="font-medium text-foreground">{itinerary.bestSeason}</span>
                    </div>
                  )}
                </Card>
              )}

              {/* Creator Info */}
              {itinerary.traveler && (
                <Card className="p-4">
                  <h4 className="text-sm font-semibold mb-3">Created by</h4>
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-forest/10 flex items-center justify-center text-forest font-bold text-sm shrink-0">
                      {itinerary.traveler.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium flex items-center gap-1">
                        {itinerary.traveler.name}
                        {itinerary.traveler.verified && <CheckCircle2 className="size-3.5 text-forest" />}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="size-3 fill-amber-400 text-amber-400" />{itinerary.traveler.rating}
                        <span>•</span>{itinerary.traveler.tripsShared} trips
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* ─── Floating AI Button ─── */}
      <div className="fixed bottom-6 end-6 z-50">
        <Button
          size="lg"
          onClick={() => setIsChatOpen(true)}
          className="rounded-full shadow-2xl h-14 px-5 gap-2 bg-gradient-to-r from-forest to-emerald-600 hover:from-forest/90 hover:to-emerald-600/90"
        >
          <div className="relative">
            <Navigation className="size-5" />
            <span className="absolute -top-1 -end-1 size-2 bg-green-400 rounded-full animate-pulse" />
          </div>
          <div className="text-start hidden sm:block">
            <p className="text-xs font-medium leading-tight">Trip AI</p>
            <p className="text-[10px] opacity-80 leading-tight">Ask anything</p>
          </div>
        </Button>
      </div>

      {/* AI Chat Panel */}
      <AIChatPlanner isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Agentic Booking Panel */}
      <AgenticBooking
        destination={itinerary.destination}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  )
}
