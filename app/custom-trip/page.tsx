"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  MapPin, Calendar, Check, Plus, X, ShoppingBag, 
  Landmark, Camera, Music, Utensils, Coffee, Bike,
  Train, Car, Footprints, Bus, Ship, Theater,
  Palette, Trees, ShoppingCart, Wine, ChefHat,
  Sparkles, Star, Clock, Users, Heart, Filter,
  ChevronDown, ChevronUp, Search, Trash2, ArrowLeft,
  SlidersHorizontal, Euro, Tag, ExternalLink, Wallet,
  UserCircle, CalendarDays, Hotel, Home, Building2, HelpCircle,
  CheckCircle, CalendarCheck, Navigation2
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { parisData } from "@/lib/paris-data"

// Icon map — resolves icon name strings from data to actual components
const iconMap: Record<string, LucideIcon> = {
  Camera, Music, Utensils, Coffee, Train, Heart,
}

// Paris Activities Data — attach icon components to imported data
const parisDataWithIcons = {
  ...parisData,
  categories: Object.fromEntries(
    Object.entries(parisData.categories).map(([key, cat]) => [
      key,
      { ...cat, icon: iconMap[cat.icon] || Camera },
    ])
  ) as Record<CategoryKey, Omit<typeof parisData.categories[CategoryKey], 'icon'> & { icon: LucideIcon }>,
}

type CategoryKey = keyof typeof parisData.categories
type Item = {
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

export default function CustomTripPage() {
  const { t } = useI18n()

  // Translated category labels map
  const categoryLabelMap: Record<CategoryKey, string> = {
    activities: t("customTrip.categories.activities"),
    liveEvents: t("customTrip.categories.liveEvents"),
    restaurants: t("customTrip.categories.restaurants"),
    cafes: t("customTrip.categories.cafes"),
    transport: t("customTrip.categories.transport"),
    experiences: t("customTrip.categories.experiences"),
  }

  const categoryDescriptionMap: Record<CategoryKey, string> = {
    activities: t("customTrip.categoryDescriptions.activities"),
    liveEvents: t("customTrip.categoryDescriptions.liveEvents"),
    restaurants: t("customTrip.categoryDescriptions.restaurants"),
    cafes: t("customTrip.categoryDescriptions.cafes"),
    transport: t("customTrip.categoryDescriptions.transport"),
    experiences: t("customTrip.categoryDescriptions.experiences"),
  }

  // Trip Settings
  const [destination, setDestination] = useState("Paris")
  const [startDate, setStartDate] = useState("2026-03-15")
  const [endDate, setEndDate] = useState("2026-03-25")
  const [travelers, setTravelers] = useState(2)
  const [budget, setBudget] = useState<"budget" | "mid" | "luxury">("mid")
  
  // Accommodation Settings - Support multiple accommodations
  const [accommodationStatus, setAccommodationStatus] = useState<"booked" | "planning" | "undecided">("undecided")
  const [accommodations, setAccommodations] = useState<{
    id: string
    name: string
    address: string
    area: string
    type: "hotel" | "airbnb" | "hostel"
    rating: number
    image: string
    checkIn: string
    checkOut: string
    arrivalTime: string
  }[]>([])
  const [selectedHotel, setSelectedHotel] = useState<{
    name: string
    address: string
    area: string
    rating: number
    image: string
    checkIn: string
    checkOut: string
  } | null>(null)
  const [accommodationType, setAccommodationType] = useState<"hotel" | "airbnb" | "hostel" | "undecided">("undecided")
  const [accommodationArea, setAccommodationArea] = useState<string>("undecided")
  const [showHotelSearch, setShowHotelSearch] = useState(false)
  const [hotelSearch, setHotelSearch] = useState("")
  const [currentAccommodationEdit, setCurrentAccommodationEdit] = useState<number | null>(null)
  const [showAddAccommodation, setShowAddAccommodation] = useState(false)
  const [newAccommodationDates, setNewAccommodationDates] = useState({ checkIn: "", checkOut: "", arrivalTime: "14:00" })
  
  // Mock hotel search results for Paris
  const hotelResults = [
    { name: "Hotel Le Marais", address: "5 Rue du Temple, 75004 Paris", area: "le-marais", rating: 4.5, image: "/paris-cafe-terrace.jpg" },
    { name: "Maison Montmartre", address: "23 Rue Lepic, 75018 Paris", area: "montmartre", rating: 4.7, image: "/paris-montmartre-streets.jpg" },
    { name: "Hotel Saint-Germain", address: "88 Rue de Seine, 75006 Paris", area: "saint-germain", rating: 4.8, image: "/paris-seine-river.jpg" },
    { name: "Citadines Bastille", address: "14 Rue de la Roquette, 75011 Paris", area: "bastille", rating: 4.3, image: "/paris-louvre-museum.jpg" },
    { name: "Hotel Eiffel Trocadero", address: "35 Rue Benjamin Franklin, 75016 Paris", area: "eiffel-tower", rating: 4.6, image: "/paris-eiffel-tower-sunset.jpg" },
    { name: "Latin Quarter Inn", address: "12 Rue de la Huchette, 75005 Paris", area: "latin-quarter", rating: 4.2, image: "/paris-versailles-palace.jpg" },
    { name: "Airbnb Le Marais Loft", address: "Near Place des Vosges, 75003 Paris", area: "le-marais", rating: 4.9, image: "/paris-cafe-terrace.jpg" },
    { name: "Champs-Elysees Palace", address: "112 Avenue des Champs-Elysees, 75008 Paris", area: "champs-elysees", rating: 4.9, image: "/paris-eiffel-tower-sunset.jpg" },
  ]
  
  const filteredHotels = hotelResults.filter(h => 
    h.name.toLowerCase().includes(hotelSearch.toLowerCase()) ||
    h.address.toLowerCase().includes(hotelSearch.toLowerCase()) ||
    h.area.toLowerCase().includes(hotelSearch.toLowerCase())
  )
  
  // Paris accommodation areas
  const parisAreas = [
    { value: "undecided", label: "Decide later", description: "We'll suggest the best area based on your activities" },
    { value: "le-marais", label: "Le Marais", description: "Historic, trendy, central location" },
    { value: "montmartre", label: "Montmartre", description: "Artistic, charming, hilltop views" },
    { value: "latin-quarter", label: "Latin Quarter", description: "Student area, affordable, near Notre-Dame" },
    { value: "champs-elysees", label: "Champs-Elysees", description: "Upscale, shopping, near Arc de Triomphe" },
    { value: "saint-germain", label: "Saint-Germain", description: "Elegant, cafes, Left Bank culture" },
    { value: "bastille", label: "Bastille", description: "Nightlife, local vibe, affordable" },
    { value: "eiffel-tower", label: "Near Eiffel Tower", description: "Iconic views, quieter residential" },
  ]
  
  // UI State
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("activities")
  const [basket, setBasket] = useState<Item[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showBasket, setShowBasket] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "budget" | "mid" | "high">("all")
  const [popularOnly, setPopularOnly] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  
  // Category-specific filters
  const [activityTypeFilter, setActivityTypeFilter] = useState<string>("all")
  const [restaurantCuisineFilter, setRestaurantCuisineFilter] = useState<string>("all")
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all")
  const [cafeTypeFilter, setCafeTypeFilter] = useState<string>("all")
  
  // Filter options for each category
  const categoryFilters = {
    activities: {
      label: t("customTrip.filters.activityType"),
      options: [
        { value: "all", label: t("customTrip.filters.allActivities") },
        { value: "landmark", label: t("customTrip.filters.landmarks") },
        { value: "museum", label: t("customTrip.filters.museums") },
        { value: "views", label: t("customTrip.filters.viewsPanoramic") },
        { value: "history", label: t("customTrip.filters.history") },
        { value: "walking", label: t("customTrip.filters.walkingTours") },
        { value: "shopping", label: t("customTrip.filters.shopping") },
        { value: "food", label: t("customTrip.filters.foodDrink") },
        { value: "show", label: t("customTrip.filters.showsEntertainment") },
      ]
    },
    restaurants: {
      label: t("customTrip.filters.cuisineType"),
      options: [
        { value: "all", label: t("customTrip.filters.allCuisines") },
        { value: "french", label: t("customTrip.filters.french") },
        { value: "italian", label: t("customTrip.filters.italian") },
        { value: "crepes", label: t("customTrip.filters.crepes") },
        { value: "fine-dining", label: t("customTrip.filters.fineDining") },
        { value: "brunch", label: t("customTrip.filters.brunch") },
        { value: "pastry", label: t("customTrip.filters.pastryBakery") },
        { value: "quick", label: t("customTrip.filters.quickBites") },
        { value: "trendy", label: t("customTrip.filters.trendySpots") },
      ]
    },
    liveEvents: {
      label: t("customTrip.filters.eventType"),
      options: [
        { value: "all", label: t("customTrip.filters.allEvents") },
        { value: "music", label: t("customTrip.filters.musicConcerts") },
        { value: "show", label: t("customTrip.filters.showsTheater") },
        { value: "art", label: t("customTrip.filters.artExhibitions") },
        { value: "party", label: t("customTrip.filters.nightlifeParties") },
        { value: "food", label: t("customTrip.filters.foodWineEvents") },
        { value: "wellness", label: t("customTrip.filters.wellness") },
      ]
    },
    cafes: {
      label: t("customTrip.filters.cafeType"),
      options: [
        { value: "all", label: t("customTrip.filters.allCafes") },
        { value: "iconic", label: t("customTrip.filters.iconicHistoric") },
        { value: "specialty", label: t("customTrip.filters.specialtyCoffee") },
        { value: "unique", label: t("customTrip.filters.uniqueHidden") },
      ]
    },
    transport: {
      label: t("customTrip.filters.transportType"),
      options: [
        { value: "all", label: t("customTrip.filters.allOptions") },
        { value: "metro", label: t("customTrip.filters.metroPublic") },
        { value: "bike", label: t("customTrip.filters.bikeScooter") },
        { value: "walking", label: t("customTrip.filters.walkingTours") },
        { value: "boat", label: t("customTrip.filters.boatRiver") },
      ]
    },
    experiences: {
      label: t("customTrip.filters.experienceType"),
      options: [
        { value: "all", label: t("customTrip.filters.allExperiences") },
        { value: "romantic", label: t("customTrip.filters.romantic") },
        { value: "food", label: t("customTrip.filters.foodCooking") },
        { value: "photo", label: t("customTrip.filters.photography") },
        { value: "unique", label: t("customTrip.filters.uniqueCreative") },
      ]
    },
  }
  
  const getCurrentFilter = () => {
    switch (selectedCategory) {
      case "activities": return activityTypeFilter
      case "restaurants": return restaurantCuisineFilter
      case "liveEvents": return eventTypeFilter
      case "cafes": return cafeTypeFilter
      default: return "all"
    }
  }
  
  const setCurrentFilter = (value: string) => {
    switch (selectedCategory) {
      case "activities": setActivityTypeFilter(value); break
      case "restaurants": setRestaurantCuisineFilter(value); break
      case "liveEvents": setEventTypeFilter(value); break
      case "cafes": setCafeTypeFilter(value); break
    }
  }
  
  const categories = Object.entries(parisDataWithIcons.categories) as [CategoryKey, typeof parisDataWithIcons.categories[CategoryKey]][]
  const currentCategory = parisDataWithIcons.categories[selectedCategory]
  
  // Calculate trip duration
  const start = new Date(startDate)
  const end = new Date(endDate)
  const tripDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  
  const filteredItems = (currentCategory.items as Item[]).filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPopular = !popularOnly || item.popular
    
    let matchesPrice = true
    if (priceFilter === "free") matchesPrice = item.cost === 0
    else if (priceFilter === "budget") matchesPrice = item.cost > 0 && item.cost <= 20
    else if (priceFilter === "mid") matchesPrice = item.cost > 20 && item.cost <= 50
    else if (priceFilter === "high") matchesPrice = item.cost > 50
    
    // Category-specific filter
    const currentFilter = getCurrentFilter()
    const matchesCategoryFilter = currentFilter === "all" || 
      (item.tags && item.tags.some(tag => tag.includes(currentFilter)))
    
    return matchesSearch && matchesPopular && matchesPrice && matchesCategoryFilter
  })
  
  const isInBasket = (id: string) => basket.some(item => item.id === id)
  
  const toggleBasket = (item: Item) => {
    if (isInBasket(item.id)) {
      setBasket(basket.filter(i => i.id !== item.id))
    } else {
      // Add item with category info
      setBasket([...basket, { ...item, category: selectedCategory }])
    }
  }
  
  const totalCost = basket.reduce((sum, item) => sum + item.cost, 0)
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const saveBasketToStorage = () => {
    // Save basket with category info
    const basketWithCategory = basket.map(item => ({
      ...item,
      category: selectedCategory
    }))
    localStorage.setItem("tripBasket", JSON.stringify(basketWithCategory))
    localStorage.setItem("tripDays", tripDays.toString())
    localStorage.setItem("tripTravelers", travelers.toString())
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/20 border-b">
        <div className="container mx-auto px-4 py-6 sm:py-10">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="size-4" />
            <span className="text-sm">{t("customTrip.backToPlans")}</span>
          </Link>
          
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
              {t("customTrip.buildYour")} {destination} {t("customTrip.trip")}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-4">
              {t("customTrip.selectActivities")}
            </p>
            
            {/* Info Cards */}
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                  <Sparkles className="size-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">{t("customTrip.aiAccommodationTitle")}</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
                    {t("customTrip.aiAccommodation")}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 bg-green-50 dark:bg-green-950/30 rounded-lg p-3 border border-green-200 dark:border-green-800">
                <div className="size-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center shrink-0">
                  <Heart className="size-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">{t("customTrip.withYouTitle")}</p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-0.5">
                    {t("customTrip.withYou")}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Trip Settings */}
          <div className="bg-background/80 backdrop-blur-sm rounded-xl border p-4 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium flex items-center gap-2">
                <SlidersHorizontal className="size-4" />
                {t("customTrip.tripSettings")}
              </h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="text-xs"
              >
                {showSettings ? t("customTrip.hide") : t("customTrip.edit")}
                {showSettings ? <ChevronUp className="size-3 ms-1" /> : <ChevronDown className="size-3 ms-1" />}
              </Button>
            </div>
            
            {/* Summary Row */}
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="gap-1.5 py-1.5 px-3">
                <MapPin className="size-3.5" />
                {t("customTrip.parisLabel")}
              </Badge>
              <Badge variant="outline" className="gap-1.5 py-1.5 px-3">
                <CalendarDays className="size-3.5" />
                {formatDate(startDate)} - {formatDate(endDate)} ({t("customTrip.daysCount", { count: tripDays })})
              </Badge>
              <Badge variant="outline" className="gap-1.5 py-1.5 px-3">
                <Users className="size-3.5" />
                {travelers} {travelers === 1 ? t("customTrip.travelerSingular") : t("customTrip.travelerPlural")}
              </Badge>
              <Badge variant="outline" className="gap-1.5 py-1.5 px-3">
                <Wallet className="size-3.5" />
                {budget === "budget" ? t("customTrip.budgetLabel") : budget === "mid" ? t("customTrip.midRange") : t("customTrip.luxury")}
              </Badge>
              <Badge 
                variant={accommodationStatus === "booked" && accommodations.length > 0 ? "default" : accommodationStatus === "planning" ? "outline" : "secondary"} 
                className={`gap-1.5 py-1.5 px-3 ${
                  accommodationStatus === "booked" && accommodations.length > 0 ? "bg-green-600 hover:bg-green-600" : ""
                }`}
              >
                {accommodationStatus === "booked" && accommodations.length > 0 && <CheckCircle className="size-3.5" />}
                {accommodationStatus === "planning" && <CalendarCheck className="size-3.5" />}
                {(accommodationStatus === "undecided" || (accommodationStatus === "booked" && accommodations.length === 0)) && <HelpCircle className="size-3.5" />}
                {accommodationStatus === "booked" && accommodations.length > 0
                  ? accommodations.length === 1 
                    ? accommodations[0].name.length > 18 ? accommodations[0].name.slice(0, 18) + "..." : accommodations[0].name
                    : t("customTrip.staysBookedCount", { count: accommodations.length })
                  : accommodationStatus === "planning" 
                  ? t("customTrip.planningStay")
                  : t("customTrip.accommodationTBD")}
              </Badge>
            </div>
            
            {/* Expanded Settings */}
            {showSettings && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">{t("customTrip.destination")}</Label>
                  <div className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2">
                    <MapPin className="size-4 text-primary" />
                    <span className="font-medium">{destination}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">{t("customTrip.startDate")}</Label>
                  <Input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">{t("customTrip.endDate")}</Label>
                  <Input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">{t("customTrip.travelers")}</Label>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="size-10 bg-transparent"
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    >
                      -
                    </Button>
                    <span className="w-10 text-center font-medium">{travelers}</span>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="size-10 bg-transparent"
                      onClick={() => setTravelers(Math.min(10, travelers + 1))}
                    >
                      +
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2 sm:col-span-2 lg:col-span-4">
                  <Label className="text-xs text-muted-foreground">{t("customTrip.budget")}</Label>
                  <div className="flex gap-2">
                    {["budget","mid","luxury"].map((val) => {
                      const labels: Record<string, string> = { budget: t("customTrip.budgetLabel"), mid: t("customTrip.midRange"), luxury: t("customTrip.luxury") }
                      const descs: Record<string, string> = { budget: t("customTrip.budgetUnder100"), mid: t("customTrip.budgetMidRange"), luxury: t("customTrip.budgetOver250") }
                      return (
                        <Button
                          key={val}
                          variant={budget === val ? "default" : "outline"}
                          className="flex-1 h-auto py-2 flex-col items-start"
                          onClick={() => setBudget(val as typeof budget)}
                        >
                          <span className="font-medium">{labels[val]}</span>
                          <span className="text-xs opacity-70">{descs[val]}</span>
                        </Button>
                      )
                    })}
                  </div>
                </div>
                
                {/* Accommodation Section - Multiple Stays */}
                <div className="sm:col-span-2 lg:col-span-4 pt-4 border-t space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hotel className="size-4 text-primary" />
                      <Label className="text-sm font-medium">{t("customTrip.accommodation")}</Label>
                      <span className="text-xs text-muted-foreground">{t("customTrip.addStays")}</span>
                    </div>
                    {accommodations.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {accommodations.length} {t("customTrip.staysAdded")}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Booking Status */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">{t("customTrip.haveYouBooked")}</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { value: "booked", label: t("customTrip.alreadyBooked"), icon: CheckCircle, desc: t("customTrip.bookedDesc"), color: "text-green-600" },
                        { value: "planning", label: t("customTrip.planningToBook"), icon: CalendarCheck, desc: t("customTrip.planningDesc"), color: "text-blue-600" },
                        { value: "undecided", label: t("customTrip.decideLater"), icon: HelpCircle, desc: t("customTrip.undecidedDesc"), color: "text-amber-600" },
                      ].map((option) => {
                        const Icon = option.icon
                        return (
                          <Button
                            key={option.value}
                            variant={accommodationStatus === option.value ? "default" : "outline"}
                            className={`h-auto py-3 flex-col items-center gap-1 ${
                              accommodationStatus === option.value 
                                ? option.value === "booked" ? "bg-green-600 hover:bg-green-700" 
                                : option.value === "planning" ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-amber-500 hover:bg-amber-600"
                                : ""
                            }`}
                            onClick={() => {
                              setAccommodationStatus(option.value as typeof accommodationStatus)
                              if (option.value === "booked") setShowAddAccommodation(true)
                            }}
                          >
                            <Icon className={`size-5 ${accommodationStatus !== option.value ? option.color : ""}`} />
                            <span className="font-medium text-sm">{option.label}</span>
                            <span className="text-[10px] opacity-70">{option.desc}</span>
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                  
                  {/* Already Booked - Multiple Accommodations List */}
                  {accommodationStatus === "booked" && (
                    <div className="space-y-3 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                      {/* List of Added Accommodations */}
                      {accommodations.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center gap-1.5">
                              <CheckCircle className="size-4" />
                              {t("customTrip.yourStays")} ({accommodations.length})
                            </span>
                          </div>
                          
                          {accommodations.map((acc, idx) => (
                            <div key={acc.id} className="bg-background rounded-lg p-3 border">
                              <div className="flex gap-3">
                                <div className="relative size-16 rounded-lg overflow-hidden shrink-0">
                                  <Image src={acc.image || "/placeholder.svg"} alt={acc.name} fill sizes="64px" className="object-cover" />
                                  <div className="absolute top-1 start-1 size-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-bold">
                                    {idx + 1}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between">
                                    <h4 className="font-semibold text-sm">{acc.name}</h4>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => setAccommodations(prev => prev.filter(a => a.id !== acc.id))}
                                      className="size-6 p-0 text-muted-foreground hover:text-destructive"
                                    >
                                      <X className="size-3" />
                                    </Button>
                                  </div>
                                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <MapPin className="size-3" />
                                    {parisAreas.find(a => a.value === acc.area)?.label || acc.address}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                    <Badge variant="outline" className="text-[10px] gap-1">
                                      <Calendar className="size-2.5" />
                                      {acc.checkIn} - {acc.checkOut}
                                    </Badge>
                                    <Badge variant="secondary" className="text-[10px] gap-1">
                                      <Clock className="size-2.5" />
                                      {t("customTrip.arrival")}: {acc.arrivalTime}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Add New Accommodation */}
                      {showAddAccommodation ? (
                        <div className="space-y-3 pt-3 border-t border-green-200 dark:border-green-800">
                          <Label className="text-sm text-green-700 dark:text-green-300">
                            {accommodations.length === 0 ? t("customTrip.addFirstStay") : t("customTrip.addAnotherStay")}
                          </Label>
                          
                          {/* Date & Arrival Time Selection */}
                          <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-1">
                              <Label className="text-[10px] text-muted-foreground">{t("customTrip.checkIn")}</Label>
                              <Input
                                type="date"
                                value={newAccommodationDates.checkIn || startDate}
                                onChange={(e) => setNewAccommodationDates(prev => ({ ...prev, checkIn: e.target.value }))}
                                className="text-xs h-9 bg-background"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px] text-muted-foreground">{t("customTrip.checkOut")}</Label>
                              <Input
                                type="date"
                                value={newAccommodationDates.checkOut || endDate}
                                onChange={(e) => setNewAccommodationDates(prev => ({ ...prev, checkOut: e.target.value }))}
                                className="text-xs h-9 bg-background"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px] text-muted-foreground">{t("customTrip.arrivalTime")}</Label>
                              <Input
                                type="time"
                                value={newAccommodationDates.arrivalTime}
                                onChange={(e) => setNewAccommodationDates(prev => ({ ...prev, arrivalTime: e.target.value }))}
                                className="text-xs h-9 bg-background"
                              />
                            </div>
                          </div>
                          
                          {/* Hotel Search */}
                          <div className="relative">
                            <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                              placeholder={t("customTrip.searchHotel")}
                              value={hotelSearch}
                              onChange={(e) => setHotelSearch(e.target.value)}
                              className="ps-10 bg-background"
                            />
                          </div>
                          {hotelSearch && (
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {filteredHotels.length > 0 ? (
                                filteredHotels.map((hotel) => (
                                  <button
                                    key={hotel.name}
                                    onClick={() => {
                                      setAccommodations(prev => [...prev, {
                                        id: `acc-${Date.now()}`,
                                        ...hotel,
                                        type: hotel.name.toLowerCase().includes("airbnb") ? "airbnb" : "hotel",
                                        checkIn: newAccommodationDates.checkIn || startDate,
                                        checkOut: newAccommodationDates.checkOut || endDate,
                                        arrivalTime: newAccommodationDates.arrivalTime,
                                      }])
                                      setHotelSearch("")
                                      setNewAccommodationDates({ checkIn: "", checkOut: "", arrivalTime: "14:00" })
                                    }}
                                    className="w-full flex gap-3 p-2 rounded-lg bg-background border hover:border-green-400 transition-colors text-start"
                                  >
                                    <div className="relative size-10 rounded overflow-hidden shrink-0">
                                      <Image src={hotel.image || "/placeholder.svg"} alt={hotel.name} fill sizes="40px" className="object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm truncate">{hotel.name}</p>
                                      <p className="text-xs text-muted-foreground truncate">{hotel.address}</p>
                                    </div>
                                    <Star className="size-3 fill-amber-400 text-amber-400 shrink-0" />
                                    <span className="text-xs shrink-0">{hotel.rating}</span>
                                  </button>
                                ))
                              ) : (
                                <p className="text-xs text-muted-foreground text-center py-3">
                                  {t("customTrip.noResults")}
                                </p>
                              )}
                            </div>
                          )}
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="bg-transparent"
                              onClick={() => setShowAddAccommodation(false)}
                            >
                              {t("customTrip.cancel")}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full border-dashed bg-transparent"
                          onClick={() => setShowAddAccommodation(true)}
                        >
                          <Plus className="size-4 me-2" />
                          {accommodations.length === 0 ? t("customTrip.addAccommodation") : t("customTrip.addAnotherStay")}
                        </Button>
                      )}
                      
                      {accommodations.length > 0 && (
                        <p className="text-xs text-green-700 dark:text-green-300">
                          {t("customTrip.itineraryOptimized")}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* Planning to Book */}
                  {accommodationStatus === "planning" && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        {t("customTrip.planningNote")}
                      </p>
                    </div>
                  )}
                  
                  {/* Undecided - AI Suggestion */}
                  {accommodationStatus === "undecided" && (
                    <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                      <Sparkles className="size-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-800 dark:text-amber-200">
                        <p className="font-medium mb-1">{t("customTrip.aiWillHelp")}</p>
                        <p className="opacity-80">{t("customTrip.aiWillHelpDesc")}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          {categories.map(([key, category]) => {
            const Icon = category.icon
            const basketCount = basket.filter(item => 
              category.items.some(catItem => catItem.id === item.id)
            ).length
            
            return (
              <Button
                key={key}
                variant={selectedCategory === key ? "default" : "outline"}
                size="sm"
                className="shrink-0 gap-2 relative"
                onClick={() => setSelectedCategory(key)}
              >
                <Icon className="size-4" />
                <span className="hidden sm:inline">{categoryLabelMap[key]}</span>
                {basketCount > 0 && (
                  <span className="absolute -top-1.5 -end-1.5 size-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {basketCount}
                  </span>
                )}
              </Button>
            )
          })}
        </div>
        
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder={t("customTrip.searchCategory", { category: categoryLabelMap[selectedCategory] })}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={showFilters ? "secondary" : "outline"}
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className="shrink-0"
            >
              <Filter className="size-4" />
            </Button>
            
            <Button
              variant={popularOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setPopularOnly(!popularOnly)}
              className="shrink-0 gap-1.5"
            >
              <Star className="size-3.5" />
              {t("customTrip.popular")}
            </Button>
          </div>
        </div>
        
        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-secondary/30 rounded-lg p-4 mb-6 space-y-4">
            {/* Category-specific filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground me-2 w-full sm:w-auto">
                {categoryFilters[selectedCategory]?.label || t("customTrip.filter")}:
              </span>
              {categoryFilters[selectedCategory]?.options.map((option) => (
                <Button
                  key={option.value}
                  variant={getCurrentFilter() === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentFilter(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            
            {/* Price filter */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t">
              <span className="text-sm text-muted-foreground me-2">{t("customTrip.price")}:</span>
              {[
                { value: "all", label: t("customTrip.all") },
                { value: "free", label: t("customTrip.free") },
                { value: "budget", label: t("customTrip.under20") },
                { value: "mid", label: t("customTrip.range20to50") },
                { value: "high", label: t("customTrip.over50") },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={priceFilter === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPriceFilter(option.value as typeof priceFilter)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {/* Category Header */}
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <div className={`size-10 rounded-xl ${currentCategory.color} flex items-center justify-center`}>
              <currentCategory.icon className="size-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{categoryDescriptionMap[selectedCategory]}</h2>
              <p className="text-sm text-muted-foreground">
                {filteredItems.length} {t("customTrip.optionsAvailable", { count: filteredItems.length }).replace(`${filteredItems.length} `, "")}
              </p>
            </div>
          </div>
        </div>
        
        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-24">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`group relative bg-card rounded-xl border overflow-hidden transition-all hover:shadow-lg ${
                isInBasket(item.id) ? "ring-2 ring-primary" : ""
              }`}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.image || "/paris-eiffel-tower-sunset.jpg"}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform group-hover:scale-105"
                />
                
                {/* Badges */}
                <div className="absolute top-2 start-2 flex flex-wrap gap-1.5">
                  {item.popular && (
                    <Badge className="absolute top-2 start-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5">
                      {t("customTrip.mustDo")}
                    </Badge>
                  )}
                  {item.cost === 0 && (
                    <Badge className="bg-green-500 text-white text-xs">{t("customTrip.free")}</Badge>
                  )}
                </div>
                
                {/* Add Button */}
                <Button
                  size="icon"
                  variant={isInBasket(item.id) ? "default" : "secondary"}
                  className="absolute top-2 end-2 size-8 rounded-full shadow-lg"
                  onClick={() => toggleBasket(item as Item)}
                >
                  {isInBasket(item.id) ? (
                    <Check className="size-4" />
                  ) : (
                    <Plus className="size-4" />
                  )}
                </Button>
                
                {/* Price Badge */}
                <div className="absolute bottom-2 end-2">
                  {item.cost > 0 ? (
                    <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm font-bold">
                      ${item.cost}
                    </Badge>
                  ) : null}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-3">
                <h3 className="font-medium text-sm line-clamp-1 mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
                
                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {item.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="size-3 fill-amber-400 text-amber-400" />
                    {item.rating} ({item.reviews.toLocaleString()})
                  </div>
                </div>
                
                {/* Official Site Notice */}
                {item.officialSite && item.cost > 0 && (
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <ExternalLink className="size-3" />
                      {t("customTrip.buyFromSite")} {item.officialSite}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Floating Basket Button - Mobile */}
      <div className="fixed bottom-4 start-4 end-4 sm:hidden z-40">
        <Button
          className="w-full h-14 rounded-full shadow-xl gap-3"
          onClick={() => setShowBasket(true)}
        >
          <ShoppingBag className="size-5" />
          <span className="font-medium">{t("customTrip.myBasket")} ({basket.length})</span>
          {totalCost > 0 && (
            <Badge variant="secondary" className="ms-auto">
              ${totalCost}
            </Badge>
          )}
        </Button>
      </div>
      
      {/* Desktop Basket Button */}
      <div className="hidden sm:block fixed bottom-6 end-6 z-40">
        <Button
          size="lg"
          className="h-14 px-6 rounded-full shadow-xl gap-3"
          onClick={() => setShowBasket(true)}
        >
          <ShoppingBag className="size-5" />
          <span className="font-medium">{t("customTrip.myBasket")} ({basket.length})</span>
          {totalCost > 0 && (
            <Badge variant="secondary">
              ${totalCost}
            </Badge>
          )}
        </Button>
      </div>
      
      {/* Basket Sidebar */}
      {showBasket && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowBasket(false)}
          />
          <div className="relative w-full sm:w-96 max-w-full bg-background h-full overflow-hidden flex flex-col animate-in slide-in-from-right">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-xl font-bold">{t("customTrip.myBasket")}</h2>
                <p className="text-sm text-muted-foreground">
                  {basket.length} {t("customTrip.itemsSelected")}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowBasket(false)}>
                <X className="size-5" />
              </Button>
            </div>
            
            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {basket.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="size-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">{t("customTrip.basketEmpty")}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("customTrip.addActivities")}
                  </p>
                </div>
              ) : (
                basket.map((item) => (
                  <div key={item.id} className="flex gap-3 p-2 rounded-lg bg-secondary/30">
                    <div className="relative size-16 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={item.image || "/paris-eiffel-tower-sunset.jpg"}
                        alt={item.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.duration}</p>
                      <p className="text-sm font-medium mt-1">
                        {item.cost === 0 ? t("customTrip.free") : `$${item.cost}`}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => toggleBasket(item)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
            
            {/* Footer */}
            {basket.length > 0 && (
              <div className="border-t p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t("customTrip.estimatedTotal")}</span>
                  <span className="text-2xl font-bold">${totalCost}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("customTrip.priceDisclaimer")}
                </p>
                <Link href="/trip-basket" onClick={saveBasketToStorage}>
                  <Button className="w-full h-12 gap-2" size="lg">
                    <Sparkles className="size-4" />
                    {t("customTrip.generateTrip")}
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full bg-transparent"
                  onClick={() => setBasket([])}
                >
                  {t("customTrip.clearBasket")}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
