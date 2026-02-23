"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft, Trash2, Clock, Euro, Calendar, Users,
  AlertTriangle, CheckCircle2, Info, Sparkles, MapPin,
  ChevronDown, ChevronUp, Camera, Music, Utensils, Coffee,
  Train, Heart, Plus, Minus, AlertCircle
} from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

// Type for basket items
type BasketItem = {
  id: string
  title: string
  description: string
  image: string
  duration: string
  cost: number
  rating: number
  reviews: number
  popular?: boolean
  cuisine?: string
  date?: string
  dayNum?: number
  tags?: string[]
  officialSite?: string
  category?: string
}

// Helper to parse duration string to hours
function parseDuration(duration: string): number {
  if (duration.includes("Full day")) return 8
  if (duration.includes("days")) {
    const match = duration.match(/(\d+)\s*days?/)
    return match ? parseInt(match[1]) * 8 : 8
  }
  if (duration.includes("-")) {
    const parts = duration.split("-")
    const min = parseFloat(parts[0])
    const max = parseFloat(parts[1])
    return (min + max) / 2
  }
  if (duration.includes("min")) {
    const match = duration.match(/(\d+)\s*min/)
    return match ? parseInt(match[1]) / 60 : 0.5
  }
  if (duration.includes("hour")) {
    const match = duration.match(/(\d+\.?\d*)\s*hour/)
    return match ? parseFloat(match[1]) : 1
  }
  return 2 // default
}

// Category icons
const categoryIcons: Record<string, typeof Camera> = {
  activities: Camera,
  liveEvents: Music,
  restaurants: Utensils,
  cafes: Coffee,
  transport: Train,
  experiences: Heart
}

export default function TripBasketPage() {
  const { t } = useI18n()
  const [basket, setBasket] = useState<BasketItem[]>([])
  const [tripDays, setTripDays] = useState(11)
  const [travelers, setTravelers] = useState(2)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    activities: true,
    restaurants: true,
    liveEvents: true,
    cafes: true,
    transport: true,
    experiences: true
  })

  // Demo items for when localStorage is empty
  const demoBasketItems: BasketItem[] = [
    { id: "a1", title: "Eiffel Tower", description: "Skip-the-line summit access", image: "/paris-eiffel-tower-sunset.jpg", duration: "2-3h", cost: 35, rating: 4.9, reviews: 45000, popular: true, category: "activities", officialSite: "toureiffel.paris" },
    { id: "a2", title: "Louvre Museum", description: "See Mona Lisa and 35,000 artworks", image: "/paris-louvre-museum.jpg", duration: "3-4h", cost: 17, rating: 4.8, reviews: 28000, popular: true, category: "activities", officialSite: "louvre.fr" },
    { id: "a3", title: "Montmartre Walking Tour", description: "Artistic streets and Sacre-Coeur", image: "/paris-montmartre-streets.jpg", duration: "2h", cost: 0, rating: 4.7, reviews: 5200, category: "activities" },
    { id: "e1", title: "Jazz Night at Caveau", description: "Live jazz in historic venue", image: "/paris-cafe-terrace.jpg", duration: "3h", cost: 25, rating: 4.8, reviews: 890, date: "Mar 16", category: "liveEvents" },
    { id: "r1", title: "Le Comptoir du Pantheon", description: "Traditional French cuisine", image: "/paris-cafe-terrace.jpg", duration: "1.5h", cost: 45, rating: 4.6, reviews: 2300, category: "restaurants", cuisine: "french" },
    { id: "r2", title: "Pink Mamma", description: "Trendy Italian hotspot", image: "/paris-cafe-terrace.jpg", duration: "1.5h", cost: 35, rating: 4.5, reviews: 4500, category: "restaurants", cuisine: "italian" },
    { id: "c1", title: "Cafe de Flore", description: "Iconic literary cafe since 1887", image: "/paris-cafe-terrace.jpg", duration: "1h", cost: 15, rating: 4.4, reviews: 8900, category: "cafes" },
    { id: "t1", title: "Paris Metro Pass", description: "Unlimited travel for trip duration", image: "/paris-seine-river.jpg", duration: "10 days", cost: 82, rating: 4.7, reviews: 12000, category: "transport" },
    { id: "x1", title: "Seine River Picnic", description: "Sunset picnic by the river", image: "/paris-seine-river.jpg", duration: "2h", cost: 0, rating: 4.9, reviews: 3400, category: "experiences" },
  ]

  // Load basket from localStorage or use demo items
  useEffect(() => {
    const savedBasket = localStorage.getItem("tripBasket")
    if (savedBasket) {
      const parsed = JSON.parse(savedBasket)
      if (parsed.length > 0) {
        setBasket(parsed)
      } else {
        setBasket(demoBasketItems)
      }
    } else {
      // Use demo items if no saved basket
      setBasket(demoBasketItems)
    }
    
    const savedDays = localStorage.getItem("tripDays")
    if (savedDays) setTripDays(parseInt(savedDays))
    
    const savedTravelers = localStorage.getItem("tripTravelers")
    if (savedTravelers) setTravelers(parseInt(savedTravelers))
  }, [])

  // Calculate totals
  const totalCost = basket.reduce((sum, item) => sum + item.cost, 0) * travelers
  const totalHours = basket.reduce((sum, item) => sum + parseDuration(item.duration), 0)
  const availableHours = tripDays * 10 // Assuming 10 active hours per day
  const timeUsagePercent = Math.min((totalHours / availableHours) * 100, 100)
  
  // Group items by category
  const groupedItems = basket.reduce((acc, item) => {
    const category = item.category || "activities"
    if (!acc[category]) acc[category] = []
    acc[category].push(item)
    return acc
  }, {} as Record<string, BasketItem[]>)

  // Time analysis
  const getTimeStatus = () => {
    if (timeUsagePercent < 40) return { status: "low", color: "text-blue-600", bg: "bg-blue-50", icon: Info, message: t("tripBasket.timeStatusLow") }
    if (timeUsagePercent < 70) return { status: "good", color: "text-green-600", bg: "bg-green-50", icon: CheckCircle2, message: t("tripBasket.timeStatusGood") }
    if (timeUsagePercent < 90) return { status: "busy", color: "text-amber-600", bg: "bg-amber-50", icon: AlertTriangle, message: t("tripBasket.timeStatusBusy") }
    return { status: "packed", color: "text-red-600", bg: "bg-red-50", icon: AlertCircle, message: t("tripBasket.timeStatusPacked") }
  }

  const timeStatus = getTimeStatus()
  const TimeIcon = timeStatus.icon

  const removeFromBasket = (itemId: string) => {
    const newBasket = basket.filter(item => item.id !== itemId)
    setBasket(newBasket)
    localStorage.setItem("tripBasket", JSON.stringify(newBasket))
  }

  const clearBasket = () => {
    setBasket([])
    localStorage.removeItem("tripBasket")
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const categoryLabels: Record<string, string> = {
    activities: t("tripBasket.catActivities"),
    liveEvents: t("tripBasket.catLiveEvents"),
    restaurants: t("tripBasket.catRestaurants"),
    cafes: t("tripBasket.catCafes"),
    transport: t("tripBasket.catTransport"),
    experiences: t("tripBasket.catExperiences")
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/custom-trip">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="size-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">{t("tripBasket.title")}</h1>
                <p className="text-sm text-muted-foreground">{t("customTrip.parisLabel")}</p>
              </div>
            </div>
            
            {basket.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearBasket} className="text-red-600 hover:text-red-700 bg-transparent">
                <Trash2 className="size-4 me-2" />
                {t("filterSidebar.clearAll")}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {basket.length === 0 ? (
          // Empty state
          <div className="text-center py-16">
            <div className="size-20 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
              <Camera className="size-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">{t("tripBasket.empty")}</h2>
            <p className="text-muted-foreground mb-6">{t("tripBasket.emptyDesc")}</p>
            <Link href="/custom-trip">
              <Button>
                <Plus className="size-4 me-2" />
                {t("tripBasket.browsePlans")}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Time Analysis Card */}
              <Card className={`p-4 ${timeStatus.bg} border-0`}>
                <div className="flex items-start gap-3">
                  <div className={`size-10 rounded-full flex items-center justify-center ${timeStatus.color} bg-white`}>
                    <TimeIcon className="size-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-semibold ${timeStatus.color}`}>{t("tripBasket.timeAnalysis")}</h3>
                      <span className={`text-sm font-medium ${timeStatus.color}`}>
                        {t("tripBasket.hoursAvailable", { used: totalHours.toFixed(1), total: String(availableHours) })}
                      </span>
                    </div>
                    <Progress value={timeUsagePercent} className="h-2 mb-2" />
                    <p className={`text-sm ${timeStatus.color}`}>{timeStatus.message}</p>
                  </div>
                </div>
              </Card>

              {/* AI Info Card */}
              <Card className="p-4 bg-gradient-to-r from-forest/5 to-forest/10 border-forest/20">
                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-full bg-forest/10 flex items-center justify-center shrink-0">
                    <Sparkles className="size-5 text-forest" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-forest mb-1">{t("tripBasket.aiOptimize")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("tripBasket.aiOptimizeDesc")}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Grouped Items */}
              {Object.entries(groupedItems).map(([category, items]) => {
                const Icon = categoryIcons[category] || Camera
                const isExpanded = expandedCategories[category]
                
                return (
                  <Card key={category} className="overflow-hidden">
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-secondary flex items-center justify-center">
                          <Icon className="size-5 text-muted-foreground" />
                        </div>
                        <div className="text-start">
                          <h3 className="font-semibold">{categoryLabels[category] || category}</h3>
                          <p className="text-sm text-muted-foreground">{t("tripBasket.nItems", { count: String(items.length) })}</p>
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
                    </button>
                    
                    {isExpanded && (
                      <div className="border-t divide-y">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-4">
                            <div className="relative size-16 rounded-lg overflow-hidden shrink-0">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.title}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">{item.title}</h4>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                  <Clock className="size-3" />
                                  {item.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Euro className="size-3" />
                                  {item.cost === 0 ? t("common.free") : `${item.cost}`}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromBasket(item.id)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-4">{t("tripBasket.tripSummary")}</h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="size-4" />
                        {t("customTrip.destination")}
                      </span>
                      <span className="font-medium">{t("customTrip.parisLabel")}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="size-4" />
                        {t("filterSidebar.duration")}
                      </span>
                      <span className="font-medium">{t("tripBasket.nDays", { count: String(tripDays) })}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Users className="size-4" />
                        {t("customTrip.travelers")}
                      </span>
                      <span className="font-medium">{t("tripBasket.nPeople", { count: String(travelers) })}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="size-4" />
                        {t("tripBasket.totalActivities")}
                      </span>
                      <span className="font-medium">{t("tripBasket.nItems", { count: String(basket.length) })}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-muted-foreground">{t("tripBasket.total")}</span>
                      <div className="text-end">
                        <span className="text-2xl font-bold">${totalCost}</span>
                        <p className="text-xs text-muted-foreground">{t("tripBasket.forTravelers", { count: String(travelers) })}</p>
                      </div>
                    </div>
                    
                    <Link href="/my-itinerary">
                      <Button className="w-full bg-forest hover:bg-forest/90" size="lg" onClick={() => {
                        // Save basket to localStorage before navigating
                        localStorage.setItem("tripBasket", JSON.stringify(basket))
                        localStorage.setItem("tripDays", tripDays.toString())
                        localStorage.setItem("tripTravelers", travelers.toString())
                      }}>
                        <Sparkles className="size-4 me-2" />
                        {t("customTrip.generateTrip")}
                      </Button>
                    </Link>
                    
                    <p className="text-xs text-center text-muted-foreground mt-3">
                      {t("tripBasket.aiWillArrange")}
                    </p>
                  </div>
                </Card>

                {/* Help Card */}
                <Card className="p-4 bg-green-50 dark:bg-green-950/30 border-green-200">
                  <div className="flex items-start gap-3">
                    <Heart className="size-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900 dark:text-green-100 text-sm">{t("tripBasket.withYou")}</h4>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                        {t("tripBasket.withYouDesc")}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
