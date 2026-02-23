"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Star,
  MapPin,
  Calendar,
  Heart,
  Share2,
  ArrowLeft,
  Clock,
  Camera,
  DollarSign,
  Users,
  BadgeCheck,
  Utensils,
  Bed,
  Footprints,
  Lightbulb,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  CheckCircle2,
  MessageCircle,
  ThumbsUp,
  Hotel,
  Home,
  Building,
  Circle,
  FileText,
  Plane,
  Shirt,
  Smartphone,
} from "lucide-react"
import type { Itinerary } from "@/lib/types"
import { useI18n } from "@/lib/i18n/context"
import { formatPrice } from "@/lib/utils"

interface RawTripDetailClientProps {
  itinerary: Itinerary
}

// Demo data for raw trip days
const rawTripDays = [
  {
    day: 1,
    date: "Oct 15, 2025",
    title: "Arrival & Montmartre Discovery",
    totalSpent: 87,
    mood: "excited",
    photos: ["/paris-montmartre-streets.jpg", "/paris-cafe-terrace.jpg"],
    activities: [
      {
        time: "14:00",
        title: "Landed at CDG, took RER B to city",
        type: "transport",
        cost: 11.45,
        duration: "45 min",
        note: "The train was packed! Should have taken earlier flight.",
        tip: "Buy tickets from machine, not the counter - faster",
      },
      {
        time: "15:30",
        title: "Checked into Airbnb in Montmartre",
        type: "accommodation",
        cost: 0,
        duration: "30 min",
        note: "Host left keys with neighbor. Cute apartment but 5th floor walk-up!",
        photo: "/paris-montmartre-streets.jpg",
      },
      {
        time: "17:00",
        title: "Walked to Sacre-Coeur",
        type: "activity",
        cost: 0,
        duration: "2h",
        note: "The sunset view was INCREDIBLE. So many tourists but worth it.",
        tip: "Go around the side to avoid the pushy bracelet sellers",
        photo: "/paris-montmartre-streets.jpg",
      },
      {
        time: "20:00",
        title: "Dinner at Le Refuge des Fondus",
        type: "food",
        cost: 32,
        duration: "1.5h",
        note: "Wine served in baby bottles! Tiny place, had to climb over table. So fun!",
        rating: 5,
        photo: "/paris-cafe-terrace.jpg",
      },
    ],
    mistake: "Didn't realize the metro stops running at 12:30am on weekdays. Had to walk 40 min back!",
    highlight: "Watching sunset at Sacre-Coeur with street musicians playing",
  },
  {
    day: 2,
    date: "Oct 16, 2025",
    title: "Louvre & Seine River Walk",
    totalSpent: 156,
    mood: "happy",
    photos: ["/paris-louvre-museum.jpg", "/paris-seine-river.jpg"],
    activities: [
      {
        time: "08:00",
        title: "Croissants at local boulangerie",
        type: "food",
        cost: 4.50,
        duration: "30 min",
        note: "Asked for 'un croissant au beurre' - the flakiest croissant ever",
        tip: "Always say 'bonjour' when entering any shop!",
      },
      {
        time: "09:30",
        title: "Louvre Museum (pre-booked ticket)",
        type: "activity",
        cost: 17,
        duration: "4h",
        note: "Mona Lisa was smaller than expected but the museum itself is overwhelming. Could spend days here.",
        tip: "Enter through Passage Richelieu - NO line compared to pyramid",
        photo: "/paris-louvre-museum.jpg",
        rating: 5,
      },
      {
        time: "14:00",
        title: "Lunch at Cafe Marly (splurge!)",
        type: "food",
        cost: 45,
        duration: "1h",
        note: "Expensive but the view of the pyramid is worth it for photos",
        rating: 4,
      },
      {
        time: "16:00",
        title: "Walked along Seine to Notre-Dame",
        type: "activity",
        cost: 0,
        duration: "2h",
        note: "Stopped at the bouquinistes (green book stalls). Bought vintage postcards.",
        photo: "/paris-seine-river.jpg",
      },
      {
        time: "19:00",
        title: "Picnic on Pont des Arts",
        type: "food",
        cost: 18,
        duration: "2h",
        note: "Got wine, cheese, and baguette from Monoprix. Best dinner of the trip!",
        tip: "Monoprix has great cheap wine in the 5-8 euro range",
        rating: 5,
      },
    ],
    mistake: "Wore new shoes. Blisters by end of day. Always break in shoes before trip!",
    highlight: "Sitting on Pont des Arts at sunset with wine and watching boats pass",
  },
  {
    day: 3,
    date: "Oct 17, 2025",
    title: "Eiffel Tower & Local Neighborhood",
    totalSpent: 98,
    mood: "amazing",
    photos: ["/paris-eiffel-tower-sunset.jpg"],
    activities: [
      {
        time: "10:00",
        title: "Slept in, brunch at Pink Mamma",
        type: "food",
        cost: 28,
        duration: "1.5h",
        note: "Arrived at 10am, still waited 30 min. But the avocado toast was amazing.",
        tip: "Go early or very late to avoid the massive queue",
        rating: 4,
      },
      {
        time: "14:00",
        title: "Eiffel Tower summit ticket",
        type: "activity",
        cost: 35,
        duration: "3h",
        note: "Book WEEKS in advance! I almost missed out. The view is unreal.",
        tip: "Sunset tickets are best - see day AND night views",
        photo: "/paris-eiffel-tower-sunset.jpg",
        rating: 5,
      },
      {
        time: "18:00",
        title: "Walked through Rue Cler market",
        type: "activity",
        cost: 12,
        duration: "1h",
        note: "Cute pedestrian street with food shops. Got macarons and cheese.",
      },
      {
        time: "20:00",
        title: "Dinner at neighborhood bistro",
        type: "food",
        cost: 23,
        duration: "1.5h",
        note: "Can't remember the name but it had red awning near Ecole Militaire metro. Duck confit was perfect.",
        rating: 5,
      },
    ],
    mistake: "Should have brought a jacket - it gets cold at Eiffel Tower summit even in October",
    highlight: "Watching the Eiffel Tower sparkle at night from the summit",
  },
]

// Traveler's actual accommodations
const travelerAccommodations = [
  {
    id: "tacc1",
    name: "Cozy Montmartre Studio",
    type: "airbnb",
    area: "Montmartre, 18th Arr.",
    nights: 5,
    totalCost: 450,
    rating: 4,
    image: "/paris-montmartre-streets.jpg",
    review: "Great location but 5th floor walk-up was brutal with luggage. View from window was worth it though!",
    pros: ["Amazing neighborhood", "Quiet street", "Good wifi"],
    cons: ["No elevator", "Tiny bathroom", "Street noise on weekends"],
  },
  {
    id: "tacc2",
    name: "Hotel near Gare du Nord",
    type: "hotel",
    area: "10th Arr.",
    nights: 2,
    totalCost: 180,
    rating: 3,
    image: "/paris-seine-river.jpg",
    review: "Basic but convenient for early train. Wouldn't stay longer than a night.",
    pros: ["Walking distance to station", "24h reception"],
    cons: ["Small room", "Noisy area", "No breakfast"],
  },
]

// Traveler's actual checklist (what they did)
const travelerChecklist = [
  { category: "What I'm Glad I Did", items: [
    { title: "Booked Eiffel Tower 3 weeks ahead", note: "Would have missed out otherwise!", done: true },
    { title: "Got travel insurance", note: "Didn't need it but peace of mind", done: true },
    { title: "Downloaded offline Google Maps", note: "Saved me multiple times", done: true },
    { title: "Told bank about travel", note: "Card worked perfectly", done: true },
  ]},
  { category: "What I Wish I'd Done", items: [
    { title: "Book Louvre morning slot", note: "Afternoon was SO crowded", done: false },
    { title: "Pack broken-in walking shoes", note: "Got blisters day 2", done: false },
    { title: "Learn basic French phrases", note: "Locals appreciate the effort", done: false },
    { title: "Bring a light jacket", note: "Evenings were colder than expected", done: false },
  ]},
  { category: "Packing Wins", items: [
    { title: "Universal power adapter", note: "Type E plugs in France", done: true },
    { title: "Portable phone charger", note: "Essential for photo-heavy days", done: true },
    { title: "Crossbody bag", note: "Kept belongings safe from pickpockets", done: true },
  ]},
]

const accTypeIcons: Record<string, React.ElementType> = {
  hotel: Hotel,
  airbnb: Home,
  hostel: Building,
}

const categoryIcons: Record<string, React.ElementType> = {
  "What I'm Glad I Did": CheckCircle2,
  "What I Wish I'd Done": AlertTriangle,
  "Packing Wins": Shirt,
}

export default function RawTripDetailClient({ itinerary }: RawTripDetailClientProps) {
  const { t, locale } = useI18n()
  const [expandedDays, setExpandedDays] = useState<number[]>([1])
  const [liked, setLiked] = useState(false)
  const [activeTab, setActiveTab] = useState<"itinerary" | "accommodation" | "checklist">("itinerary")

  const toggleDay = (day: number) => {
    setExpandedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  const typeIcons: Record<string, React.ElementType> = {
    transport: Footprints,
    accommodation: Bed,
    activity: Camera,
    food: Utensils,
  }

  const typeColors: Record<string, string> = {
    transport: "bg-slate-100 text-slate-600",
    accommodation: "bg-violet-100 text-violet-600",
    activity: "bg-blue-100 text-blue-600",
    food: "bg-orange-100 text-orange-600",
  }

  const totalSpent = rawTripDays.reduce((sum, day) => sum + day.totalSpent, 0)

  return (
    <div className="min-h-screen bg-background pb-24">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px]">
        <Image
          src={itinerary.coverImage || "/placeholder.svg"}
          alt={itinerary.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-4 start-4 z-10">
          <Button variant="secondary" size="sm" asChild className="rounded-full">
            <Link href="/">
              <ArrowLeft className="size-4 me-2" />
              {t("common.back")}
            </Link>
          </Button>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 start-0 end-0 p-6 md:p-8">
          <div className="container max-w-4xl mx-auto">
            <Badge className="mb-3 bg-emerald-600">
              <Users className="size-3 me-1" />
              {t("itineraryDetail.realTravelerExperience")}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{itinerary.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="size-4" />
                {itinerary.destination}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="size-4" />
                {itinerary.duration} days
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="size-4" />
                {formatPrice(itinerary.budgetRange.min, locale)} {locale === "fa" ? "خرج کل" : "total spent"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="container max-w-4xl mx-auto px-4 py-8">
        {/* Traveler Profile Card */}
        {itinerary.traveler && (
          <Card className="p-5 mb-6 border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20">
            <div className="flex items-start gap-4">
              <div className="relative size-16 rounded-full overflow-hidden shrink-0">
                <Image 
                  src={itinerary.traveler.avatar || "/placeholder.svg"} 
                  alt={itinerary.traveler.name} 
                  fill 
                  sizes="64px"
                  className="object-cover" 
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg">{itinerary.traveler.name}</h3>
                  {itinerary.traveler.verified && (
                    <BadgeCheck className="size-5 text-emerald-600" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {itinerary.traveler.travelStyle} from {itinerary.traveler.country}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    <strong>{itinerary.traveler.rating}</strong>
                    <span className="text-muted-foreground">({itinerary.traveler.reviewCount} reviews)</span>
                  </span>
                  <span className="text-muted-foreground">
                    {itinerary.traveler.tripsShared} trips shared
                  </span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="icon" onClick={() => setLiked(!liked)} className="bg-transparent">
                  <Heart className={`size-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                <Button variant="outline" size="icon" className="bg-transparent">
                  <Share2 className="size-4" />
                </Button>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-emerald-200">
              <p className="text-sm text-emerald-800 dark:text-emerald-200">
                "{itinerary.highlight}"
              </p>
            </div>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center">
            <DollarSign className="size-5 mx-auto mb-2 text-emerald-600" />
            <p className="text-2xl font-bold">${totalSpent}</p>
            <p className="text-xs text-muted-foreground">{t("itineraryDetail.totalSpent")}</p>
          </Card>
          <Card className="p-4 text-center">
            <Calendar className="size-5 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold">{rawTripDays.length}</p>
            <p className="text-xs text-muted-foreground">{t("itineraryDetail.daysDocumented")}</p>
          </Card>
          <Card className="p-4 text-center">
            <Camera className="size-5 mx-auto mb-2 text-violet-600" />
            <p className="text-2xl font-bold">{rawTripDays.reduce((sum, d) => sum + d.photos.length, 0)}</p>
            <p className="text-xs text-muted-foreground">{t("itineraryDetail.realPhotos")}</p>
          </Card>
          <Card className="p-4 text-center">
            <Lightbulb className="size-5 mx-auto mb-2 text-amber-600" />
            <p className="text-2xl font-bold">{rawTripDays.reduce((sum, d) => sum + d.activities.filter(a => a.tip).length, 0)}</p>
            <p className="text-xs text-muted-foreground">{t("itineraryDetail.insiderTips")}</p>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab("itinerary")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "itinerary" 
                ? "border-emerald-600 text-emerald-600" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calendar className="size-4 inline me-2" />
            {t("itineraryDetail.tabs.dayByDay")}
          </button>
          <button
            onClick={() => setActiveTab("accommodation")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "accommodation" 
                ? "border-emerald-600 text-emerald-600" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Hotel className="size-4 inline me-2" />
            {t("itineraryDetail.tabs.whereIStayed")}
          </button>
          <button
            onClick={() => setActiveTab("checklist")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "checklist" 
                ? "border-emerald-600 text-emerald-600" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <CheckCircle2 className="size-4 inline me-2" />
            {t("itineraryDetail.tabs.myChecklist")}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "itinerary" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="size-5" />
              Day-by-Day Journey
            </h2>

            {rawTripDays.map((day) => {
              const isExpanded = expandedDays.includes(day.day)
              
              return (
                <Card key={day.day} className="overflow-hidden">
                  {/* Day Header */}
                  <button
                    onClick={() => toggleDay(day.day)}
                    className="w-full p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors text-start"
                  >
                    <div className="size-12 rounded-xl bg-forest/10 flex items-center justify-center shrink-0">
                      <span className="text-lg font-bold text-forest">{day.day}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{day.title}</h3>
                      <p className="text-sm text-muted-foreground">{day.date}</p>
                    </div>
                    <div className="text-end shrink-0 me-2">
                      <p className="font-semibold text-emerald-600">${day.totalSpent}</p>
                      <p className="text-xs text-muted-foreground">{day.activities.length} activities</p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="size-5 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="size-5 text-muted-foreground shrink-0" />
                    )}
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t">
                      {/* Activities Timeline */}
                      <div className="mt-4 space-y-4">
                        {day.activities.map((activity, idx) => {
                          const Icon = typeIcons[activity.type] || Camera
                          const colorClass = typeColors[activity.type] || "bg-gray-100 text-gray-600"
                          
                          return (
                            <div key={idx} className="flex gap-4">
                              {/* Time & Icon */}
                              <div className="flex flex-col items-center">
                                <span className="text-xs font-medium text-muted-foreground mb-1">{activity.time}</span>
                                <div className={`size-10 rounded-full ${colorClass} flex items-center justify-center`}>
                                  <Icon className="size-5" />
                                </div>
                                {idx < day.activities.length - 1 && (
                                  <div className="w-px h-full bg-border mt-2 min-h-[20px]" />
                                )}
                              </div>
                              
                              {/* Content */}
                              <div className="flex-1 pb-4">
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="font-medium">{activity.title}</h4>
                                  {activity.cost > 0 && (
                                    <Badge variant="secondary" className="shrink-0">{formatPrice(activity.cost, locale)}</Badge>
                                  )}
                                </div>
                                
                                {activity.duration && (
                                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                    <Clock className="size-3" />
                                    {activity.duration}
                                  </p>
                                )}
                                
                                {activity.note && (
                                  <p className="text-sm text-muted-foreground mt-2 italic">
                                    "{activity.note}"
                                  </p>
                                )}
                                
                                {activity.tip && (
                                  <div className="mt-2 flex items-start gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                                    <Lightbulb className="size-4 text-amber-600 shrink-0 mt-0.5" />
                                    <p className="text-xs text-amber-800 dark:text-amber-200">{activity.tip}</p>
                                  </div>
                                )}
                                
                                {activity.rating && (
                                  <div className="mt-2 flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`size-3 ${i < activity.rating! ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} 
                                      />
                                    ))}
                                  </div>
                                )}
                                
                                {activity.photo && (
                                  <div className="mt-3 relative h-40 rounded-lg overflow-hidden">
                                    <Image 
                                      src={activity.photo || "/placeholder.svg"} 
                                      alt={activity.title} 
                                      fill 
                                      sizes="(max-width: 768px) 100vw, 640px"
                                      className="object-cover" 
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Day Summary */}
                      <div className="mt-4 pt-4 border-t grid md:grid-cols-2 gap-4">
                        {/* Highlight */}
                        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="size-4 text-emerald-600" />
                            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">HIGHLIGHT</span>
                          </div>
                          <p className="text-sm">{day.highlight}</p>
                        </div>
                        
                        {/* Mistake */}
                        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="size-4 text-red-600" />
                            <span className="text-xs font-semibold text-red-700 dark:text-red-300">WHAT I'D DO DIFFERENTLY</span>
                          </div>
                          <p className="text-sm">{day.mistake}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        )}

        {activeTab === "accommodation" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Hotel className="size-5" />
              Where I Stayed
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              My honest reviews of each place I stayed.
            </p>

            <div className="grid gap-4">
              {travelerAccommodations.map((acc) => {
                const TypeIcon = accTypeIcons[acc.type] || Hotel
                return (
                  <Card key={acc.id} className="overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative h-40 sm:h-auto sm:w-48 shrink-0">
                        <Image 
                          src={acc.image || "/placeholder.svg"} 
                          alt={acc.name} 
                          fill 
                          sizes="(max-width: 640px) 100vw, 192px"
                          className="object-cover" 
                        />
                        <Badge className="absolute top-2 start-2 bg-white/90 text-foreground">
                          <TypeIcon className="size-3 me-1" />
                          {acc.type.charAt(0).toUpperCase() + acc.type.slice(1)}
                        </Badge>
                      </div>
                      <div className="p-4 flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{acc.name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="size-3" />
                              {acc.area}
                            </p>
                          </div>
                          <div className="text-end">
                            <p className="font-bold text-emerald-600">${acc.totalCost}</p>
                            <p className="text-xs text-muted-foreground">{acc.nights} nights</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`size-4 ${i < acc.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} 
                            />
                          ))}
                        </div>
                        
                        <p className="text-sm mt-2 italic">"{acc.review}"</p>
                        
                        <div className="mt-3 flex flex-wrap gap-4">
                          <div>
                            <p className="text-xs font-medium text-emerald-600 mb-1">Pros</p>
                            <div className="flex flex-wrap gap-1">
                              {acc.pros.map((pro, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs bg-emerald-50 border-emerald-200 text-emerald-700">
                                  {pro}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-red-600 mb-1">Cons</p>
                            <div className="flex flex-wrap gap-1">
                              {acc.cons.map((con, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs bg-red-50 border-red-200 text-red-700">
                                  {con}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === "checklist" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <CheckCircle2 className="size-5" />
              My Pre-Trip Checklist
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              What worked, what I wish I'd done, and my packing wins.
            </p>

            <div className="grid gap-4">
              {travelerChecklist.map((category) => {
                const CategoryIcon = categoryIcons[category.category] || CheckCircle2
                const isWishList = category.category === "What I Wish I'd Done"
                
                return (
                  <Card key={category.category} className={`p-4 ${isWishList ? "border-red-200 bg-red-50/30" : ""}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <CategoryIcon className={`size-5 ${isWishList ? "text-red-600" : "text-emerald-600"}`} />
                      <h3 className="font-semibold">{category.category}</h3>
                    </div>
                    <div className="space-y-2">
                      {category.items.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                          {item.done ? (
                            <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <Circle className="size-5 text-red-400 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <span className="font-medium">{item.title}</span>
                            {item.note && (
                              <p className="text-sm text-muted-foreground">{item.note}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Purchase CTA */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 text-center md:text-start">
              <h3 className="text-xl font-bold mb-2">Get the Full Trip Details</h3>
              <p className="text-muted-foreground mb-3">
                Includes all {itinerary.duration} days, {rawTripDays.reduce((sum, d) => sum + d.activities.length, 0)}+ activities, 
                real receipts, Google Maps links, and direct contact with {itinerary.traveler?.name?.split(" ")[0]}.
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge variant="secondary">
                  <CheckCircle2 className="size-3 me-1" />
                  All Photos Included
                </Badge>
                <Badge variant="secondary">
                  <CheckCircle2 className="size-3 me-1" />
                  Exact Costs & Receipts
                </Badge>
                <Badge variant="secondary">
                  <CheckCircle2 className="size-3 me-1" />
                  Chat with Traveler
                </Badge>
              </div>
            </div>
            <div className="text-center shrink-0">
              <p className="text-3xl font-bold text-emerald-700 mb-2">${itinerary.price}</p>
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                <ShoppingCart className="size-4 me-2" />
                {t("itineraryDetail.purchaseTrip")}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">One-time purchase, yours forever</p>
            </div>
          </div>
        </Card>

        {/* Reviews Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MessageCircle className="size-5" />
            What Buyers Say
          </h2>
          <div className="space-y-4">
            {[
              { name: "Mike T.", rating: 5, text: "Sarah's tips saved me so much money! The metro tip alone was worth it.", date: "2 weeks ago" },
              { name: "Lisa R.", rating: 5, text: "Love how honest she was about mistakes. Felt like getting advice from a friend.", date: "1 month ago" },
              { name: "James K.", rating: 4, text: "Great itinerary, wish there were more restaurant recommendations.", date: "1 month ago" },
            ].map((review, idx) => (
              <Card key={idx} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <span className="font-medium">{review.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{review.name}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`size-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.text}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="size-8">
                      <ThumbsUp className="size-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
