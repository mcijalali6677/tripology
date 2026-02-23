/**
 * Shared TypeScript interfaces for the Tripology app.
 * These types are used both by client components and API routes.
 * NO DATA is exported from this file — only type definitions.
 */

export interface RoadmapCityActivity {
  name: string
  icon: string
  time: string
  duration: string
  cost?: number
}

export interface RoadmapCity {
  id: number
  name: string
  country: string
  startDay: number
  endDay: number
  days: number
  coordinates: { lat: number; lng: number }
  highlights: string[]
  activities: RoadmapCityActivity[]
  photos: string[]
  costs: { total: number; accommodation?: number; food?: number; activities?: number }
}

export interface RoadmapTransport {
  from: number
  to: number
  type: string
  duration: string
  cost?: number
}

export interface RoadmapData {
  totalDays: number
  cities: RoadmapCity[]
  transport: RoadmapTransport[]
}

export interface TransportOption {
  id: string
  type: "metro" | "walk" | "taxi" | "uber" | "bus" | "bike"
  duration: string
  cost?: number
  description: string
  details?: string
}

export interface ActivityAlternative {
  title: string
  description: string
  location: string
  type: "activity" | "food" | "transport" | "accommodation"
  image?: string
  cost?: number
}

export interface DayActivity {
  title: string
  description: string
  location: string
  coordinates: { lat: number; lng: number }
  type: "activity" | "food" | "transport" | "accommodation"
  image?: string
  travelerPhotos?: string[]
  cost?: number
  duration?: string
  tips?: string
  alternatives?: ActivityAlternative[]
  transportToNext?: TransportOption[]
}

export interface TripDay {
  day: number
  title: string
  description: string
  periods: {
    earlyMorning?: DayActivity[]
    morning?: DayActivity[]
    afternoon?: DayActivity[]
    evening?: DayActivity[]
    night?: DayActivity[]
  }
  recommendedAccommodations: string[]
  liveEvents?: LiveEvent[]
}

export interface ChecklistItem {
  id: string
  category: "essential" | "packing" | "documents" | "booking"
  title: string
  description?: string
  priority: "high" | "medium" | "low"
}

export interface TripChecklist {
  items: ChecklistItem[]
}

export interface LiveEvent {
  id: string
  title: string
  description: string
  location: string
  date: string
  time: string
  category: "concert" | "exhibition" | "festival" | "sport" | "theater" | "market" | "tour"
  price?: number
  image?: string
  ticketUrl?: string
  attendees?: number
}

export interface PersonalityScores {
  adventure: "high" | "medium" | "low"
  culinary: "high" | "medium" | "low"
  budget: "high" | "medium" | "low"
  relaxation: "high" | "medium" | "low"
  cultural: "high" | "medium" | "low"
  nature: "high" | "medium" | "low"
}

export interface AccommodationReview {
  userName: string
  rating: number
  date: string
  comment: string
  tripType: string
}

export interface AccommodationListing {
  id: string
  name: string
  type: "hotel" | "airbnb" | "hostel" | "boutique"
  image: string
  pricePerNight: number
  rating: number
  reviewCount: number
  neighborhood: string
  amenities: string[]
  travelerReviews: AccommodationReview[]
  lastBookedDaysAgo: number
  popularWith: string[]
}

export interface AccommodationInfo {
  totalCount: number
  hotels: number
  airbnb: number
  hostels: number
  boutique: number
  listings: AccommodationListing[]
}

export interface TravelerProfile {
  id: string
  name: string
  avatar: string
  country: string
  tripsShared: number
  rating: number
  reviewCount: number
  verified: boolean
  joinedDate: string
  travelStyle: string
}

export interface Itinerary {
  id: string
  planNumber: number
  title: string
  destination: string
  country: string
  duration: number
  budgetRange: {
    min: number
    max: number
  }
  coverImage: string
  travelStyles: string[]
  rating: number
  reviewCount: number
  highlight: string
  verified: boolean
  isPremium: boolean
  personalityScores: PersonalityScores
  aiDataSource: {
    travelersCount: number
    lastUpdated: string
  }
  accommodations: AccommodationInfo
  tripDays: TripDay[]
  checklist: TripChecklist
  level: "Budget" | "Mid-range" | "Luxury"
  suitableFor: string[]
  bestSeason: string
  difficulty: string
  planType: "raw" | "ai-optimized"
  price?: number
  traveler?: TravelerProfile
}

/** Lightweight itinerary for list views (no trip days, checklist, etc.) */
export interface ItineraryListItem {
  id: string
  planNumber: number
  title: string
  destination: string
  country: string
  duration: number
  budgetRange: { min: number; max: number }
  coverImage: string
  travelStyles: string[]
  rating: number
  reviewCount: number
  highlight: string
  verified: boolean
  isPremium: boolean
  personalityScores: PersonalityScores
  level: "Budget" | "Mid-range" | "Luxury"
  suitableFor: string[]
  bestSeason: string
  difficulty: string
  planType: "raw" | "ai-optimized"
  price?: number
  traveler?: TravelerProfile
  accommodations?: {
    totalCount: number
    hotels: number
    airbnb: number
    hostels: number
    boutique: number
  }
  aiDataSource?: {
    travelersCount: number
    lastUpdated: string
  }
}

/** Paris custom-trip activity item */
export interface ParisActivityItem {
  id: string
  title: string
  description: string
  image: string
  duration: string
  cost: number
  rating: number
  reviews: number
  popular: boolean
  tags: string[]
  officialSite?: string
  address?: string
  cuisine?: string
  priceRange?: string
  specialty?: string
  style?: string
  eventType?: string
  nextDate?: string
  venue?: string
  routeType?: string
  frequency?: string
  themeType?: string
  season?: string
}

/** Paris activity category */
export interface ParisCategory {
  title: string
  icon: string
  color: string
  description: string
  items: ParisActivityItem[]
}

/** Paris custom-trip data structure */
export interface ParisData {
  categories: Record<string, ParisCategory>
}
