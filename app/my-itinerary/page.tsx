"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft, Clock, MapPin, Calendar, Users, Sparkles,
  Camera, Music, Utensils, Coffee, Train, Heart, Star,
  Search, Building, Home, BedDouble, Loader2, ChevronRight,
  Sun, Sunset, Moon, CheckCircle2, Info, ExternalLink,
  Sunrise, CloudSun, ShoppingBag, FileCheck, CreditCard,
  ClipboardCheck, Luggage, Square, CheckSquare,
  ImageIcon, RefreshCw, Shuffle
} from "lucide-react"

// Types
type TimePeriod = "early_morning" | "morning" | "midday" | "afternoon" | "evening"

type ActivityAlternative = {
  id: string
  title: string
  description: string
  duration: string
  image?: string
}

type DayActivity = {
  id?: string
  timePeriod: TimePeriod
  title: string
  description: string
  duration: string
  type: "activity" | "restaurant" | "cafe" | "transport" | "experience" | "event"
  tips: string | null
  image?: string
  alternatives?: ActivityAlternative[]
}

type Day = {
  dayNumber: number
  date: string
  theme: string
  activities: DayActivity[]
}

type ChecklistItem = {
  id: string
  category: "book" | "buy" | "register" | "prepare" | "pack"
  title: string
  description: string
  completed: boolean
  link?: string
}

type Itinerary = {
  title: string
  summary: string
  totalDays: number
  totalCost: number
  days: Day[]
  packingTips: string[]
  localTips: string[]
  checklist: ChecklistItem[]
}

// Time period display names and icons
// Time period display names - will be localized inside component
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const timePeriodLabelsDefault: Record<TimePeriod, string> = {
  early_morning: "Early Morning",
  morning: "Morning", 
  midday: "Midday",
  afternoon: "Afternoon",
  evening: "Evening"
}

const timePeriodTimes: Record<TimePeriod, string> = {
  early_morning: "6:00 - 9:00",
  morning: "9:00 - 12:00",
  midday: "12:00 - 14:00",
  afternoon: "14:00 - 18:00",
  evening: "18:00 - 23:00"
}

type Accommodation = {
  id: string
  name: string
  type: "hotel" | "airbnb" | "hostel" | "boutique"
  image: string
  price: number
  rating: number
  reviews: number
  location: string
  distance: string
  amenities: string[]
  bookingUrl: string
  daysFrom: number
  daysTo: number
  isBooked?: boolean
}

// Demo accommodations - split across different parts of the trip
const demoAccommodations: Accommodation[] = [
  {
    id: "h1",
    name: "Hotel Le Marais",
    type: "hotel",
    image: "/paris-montmartre-streets.jpg",
    price: 180,
    rating: 4.7,
    reviews: 2340,
    location: "Le Marais, 4th Arr.",
    distance: "0.5 km from Louvre",
    amenities: ["WiFi", "Breakfast", "Air Conditioning", "24h Reception"],
    bookingUrl: "https://www.booking.com/searchresults.html?ss=Paris+Le+Marais",
    daysFrom: 1,
    daysTo: 5
  },
  {
    id: "h2",
    name: "Charming Montmartre Apartment",
    type: "airbnb",
    image: "/paris-montmartre-streets.jpg",
    price: 120,
    rating: 4.9,
    reviews: 186,
    location: "Montmartre, 18th Arr.",
    distance: "Walking distance to Sacre-Coeur",
    amenities: ["Full Kitchen", "WiFi", "Washer", "Balcony View"],
    bookingUrl: "https://www.booking.com/searchresults.html?ss=Paris+Montmartre",
    daysFrom: 1,
    daysTo: 11
  },
  {
    id: "h3",
    name: "Generator Paris Hostel",
    type: "hostel",
    image: "/paris-cafe-terrace.jpg",
    price: 35,
    rating: 4.3,
    reviews: 5670,
    location: "Colonel Fabien, 10th Arr.",
    distance: "Near Canal Saint-Martin",
    amenities: ["WiFi", "Bar", "Lounge", "Lockers"],
    bookingUrl: "https://www.booking.com/searchresults.html?ss=Paris+Canal+Saint-Martin",
    daysFrom: 1,
    daysTo: 11
  },
  {
    id: "h4",
    name: "Hotel des Arts Montmartre",
    type: "boutique",
    image: "/paris-eiffel-tower-sunset.jpg",
    price: 220,
    rating: 4.8,
    reviews: 890,
    location: "Montmartre, 18th Arr.",
    distance: "5 min walk to artists' square",
    amenities: ["WiFi", "Rooftop Bar", "Spa", "Concierge"],
    bookingUrl: "https://www.booking.com/searchresults.html?ss=Paris+Montmartre+boutique+hotel",
    daysFrom: 6,
    daysTo: 11
  },
  {
    id: "h5",
    name: "Cozy Studio near Eiffel",
    type: "airbnb",
    image: "/paris-eiffel-tower-sunset.jpg",
    price: 95,
    rating: 4.6,
    reviews: 312,
    location: "Champ de Mars, 7th Arr.",
    distance: "10 min walk to Eiffel Tower",
    amenities: ["WiFi", "Kitchen", "Metro nearby"],
    bookingUrl: "https://www.booking.com/searchresults.html?ss=Paris+Eiffel+Tower",
    daysFrom: 1,
    daysTo: 3
  },
  {
    id: "h6",
    name: "St Christopher's Inn",
    type: "hostel",
    image: "/paris-seine-river.jpg",
    price: 42,
    rating: 4.4,
    reviews: 3200,
    location: "Gare du Nord, 10th Arr.",
    distance: "Near major train stations",
    amenities: ["WiFi", "Cafe", "Events", "Tours"],
    bookingUrl: "https://www.booking.com/searchresults.html?ss=Paris+Gare+du+Nord",
    daysFrom: 4,
    daysTo: 8
  },
]

// Activity type icons
const typeIcons: Record<string, typeof Camera> = {
  activity: Camera,
  restaurant: Utensils,
  cafe: Coffee,
  transport: Train,
  experience: Heart,
  event: Music
}

const typeColors: Record<string, string> = {
  activity: "bg-blue-100 text-blue-700",
  restaurant: "bg-orange-100 text-orange-700",
  cafe: "bg-amber-100 text-amber-700",
  transport: "bg-purple-100 text-purple-700",
  experience: "bg-pink-100 text-pink-700",
  event: "bg-green-100 text-green-700"
}

// Time period icons
const timePeriodIcons: Record<TimePeriod, typeof Sun> = {
  early_morning: Sunrise,
  morning: Sun,
  midday: CloudSun,
  afternoon: Sunset,
  evening: Moon
}

// Checklist category icons and colors
const checklistCategoryIcons: Record<string, typeof ShoppingBag> = {
  book: CreditCard,
  buy: ShoppingBag,
  register: FileCheck,
  prepare: ClipboardCheck,
  pack: Luggage
}

const checklistCategoryColors: Record<string, string> = {
  book: "bg-blue-100 text-blue-700",
  buy: "bg-amber-100 text-amber-700",
  register: "bg-purple-100 text-purple-700",
  prepare: "bg-green-100 text-green-700",
  pack: "bg-pink-100 text-pink-700"
}

// Function to get time icon based on activity time
const getTimeIcon = (time: string): typeof Sun => {
  if (time >= "06:00" && time < "09:00") return Sunrise;
  if (time >= "09:00" && time < "12:00") return Sun;
  if (time >= "12:00" && time < "14:00") return CloudSun;
  if (time >= "14:00" && time < "18:00") return Sunset;
  return Moon;
}

export default function MyItineraryPage() {
  const { t } = useI18n()
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeDay, setActiveDay] = useState(1)
  const [activeTab, setActiveTab] = useState("itinerary")
  
  // Localized time period labels
  const timePeriodLabels: Record<TimePeriod, string> = {
    early_morning: t("myItinerary.timePeriodEarlyMorning"),
    morning: t("myItinerary.timePeriodMorning"),
    midday: t("myItinerary.timePeriodMidday"),
    afternoon: t("myItinerary.timePeriodAfternoon"),
    evening: t("myItinerary.timePeriodEvening")
  }
  
  // Localized accommodation type labels
  const accommodationTypeLabels: Record<string, string> = {
    all: t("myItinerary.accommodationTypeAll"),
    hotel: t("myItinerary.accommodationTypeHotel"),
    airbnb: t("myItinerary.accommodationTypeAirbnb"),
    hostel: t("myItinerary.accommodationTypeHostel"),
    boutique: t("myItinerary.accommodationTypeBoutique")
  }
  
  // Accommodation state
  const [accommodations, setAccommodations] = useState<Accommodation[]>(demoAccommodations)
  const [accommodationSearch, setAccommodationSearch] = useState("")
  const [accommodationType, setAccommodationType] = useState<"all" | "hotel" | "airbnb" | "hostel" | "boutique">("all")
  const [selectedAccommodation, setSelectedAccommodation] = useState<string | null>(null)
  const [bookedAccommodations, setBookedAccommodations] = useState<string[]>([])
  const [isOptimizing, setIsOptimizing] = useState(false)
  
  // Confirm booking and trigger itinerary optimization
  const confirmBooking = async (accId: string) => {
    setBookedAccommodations(prev => [...prev, accId])
    setIsOptimizing(true)
    
    // Simulate AI optimization
    setTimeout(() => {
      setIsOptimizing(false)
    }, 2000)
  }
  
  // Remove booking
  const removeBooking = (accId: string) => {
    setBookedAccommodations(prev => prev.filter(id => id !== accId))
  }
  
  // Checklist state
  const [checklist, setChecklist] = useState<ChecklistItem[]>([])
  
  // Swap activity state
  const [swappingActivity, setSwappingActivity] = useState<{ dayNum: number; activityIndex: number; period: TimePeriod } | null>(null)
  const [isSwapping, setIsSwapping] = useState(false)
  
  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }
  
  // Swap activity with alternative
  const handleSwapActivity = (dayNum: number, period: TimePeriod, activityIndex: number, alternative: ActivityAlternative) => {
    if (!itinerary) return
    
    setItinerary(prev => {
      if (!prev) return prev
      return {
        ...prev,
        days: prev.days.map(day => {
          if (day.dayNumber !== dayNum) return day
          
          const periodActivities = day.activities.filter(a => a.timePeriod === period)
          const otherActivities = day.activities.filter(a => a.timePeriod !== period)
          
          const updatedPeriodActivities = periodActivities.map((activity, idx) => {
            if (idx !== activityIndex) return activity
            return {
              ...activity,
              title: alternative.title,
              description: alternative.description,
              duration: alternative.duration,
              image: alternative.image,
            }
          })
          
          return {
            ...day,
            activities: [...otherActivities, ...updatedPeriodActivities]
          }
        })
      }
    })
    setSwappingActivity(null)
  }

  // Load basket and generate itinerary
  useEffect(() => {
    const generateItinerary = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const savedBasket = localStorage.getItem("tripBasket")
        const tripDays = localStorage.getItem("tripDays") || "11"
        const travelers = localStorage.getItem("tripTravelers") || "2"
        
        // Demo basket if none exists
        const basket = savedBasket ? JSON.parse(savedBasket) : [
          { title: "Eiffel Tower", description: "Skip-the-line summit access", duration: "2-3h", cost: 35, category: "activities" },
          { title: "Louvre Museum", description: "See Mona Lisa and 35,000 artworks", duration: "3-4h", cost: 17, category: "activities" },
          { title: "Montmartre Walking Tour", description: "Artistic streets and Sacre-Coeur", duration: "2h", cost: 0, category: "activities" },
          { title: "Jazz Night at Caveau", description: "Live jazz in historic venue", duration: "3h", cost: 25, category: "liveEvents", date: "Mar 16" },
          { title: "Le Comptoir du Pantheon", description: "Traditional French cuisine", duration: "1.5h", cost: 45, category: "restaurants" },
          { title: "Cafe de Flore", description: "Iconic literary cafe since 1887", duration: "1h", cost: 15, category: "cafes" },
          { title: "Paris Metro Pass", description: "Unlimited travel", duration: "10 days", cost: 82, category: "transport" },
          { title: "Seine River Picnic", description: "Sunset picnic by the river", duration: "2h", cost: 0, category: "experiences" },
        ]

        const response = await fetch("/api/generate-itinerary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            basket,
            tripDays: parseInt(tripDays),
            travelers: parseInt(travelers),
            destination: "Paris, France"
          })
        })

        if (!response.ok) throw new Error("Failed to generate itinerary")

        const parsed = await response.json()
        setItinerary(parsed)
        if (parsed.checklist) {
          setChecklist(parsed.checklist)
        }
      } catch (err) {
        console.error("Error generating itinerary:", err)
        setError("Failed to generate itinerary. Using demo data.")
        
        // Use demo itinerary on error
        const demoItinerary: Itinerary = {
          title: "Paris Adventure: Art, Culture & Cuisine",
          summary: "An 11-day journey through the City of Lights, featuring iconic landmarks, world-class museums, charming cafes, and authentic Parisian experiences.",
          totalDays: 11,
          totalCost: 254,
          days: [
            {
              dayNumber: 1,
              date: "March 14, 2026",
              theme: "Arrival & Montmartre Exploration",
              activities: [
                { id: "d1a1", timePeriod: "afternoon", title: "Check-in & Settle", description: "Arrive at accommodation and freshen up", duration: "2h", type: "activity", tips: "Request a room with a view if available", image: "/paris-montmartre-streets.jpg", alternatives: [
                  { id: "alt1", title: "Early Check-in Lounge", description: "Use hotel lounge while waiting for room", duration: "1h", image: "/paris-cafe-terrace.jpg" },
                  { id: "alt2", title: "Luggage Storage & Explore", description: "Store bags and start exploring immediately", duration: "0.5h" }
                ]},
                { id: "d1a2", timePeriod: "afternoon", title: "Montmartre Walking Tour", description: "Explore artistic streets and visit Sacre-Coeur", duration: "2h", type: "activity", tips: "Best light for photos is late afternoon", image: "/paris-montmartre-streets.jpg", alternatives: [
                  { id: "alt3", title: "Le Marais Walking Tour", description: "Explore historic Jewish quarter and trendy boutiques", duration: "2h", image: "/paris-montmartre-streets.jpg" },
                  { id: "alt4", title: "Latin Quarter Stroll", description: "Walk through bohemian student neighborhood", duration: "2h" }
                ]},
                { id: "d1a3", timePeriod: "evening", title: "Cafe de Flore", description: "Iconic literary cafe since 1887", duration: "1h", type: "cafe", tips: "Try their famous hot chocolate", image: "/paris-cafe-terrace.jpg", alternatives: [
                  { id: "alt5", title: "Les Deux Magots", description: "Equally famous neighboring cafe", duration: "1h", image: "/paris-cafe-terrace.jpg" }
                ]},
                { id: "d1a4", timePeriod: "evening", title: "Dinner in Montmartre", description: "Local bistro dinner", duration: "1.5h", type: "restaurant", tips: "Ask for outdoor seating to watch the sunset", image: "/paris-cafe-terrace.jpg" },
              ]
            },
            {
              dayNumber: 2,
              date: "March 15, 2026",
              theme: "Louvre & Seine Exploration",
              activities: [
                { id: "d2a1", timePeriod: "early_morning", title: "Breakfast at hotel", description: "Start the day with a French breakfast", duration: "1h", type: "cafe", tips: null, image: "/paris-cafe-terrace.jpg" },
                { id: "d2a2", timePeriod: "morning", title: "Louvre Museum", description: "See Mona Lisa and 35,000 artworks", duration: "4h", type: "activity", tips: "Enter through Carrousel entrance to avoid crowds", image: "/paris-louvre-museum.jpg", alternatives: [
                  { id: "alt6", title: "Musee d'Orsay", description: "Impressionist masterpieces in former train station", duration: "3h", image: "/paris-louvre-museum.jpg" },
                  { id: "alt7", title: "Centre Pompidou", description: "Modern & contemporary art museum", duration: "3h" }
                ]},
                { id: "d2a3", timePeriod: "midday", title: "Lunch at Cafe Marly", description: "Lunch with Louvre views", duration: "1h", type: "restaurant", tips: "Reserve a terrace table", image: "/paris-cafe-terrace.jpg" },
                { id: "d2a4", timePeriod: "afternoon", title: "Seine River Walk", description: "Stroll along the Seine", duration: "2h", type: "experience", tips: "Stop by the bouquinistes (book sellers)", image: "/paris-seine-river.jpg", alternatives: [
                  { id: "alt8", title: "Tuileries Garden", description: "Relax in beautiful French formal gardens", duration: "2h", image: "/paris-seine-river.jpg" }
                ]},
                { id: "d2a5", timePeriod: "evening", title: "Seine River Picnic", description: "Sunset picnic by the river", duration: "2h", type: "experience", tips: "Grab wine and cheese from a nearby shop", image: "/paris-seine-river.jpg" },
              ]
            },
            {
              dayNumber: 3,
              date: "March 16, 2026",
              theme: "Eiffel Tower & Jazz Night",
              activities: [
                { id: "d3a1", timePeriod: "early_morning", title: "Breakfast at local boulangerie", description: "Fresh croissants and coffee", duration: "1h", type: "cafe", tips: null, image: "/paris-cafe-terrace.jpg" },
                { id: "d3a2", timePeriod: "morning", title: "Eiffel Tower", description: "Skip-the-line summit access", duration: "3h", type: "activity", tips: "Book the summit access, views are worth it", image: "/paris-eiffel-tower-sunset.jpg", alternatives: [
                  { id: "alt9", title: "Arc de Triomphe", description: "Climb for panoramic city views", duration: "1.5h", image: "/paris-eiffel-tower-sunset.jpg" },
                  { id: "alt10", title: "Montparnasse Tower", description: "Best view of Eiffel Tower from 56th floor", duration: "1.5h" }
                ]},
                { id: "d3a3", timePeriod: "midday", title: "Le Comptoir du Pantheon", description: "Traditional French cuisine", duration: "1.5h", type: "restaurant", tips: "Try the duck confit", image: "/paris-cafe-terrace.jpg" },
                { id: "d3a4", timePeriod: "afternoon", title: "Champ de Mars & Trocadero", description: "Best Eiffel Tower photo spots", duration: "2h", type: "activity", tips: "Trocadero offers the iconic front view", image: "/paris-eiffel-tower-sunset.jpg" },
                { id: "d3a5", timePeriod: "evening", title: "Jazz Night at Caveau", description: "Live jazz in historic venue", duration: "3h", type: "event", tips: "Arrive early for best seats", image: "/paris-cafe-terrace.jpg" },
              ]
            },
            {
              dayNumber: 4,
              date: "March 17, 2026",
              theme: "Versailles Day Trip",
              activities: [
                { id: "d4a1", timePeriod: "early_morning", title: "Quick breakfast & Train to Versailles", description: "RER C train to Versailles (40 min)", duration: "1.5h", type: "transport", tips: "Get an early start to beat crowds", image: "/paris-seine-river.jpg" },
                { id: "d4a2", timePeriod: "morning", title: "Palace of Versailles", description: "Explore Hall of Mirrors and Royal Apartments", duration: "3h", type: "activity", tips: "Audio guide included with ticket", image: "/paris-louvre-museum.jpg", alternatives: [
                  { id: "alt11", title: "Chateau de Fontainebleau", description: "Less crowded royal palace alternative", duration: "3h" }
                ]},
                { id: "d4a3", timePeriod: "midday", title: "Lunch at Ore Restaurant", description: "Alain Ducasse restaurant in the palace", duration: "1.5h", type: "restaurant", tips: "Book in advance", image: "/paris-cafe-terrace.jpg" },
                { id: "d4a4", timePeriod: "afternoon", title: "Gardens of Versailles", description: "800 hectares of landscaped gardens", duration: "3h", type: "experience", tips: "Rent a bike or golf cart for larger areas", image: "/paris-seine-river.jpg" },
                { id: "d4a5", timePeriod: "evening", title: "Return to Paris & Casual Dinner", description: "Rest and local neighborhood dinner", duration: "2h", type: "restaurant", tips: "Try a creperie for something light", image: "/paris-cafe-terrace.jpg" },
              ]
            },
            {
              dayNumber: 5,
              date: "March 18, 2026",
              theme: "Museums & Marais District",
              activities: [
                { id: "d5a1", timePeriod: "early_morning", title: "Breakfast at Merci Cafe", description: "Trendy cafe in concept store", duration: "1h", type: "cafe", tips: "Browse the store after", image: "/paris-cafe-terrace.jpg" },
                { id: "d5a2", timePeriod: "morning", title: "Musee d'Orsay", description: "Impressionist masterpieces by Monet, Van Gogh", duration: "3h", type: "activity", tips: "Less crowded than Louvre", image: "/paris-louvre-museum.jpg", alternatives: [
                  { id: "alt12", title: "Rodin Museum", description: "Sculptures in beautiful garden setting", duration: "2h" }
                ]},
                { id: "d5a3", timePeriod: "midday", title: "Lunch at L'As du Fallafel", description: "Best falafel in Paris", duration: "1h", type: "restaurant", tips: "Long lines but worth it", image: "/paris-cafe-terrace.jpg" },
                { id: "d5a4", timePeriod: "afternoon", title: "Le Marais Exploration", description: "Vintage shops, galleries, and Place des Vosges", duration: "3h", type: "experience", tips: "Visit Place des Vosges park", image: "/paris-montmartre-streets.jpg" },
                { id: "d5a5", timePeriod: "evening", title: "Aperitivo at Candelaria", description: "Hidden cocktail bar behind taqueria", duration: "2h", type: "cafe", tips: "Enter through the taco shop", image: "/paris-cafe-terrace.jpg" },
              ]
            },
            {
              dayNumber: 6,
              date: "March 19, 2026",
              theme: "Notre-Dame & Latin Quarter",
              activities: [
                { id: "d6a1", timePeriod: "early_morning", title: "Morning run along Seine", description: "Optional jog with Eiffel Tower views", duration: "1h", type: "activity", tips: "Best at sunrise", image: "/paris-seine-river.jpg" },
                { id: "d6a2", timePeriod: "morning", title: "Notre-Dame & Ile de la Cite", description: "View cathedral reconstruction and Sainte-Chapelle", duration: "2h", type: "activity", tips: "Sainte-Chapelle has stunning stained glass", image: "/paris-notre-dame-cathedral.jpg" },
                { id: "d6a3", timePeriod: "midday", title: "Lunch at Bouillon Chartier", description: "Historic affordable Parisian restaurant", duration: "1h", type: "restaurant", tips: "No reservations, be ready to wait", image: "/paris-cafe-terrace.jpg" },
                { id: "d6a4", timePeriod: "afternoon", title: "Shakespeare & Company", description: "Iconic English bookstore", duration: "1h", type: "activity", tips: "Attend a reading if one's scheduled", image: "/paris-montmartre-streets.jpg" },
                { id: "d6a5", timePeriod: "afternoon", title: "Luxembourg Gardens", description: "Relax in the elegant gardens", duration: "2h", type: "experience", tips: "Rent a sailboat for the pond", image: "/paris-seine-river.jpg" },
                { id: "d6a6", timePeriod: "evening", title: "Dinner in Saint-Germain", description: "Upscale neighborhood dining", duration: "2h", type: "restaurant", tips: "Make reservations", image: "/paris-cafe-terrace.jpg" },
              ]
            },
            {
              dayNumber: 7,
              date: "March 20, 2026",
              theme: "Day at Leisure - Choose Your Adventure",
              activities: [
                { id: "d7a1", timePeriod: "early_morning", title: "Sleep in & Late Brunch", description: "Recover from busy week with relaxed morning", duration: "2h", type: "cafe", tips: "Try eggs benedict at Hardware Societe", image: "/paris-cafe-terrace.jpg" },
                { id: "d7a2", timePeriod: "morning", title: "Flea Market at Puces de Saint-Ouen", description: "World's largest antique market", duration: "3h", type: "experience", tips: "Bargain politely but firmly", image: "/paris-montmartre-streets.jpg", alternatives: [
                  { id: "alt13", title: "Pere Lachaise Cemetery", description: "Visit graves of Oscar Wilde, Jim Morrison", duration: "2h" }
                ]},
                { id: "d7a3", timePeriod: "midday", title: "Lunch at market stalls", description: "Street food from vendors", duration: "1h", type: "restaurant", tips: "Cash preferred at many stalls", image: "/paris-cafe-terrace.jpg" },
                { id: "d7a4", timePeriod: "afternoon", title: "Spa or Shopping", description: "Self-care or Galeries Lafayette", duration: "3h", type: "experience", tips: "Rooftop at Galeries has great views", image: "/paris-montmartre-streets.jpg" },
                { id: "d7a5", timePeriod: "evening", title: "Seine Dinner Cruise", description: "See Paris illuminated from the water", duration: "2.5h", type: "experience", tips: "Book Bateaux Mouches for classic experience", image: "/paris-seine-river.jpg" },
              ]
            },
            {
              dayNumber: 8,
              date: "March 21, 2026",
              theme: "Champs-Elysees & Shopping",
              activities: [
                { id: "d8a1", timePeriod: "early_morning", title: "Breakfast at Laduree", description: "Famous for macarons since 1862", duration: "1h", type: "cafe", tips: "Try the rose petal macaron", image: "/paris-cafe-terrace.jpg" },
                { id: "d8a2", timePeriod: "morning", title: "Arc de Triomphe", description: "Climb 284 steps for panoramic views", duration: "1.5h", type: "activity", tips: "Book timed entry online", image: "/paris-eiffel-tower-sunset.jpg" },
                { id: "d8a3", timePeriod: "morning", title: "Champs-Elysees Stroll", description: "Walk the famous avenue", duration: "1.5h", type: "experience", tips: "Window shop the luxury brands", image: "/paris-montmartre-streets.jpg" },
                { id: "d8a4", timePeriod: "midday", title: "Lunch at Publicis Drugstore", description: "Modern brasserie by Champs-Elysees", duration: "1h", type: "restaurant", tips: "Great people watching", image: "/paris-cafe-terrace.jpg" },
                { id: "d8a5", timePeriod: "afternoon", title: "Grand Palais Exhibition", description: "World-class temporary exhibitions", duration: "2h", type: "activity", tips: "Check current exhibition online", image: "/paris-louvre-museum.jpg" },
                { id: "d8a6", timePeriod: "evening", title: "Dinner at Pink Mamma", description: "Trendy Italian in massive space", duration: "2h", type: "restaurant", tips: "No reservations, arrive early", image: "/paris-cafe-terrace.jpg" },
              ]
            },
            {
              dayNumber: 9,
              date: "March 22, 2026",
              theme: "Giverny - Monet's Gardens",
              activities: [
                { id: "d9a1", timePeriod: "early_morning", title: "Train to Vernon + shuttle", description: "45 min train + 15 min shuttle to Giverny", duration: "1.5h", type: "transport", tips: "Trains leave from Gare Saint-Lazare", image: "/paris-seine-river.jpg" },
                { id: "d9a2", timePeriod: "morning", title: "Monet's House & Water Gardens", description: "See the real water lily ponds", duration: "3h", type: "activity", tips: "Visit early before tour groups arrive", image: "/paris-seine-river.jpg", alternatives: [
                  { id: "alt14", title: "Auvers-sur-Oise", description: "Van Gogh's final home", duration: "4h" }
                ]},
                { id: "d9a3", timePeriod: "midday", title: "Lunch in Giverny village", description: "Charming garden restaurant", duration: "1.5h", type: "restaurant", tips: "Restaurant Baudy was Monet's hangout", image: "/paris-cafe-terrace.jpg" },
                { id: "d9a4", timePeriod: "afternoon", title: "Return to Paris & Rest", description: "Relax at hotel or nearby cafe", duration: "2h", type: "experience", tips: "Good time to do laundry if needed", image: "/paris-cafe-terrace.jpg" },
                { id: "d9a5", timePeriod: "evening", title: "Wine tasting dinner", description: "French wine and cheese pairing", duration: "2.5h", type: "experience", tips: "O Chateau offers great tastings", image: "/paris-cafe-terrace.jpg" },
              ]
            },
            {
              dayNumber: 10,
              date: "March 23, 2026",
              theme: "Hidden Paris & Local Life",
              activities: [
                { id: "d10a1", timePeriod: "early_morning", title: "Marche d'Aligre", description: "Authentic local food market", duration: "1.5h", type: "experience", tips: "Best on weekends", image: "/paris-montmartre-streets.jpg" },
                { id: "d10a2", timePeriod: "morning", title: "Promenade Plantee", description: "Elevated park on old railway", duration: "2h", type: "activity", tips: "Inspired NYC's High Line", image: "/paris-seine-river.jpg" },
                { id: "d10a3", timePeriod: "midday", title: "Lunch at Septime", description: "Michelin-starred seasonal French", duration: "2h", type: "restaurant", tips: "Reserve weeks in advance", image: "/paris-cafe-terrace.jpg" },
                { id: "d10a4", timePeriod: "afternoon", title: "Canal Saint-Martin", description: "Hip neighborhood with locks and bridges", duration: "2h", type: "experience", tips: "Great for photos", image: "/paris-seine-river.jpg" },
                { id: "d10a5", timePeriod: "evening", title: "Final dinner at chosen restaurant", description: "Return to your favorite spot", duration: "2.5h", type: "restaurant", tips: "Make it special - you've earned it!", image: "/paris-cafe-terrace.jpg" },
              ]
            },
            {
              dayNumber: 11,
              date: "March 24, 2026",
              theme: "Departure Day",
              activities: [
                { id: "d11a1", timePeriod: "early_morning", title: "Final Parisian breakfast", description: "Last croissant and coffee", duration: "1h", type: "cafe", tips: "Savor every bite", image: "/paris-cafe-terrace.jpg" },
                { id: "d11a2", timePeriod: "morning", title: "Pack & Checkout", description: "Collect souvenirs and memories", duration: "1.5h", type: "activity", tips: "Leave time for unexpected delays", image: "/paris-montmartre-streets.jpg" },
                { id: "d11a3", timePeriod: "morning", title: "Last minute shopping", description: "Pick up final gifts and treats", duration: "1h", type: "experience", tips: "Macarons make great gifts", image: "/paris-montmartre-streets.jpg" },
                { id: "d11a4", timePeriod: "midday", title: "Transfer to airport", description: "CDG or Orly depending on flight", duration: "1.5h", type: "transport", tips: "Allow 3 hours before international flights", image: "/paris-eiffel-tower-sunset.jpg" },
              ]
            },
          ],
          packingTips: [
            "Comfortable walking shoes - you'll walk 10+ km daily",
            "Layers for unpredictable March weather",
            "Small daypack for museum visits",
            "Universal power adapter",
            "Reusable water bottle"
          ],
          localTips: [
            "Learn basic French phrases - locals appreciate the effort",
            "Metro is the fastest way to get around",
            "Most museums are free on first Sunday of month",
            "Tipping is not expected but 5-10% is appreciated",
            "Many shops close on Sundays"
          ],
          checklist: [
            { id: "c1", category: "book", title: "Book Eiffel Tower Tickets", description: "Skip-the-line summit access - sells out weeks in advance", completed: false, link: "https://toureiffel.paris" },
            { id: "c2", category: "book", title: "Reserve Louvre Entry", description: "Timed entry ticket required", completed: false, link: "https://louvre.fr" },
            { id: "c3", category: "book", title: "Jazz Night Tickets", description: "Book your spot at Caveau de la Huchette", completed: false },
            { id: "c4", category: "book", title: "Book Accommodation", description: "Hotel, Airbnb, or hostel for 11 nights", completed: false },
            { id: "c5", category: "register", title: "Register Travel with Embassy", description: "Optional but recommended for emergencies", completed: false },
            { id: "c6", category: "register", title: "Notify Bank of Travel", description: "Prevent card blocks when abroad", completed: false },
            { id: "c7", category: "buy", title: "Paris Metro Pass", description: "10-day unlimited travel pass", completed: false },
            { id: "c8", category: "buy", title: "Travel Insurance", description: "Medical and trip cancellation coverage", completed: false },
            { id: "c9", category: "buy", title: "EU Power Adapter", description: "Type C/E/F plug adapter", completed: false },
            { id: "c10", category: "prepare", title: "Download Offline Maps", description: "Google Maps or Citymapper for Paris", completed: false },
            { id: "c11", category: "prepare", title: "Learn Basic French Phrases", description: "Bonjour, Merci, S'il vous plait", completed: false },
            { id: "c12", category: "prepare", title: "Check Passport Validity", description: "Must be valid 6 months beyond travel", completed: false },
            { id: "c13", category: "pack", title: "Comfortable Walking Shoes", description: "You'll walk 10+ km daily", completed: false },
            { id: "c14", category: "pack", title: "Layers for Weather", description: "March weather is unpredictable", completed: false },
            { id: "c15", category: "pack", title: "Small Daypack", description: "For museum visits and daily essentials", completed: false },
          ]
        }
        setItinerary(demoItinerary)
        setChecklist(demoItinerary.checklist)
      } finally {
        setIsLoading(false)
      }
    }

    generateItinerary()
  }, [])

  // Filter accommodations
  const filteredAccommodations = accommodations.filter(acc => {
    const matchesSearch = acc.name.toLowerCase().includes(accommodationSearch.toLowerCase()) ||
                          acc.location.toLowerCase().includes(accommodationSearch.toLowerCase())
    const matchesType = accommodationType === "all" || acc.type === accommodationType
    return matchesSearch && matchesType
  })

  const accommodationTypeIcons: Record<string, typeof Building> = {
    hotel: Building,
    airbnb: Home,
    hostel: BedDouble,
    boutique: Star
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="size-16 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-4">
            <Loader2 className="size-8 text-forest animate-spin" />
          </div>
          <h2 className="text-xl font-semibold mb-2">{t("myItinerary.creatingItinerary")}</h2>
          <p className="text-muted-foreground">{t("myItinerary.aiOptimizing")}</p>
        </div>
      </div>
    )
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">{t("myItinerary.somethingWentWrong")}</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Link href="/trip-basket">
            <Button>{t("myItinerary.goBackToBasket")}</Button>
          </Link>
        </div>
      </div>
    )
  }

  const currentDay = itinerary.days.find(d => d.dayNumber === activeDay) || itinerary.days[0]

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/trip-basket">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="size-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">{itinerary.title}</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="size-3" /> {t("customTrip.parisLabel")}
                  <span className="mx-1">•</span>
                  <Calendar className="size-3" /> {t("myItinerary.daysCount", { count: String(itinerary.totalDays) })}
                </p>
              </div>
            </div>
            
            <Badge variant="secondary" className="bg-forest/10 text-forest">
              <Sparkles className="size-3 me-1" />
              {t("myItinerary.aiGenerated")}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Real Data Badge */}
        <div className="flex items-center justify-center gap-2 mb-4 py-2 px-4 bg-amber-50 dark:bg-amber-950/30 rounded-full border border-amber-200 dark:border-amber-800 w-fit mx-auto">
          <Users className="size-4 text-amber-600" />
          <span className="text-sm text-amber-800 dark:text-amber-200 font-medium">
            {t("myItinerary.builtFromRealPlans")}
          </span>
        </div>

        {/* Summary Card */}
        <Card className="p-4 mb-6 bg-gradient-to-r from-forest/5 to-forest/10 border-forest/20">
          <p className="text-muted-foreground">{itinerary.summary}</p>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
            <TabsTrigger value="checklist" className="text-xs sm:text-sm py-2">
              <ClipboardCheck className="size-4 me-1 hidden sm:inline" />
              {t("myItinerary.checklist")}
            </TabsTrigger>
            <TabsTrigger value="itinerary" className="text-xs sm:text-sm py-2">
              <Calendar className="size-4 me-1 hidden sm:inline" />
              {t("myItinerary.itinerary")}
            </TabsTrigger>
            <TabsTrigger value="accommodation" className="text-xs sm:text-sm py-2">
              <Building className="size-4 me-1 hidden sm:inline" />
              {t("myItinerary.stay")}
            </TabsTrigger>
            <TabsTrigger value="tips" className="text-xs sm:text-sm py-2">
              <Info className="size-4 me-1 hidden sm:inline" />
              {t("myItinerary.tips")}
            </TabsTrigger>
          </TabsList>

          {/* Checklist Tab */}
          <TabsContent value="checklist" className="mt-6">
            <div className="space-y-6">
              {/* Progress */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{t("myItinerary.preTripChecklist")}</h3>
                  <span className="text-sm text-muted-foreground">
                    {t("myItinerary.checklistProgress", { completed: String(checklist.filter(i => i.completed).length), total: String(checklist.length) })}
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-forest h-2 rounded-full transition-all"
                    style={{ width: `${(checklist.filter(i => i.completed).length / checklist.length) * 100}%` }}
                  />
                </div>
              </Card>

              {/* Checklist by Category */}
              {(["book", "register", "buy", "prepare", "pack"] as const).map((category) => {
                const items = checklist.filter(i => i.category === category)
                if (items.length === 0) return null
                
                const CategoryIcon = checklistCategoryIcons[category]
                const colorClass = checklistCategoryColors[category]
                const categoryLabels: Record<string, string> = {
                  book: t("myItinerary.categoryBook"),
                  register: t("myItinerary.categoryRegister"),
                  buy: t("myItinerary.categoryBuy"),
                  prepare: t("myItinerary.categoryPrepare"),
                  pack: t("myItinerary.categoryPack")
                }
                
                return (
                  <Card key={category} className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`size-10 rounded-full flex items-center justify-center ${colorClass}`}>
                        <CategoryIcon className="size-5" />
                      </div>
                      <h3 className="font-semibold text-lg">{categoryLabels[category]}</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div 
                          key={item.id}
                          className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            item.completed ? "bg-green-50 dark:bg-green-950/30" : "bg-secondary/50 hover:bg-secondary"
                          }`}
                          onClick={() => toggleChecklistItem(item.id)}
                        >
                          <button className="mt-0.5 shrink-0">
                            {item.completed ? (
                              <CheckSquare className="size-5 text-green-600" />
                            ) : (
                              <Square className="size-5 text-muted-foreground" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium ${item.completed ? "line-through text-muted-foreground" : ""}`}>
                              {item.title}
                            </p>
                            <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
                          </div>
                          {item.link && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="shrink-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(item.link, "_blank")
                              }}
                            >
                              <ExternalLink className="size-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Itinerary Tab */}
          <TabsContent value="itinerary" className="mt-6">
            {/* Mobile Day Selector - Horizontal Scroll */}
            <div className="lg:hidden mb-4 -mx-4 px-4">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {itinerary.days.map((day) => (
                  <button
                    key={day.dayNumber}
                    onClick={() => setActiveDay(day.dayNumber)}
                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeDay === day.dayNumber 
                        ? "bg-forest text-white" 
                        : "bg-secondary/70 hover:bg-secondary"
                    }`}
                  >
                    {t("myItinerary.dayNumber", { number: String(day.dayNumber) })}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
              {/* Day Selector - Desktop Sidebar */}
              <div className="hidden lg:block lg:col-span-1">
                <div className="sticky top-24 space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground mb-3">{t("myItinerary.selectDay")}</h3>
                  {itinerary.days.map((day) => (
                    <button
                      key={day.dayNumber}
                      onClick={() => setActiveDay(day.dayNumber)}
                      className={`w-full text-start p-3 rounded-lg transition-colors ${
                        activeDay === day.dayNumber 
                          ? "bg-forest text-white" 
                          : "bg-secondary/50 hover:bg-secondary"
                      }`}
                    >
                      <div className="font-medium">{t("myItinerary.dayNumber", { number: String(day.dayNumber) })}</div>
                      <div className={`text-xs ${activeDay === day.dayNumber ? "text-white/80" : "text-muted-foreground"}`}>
                        {day.date}
                      </div>
                      <div className={`text-xs mt-1 truncate ${activeDay === day.dayNumber ? "text-white/70" : "text-muted-foreground"}`}>
                        {day.theme}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Day Activities - Main Content */}
              <div className="lg:col-span-3">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold">{t("myItinerary.dayNumber", { number: String(currentDay.dayNumber) })}</h2>
                      <p className="text-muted-foreground">{currentDay.date}</p>
                    </div>
                    <Badge variant="outline" className="text-forest border-forest">
                      {currentDay.theme}
                    </Badge>
                  </div>

                  {/* Timeline - Group by Time Period */}
                  <div className="space-y-6">
                    {(["early_morning", "morning", "midday", "afternoon", "evening"] as TimePeriod[]).map((period) => {
                      const periodActivities = currentDay.activities.filter(a => a.timePeriod === period)
                      if (periodActivities.length === 0) return null
                      
                      const PeriodIcon = timePeriodIcons[period]
                      
                      return (
                        <div key={period} className="space-y-3">
                          {/* Time Period Header */}
                          <div className="flex items-center gap-3 pb-2 border-b">
                            <div className="size-8 rounded-full bg-forest/10 flex items-center justify-center">
                              <PeriodIcon className="size-4 text-forest" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-forest">{timePeriodLabels[period]}</h4>
                              <p className="text-xs text-muted-foreground">{timePeriodTimes[period]}</p>
                            </div>
                          </div>
                          
                          {/* Activities in this period */}
                          <div className="space-y-4 ps-2 sm:ps-4">
                            {periodActivities.map((activity, index) => {
                              const Icon = typeIcons[activity.type] || Camera
                              const colorClass = typeColors[activity.type] || "bg-gray-100 text-gray-700"
                              const isSwapping = swappingActivity?.dayNum === currentDay.dayNumber && 
                                                 swappingActivity?.period === period && 
                                                 swappingActivity?.activityIndex === index
                              
                              return (
                                <div key={index} className="relative">
                                  <div className="flex gap-3 sm:gap-4">
                                    {/* Activity Image - Clickable */}
                                    {activity.image ? (
                                      <div className="relative size-12 sm:size-14 rounded-xl overflow-hidden shrink-0 cursor-pointer group">
                                        <Image
                                          src={activity.image || "/placeholder.svg"}
                                          alt={activity.title}
                                          fill
                                          sizes="56px"
                                          className="object-cover group-hover:scale-110 transition-transform"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                          <ImageIcon className="size-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                      </div>
                                    ) : (
                                      <div className={`size-12 sm:size-14 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                                        <Icon className="size-5 sm:size-6" />
                                      </div>
                                    )}
                                    
                                    {/* Activity Content */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2">
                                        <div className="min-w-0">
                                          <h4 className="font-semibold text-sm sm:text-base">{activity.title}</h4>
                                          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 line-clamp-2">{activity.description}</p>
                                        </div>
                                        <Badge variant="secondary" className="shrink-0 self-start text-xs">
                                          <Clock className="size-3 me-1" />
                                          {activity.duration}
                                        </Badge>
                                      </div>
                                      {activity.tips && (
                                        <div className="mt-2 flex items-start gap-2 text-xs sm:text-sm text-forest bg-forest/5 rounded-lg p-2">
                                          <Info className="size-3 sm:size-4 shrink-0 mt-0.5" />
                                          <span>{activity.tips}</span>
                                        </div>
                                      )}
                                      
                                      {/* Swap Activity Button */}
                                      {activity.alternatives && activity.alternatives.length > 0 && (
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          className="mt-2 text-xs text-muted-foreground hover:text-forest h-7 px-2"
                                          onClick={() => setSwappingActivity(
                                            isSwapping ? null : { dayNum: currentDay.dayNumber, activityIndex: index, period }
                                          )}
                                        >
                                          <Shuffle className="size-3 me-1" />
                                          {isSwapping ? t("common.cancel") : t("myItinerary.swapWithAI")}
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Alternatives Panel */}
                                  {isSwapping && activity.alternatives && (
                                    <div className="mt-3 ms-15 sm:ms-18 p-3 bg-muted/50 rounded-lg border border-dashed">
                                      <p className="text-xs font-medium text-muted-foreground mb-2">{t("myItinerary.chooseAlternative")}</p>
                                      <div className="space-y-2">
                                        {activity.alternatives.map((alt) => (
                                          <button
                                            key={alt.id}
                                            className="w-full flex items-center gap-3 p-2 rounded-lg bg-background hover:bg-forest/5 border hover:border-forest/30 transition-colors text-start"
                                            onClick={() => handleSwapActivity(currentDay.dayNumber, period, index, alt)}
                                          >
                                            {alt.image ? (
                                              <div className="relative size-10 rounded-lg overflow-hidden shrink-0">
                                                <Image src={alt.image || "/placeholder.svg"} alt={alt.title} fill sizes="40px" className="object-cover" />
                                              </div>
                                            ) : (
                                              <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                                                <Icon className="size-4" />
                                              </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                              <p className="text-sm font-medium truncate">{alt.title}</p>
                                              <p className="text-xs text-muted-foreground truncate">{alt.description}</p>
                                            </div>
                                            <Badge variant="secondary" className="shrink-0 text-xs">{alt.duration}</Badge>
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Accommodation Tab */}
          <TabsContent value="accommodation" className="mt-6">
            <div className="space-y-6">
              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder={t("myItinerary.searchAccommodation")}
                    value={accommodationSearch}
                    onChange={(e) => setAccommodationSearch(e.target.value)}
                    className="ps-10"
                  />
                </div>
                <div className="flex gap-2">
                  {(["all", "hotel", "airbnb", "hostel", "boutique"] as const).map((type) => {
                    const TypeIcon = type === "all" ? Building : accommodationTypeIcons[type]
                    return (
                      <Button
                        key={type}
                        variant={accommodationType === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAccommodationType(type)}
                        className={accommodationType === type ? "" : "bg-transparent"}
                      >
                        <TypeIcon className="size-4 me-1" />
                        {accommodationTypeLabels[type] || type}
                      </Button>
                    )
                  })}
                </div>
              </div>

              {/* AI Recommendation */}
              <Card className="p-4 bg-gradient-to-r from-forest/5 to-forest/10 border-forest/20">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="size-10 rounded-full bg-forest/10 flex items-center justify-center shrink-0">
                        <Sparkles className="size-5 text-forest" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-forest mb-1">{t("myItinerary.aiRecommendation")}</h3>
                        <p className="text-sm text-muted-foreground">
                          {t("myItinerary.aiRecommendationDesc")}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 sm:shrink-0 ms-0 sm:ms-auto">
                      <Button variant="outline" size="sm" className="bg-transparent" onClick={() => toast({ title: t("myItinerary.seePhotos"), description: "Coming soon..." })}>
                        <ImageIcon className="size-4 me-1" />
                        {t("myItinerary.seePhotos")}
                      </Button>
                      <Button variant="outline" size="sm" className="bg-transparent" onClick={() => toast({ title: t("myItinerary.otherAreas"), description: "Coming soon..." })}>
                        <RefreshCw className="size-4 me-1" />
                        {t("myItinerary.otherAreas")}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Optimization notice */}
                  <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                    <Info className="size-4 text-amber-600 shrink-0" />
                    <p className="text-xs text-amber-800 dark:text-amber-200">
                      <strong>{t("myItinerary.tipLabel")}</strong> {t("myItinerary.bookingOptimizationTip")}
                    </p>
                  </div>
                  
                  {/* Optimizing indicator */}
                  {isOptimizing && (
                    <div className="flex items-center gap-2 p-3 bg-forest/10 rounded-lg border border-forest/30">
                      <Loader2 className="size-4 text-forest animate-spin" />
                      <p className="text-sm text-forest font-medium">
                        {t("myItinerary.optimizingItinerary")}
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Accommodation Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAccommodations.map((acc) => {
                  const TypeIcon = accommodationTypeIcons[acc.type]
                  const isSelected = selectedAccommodation === acc.id
                  const isBooked = bookedAccommodations.includes(acc.id)
                  const dayLabel = acc.daysFrom === acc.daysTo 
                    ? t("myItinerary.dayNumber", { number: String(acc.daysFrom) })
                    : t("myItinerary.daysRange", { from: String(acc.daysFrom), to: String(acc.daysTo) })
                  const nightCount = acc.daysTo - acc.daysFrom + 1
                  const totalPrice = acc.price * nightCount
                  
                  return (
                    <Card 
                      key={acc.id} 
                      className={`overflow-hidden cursor-pointer transition-all ${
                        isBooked ? "ring-2 ring-green-500 bg-green-50/50 dark:bg-green-950/20" : 
                        isSelected ? "ring-2 ring-forest" : "hover:shadow-lg"
                      }`}
                      onClick={() => setSelectedAccommodation(isSelected ? null : acc.id)}
                    >
                      <div className="relative h-40">
                        <Image
                          src={acc.image || "/placeholder.svg"}
                          alt={acc.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 192px"
                          className="object-cover"
                        />
                        {/* Type badge */}
                        <Badge className="absolute top-2 start-2 bg-white/90 text-foreground">
                          <TypeIcon className="size-3 me-1" />
                          {accommodationTypeLabels[acc.type] || acc.type}
                        </Badge>
                        
                        {/* Days badge */}
                        <Badge className="absolute top-2 end-2 bg-forest text-white">
                          <Calendar className="size-3 me-1" />
                          {dayLabel}
                        </Badge>
                        
                        {/* Booked indicator */}
                        {isBooked && (
                          <div className="absolute bottom-2 start-2 flex items-center gap-1.5 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            <CheckCircle2 className="size-3" />
                            {t("myItinerary.booked")}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold truncate">{acc.name}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="size-3" />
                          {acc.location}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{acc.distance}</p>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1">
                            <Star className="size-4 text-amber-500 fill-amber-500" />
                            <span className="font-medium">{acc.rating}</span>
                            <span className="text-xs text-muted-foreground">({acc.reviews.toLocaleString()})</span>
                          </div>
                          <div className="text-end">
                            <span className="font-bold text-lg">${acc.price}</span>
                            <span className="text-xs text-muted-foreground">{t("myItinerary.perNight")}</span>
                          </div>
                        </div>
                        
                        {/* Total price for stay */}
                        <div className="mt-2 p-2 bg-muted/50 rounded-lg">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">{t("myItinerary.nightsTotal", { count: String(nightCount) })}</span>
                            <span className="font-bold text-forest">${totalPrice}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mt-3">
                          {acc.amenities.slice(0, 3).map((amenity) => (
                            <Badge key={amenity} variant="secondary" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex gap-2 mt-4">
                          <Button 
                            className="flex-1 bg-transparent" 
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(acc.bookingUrl, "_blank")
                            }}
                          >
                            <ExternalLink className="size-3 me-1" />
                            {t("myItinerary.view")}
                          </Button>
                          
                          {isBooked ? (
                            <Button 
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeBooking(acc.id)
                              }}
                            >
                              <CheckCircle2 className="size-3 me-1" />
                              {t("myItinerary.confirmed")}
                            </Button>
                          ) : (
                            <Button 
                              className="flex-1 bg-forest hover:bg-forest/90"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                confirmBooking(acc.id)
                              }}
                            >
                              <CheckCircle2 className="size-3 me-1" />
                              {t("myItinerary.iBookedThis")}
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          </TabsContent>

          {/* Tips Tab */}
          <TabsContent value="tips" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Packing Tips */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <BedDouble className="size-5 text-forest" />
                  {t("myItinerary.packingTips")}
                </h3>
                <ul className="space-y-3">
                  {itinerary.packingTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="size-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Local Tips */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <MapPin className="size-5 text-forest" />
                  {t("myItinerary.localTipsTitle", { destination: "Paris" })}
                </h3>
                <ul className="space-y-3">
                  {itinerary.localTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Info className="size-5 text-blue-500 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Support Card */}
            <Card className="p-6 mt-6 bg-green-50 dark:bg-green-950/30 border-green-200">
              <div className="flex items-start gap-4">
                <div className="size-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <Heart className="size-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-100">{t("myItinerary.withYouDuringTrip")}</h3>
                  <p className="text-green-700 dark:text-green-300 mt-1">
                    {t("myItinerary.withYouDuringTripDesc")}
                  </p>
                  <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={() => toast({ title: t("myItinerary.downloadTripToApp"), description: "Coming soon..." })}>
                    <Sparkles className="size-4 me-2" />
                    {t("myItinerary.downloadTripToApp")}
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
