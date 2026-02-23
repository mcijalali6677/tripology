"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Heart,
  Star,
  Settings,
  Bell,
  Shield,
  Crown,
  Sparkles,
  Globe,
  Compass,
  Camera,
  Award,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  ChevronRight,
  Edit,
  CheckCircle2,
  Map,
  Plane,
  Hotel,
  UtensilsCrossed,
  Mountain,
  Palmtree,
  Building,
  Coffee,
  Music,
  Book
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useI18n } from "@/lib/i18n/context"

// Mock user data based on their activity
const userData = {
  name: "Alex Thompson",
  email: "alex@example.com",
  avatar: "/paris-cafe-terrace.jpg",
  joinedDate: "March 2024",
  isPremium: false,
  location: "Vancouver, Canada",
  
  // Travel personality (calculated from quiz, searches, saved items)
  travelPersonality: {
    type: "Cultural Explorer",
    description: "You love immersing yourself in local culture, history, and authentic experiences.",
    traits: ["History Lover", "Foodie", "Art Enthusiast", "Budget-Savvy"],
    scores: {
      adventure: 65,
      cultural: 90,
      relaxation: 45,
      culinary: 85,
      budget: 70,
      nature: 55
    }
  },
  
  // Statistics
  stats: {
    savedItineraries: 12,
    purchasedPlans: 3,
    countriesInterested: 8,
    quizzesTaken: 2,
    reviewsWritten: 5
  },
  
  // Saved/Wishlist destinations
  wishlist: [
    { id: "1", destination: "Paris", country: "France", image: "/paris-eiffel-tower-sunset.jpg", savedDate: "2 days ago" },
    { id: "2", destination: "Tokyo", country: "Japan", image: "/paris-montmartre-streets.jpg", savedDate: "1 week ago" },
    { id: "3", destination: "Barcelona", country: "Spain", image: "/paris-seine-river.jpg", savedDate: "2 weeks ago" },
  ],
  
  // Purchased plans
  purchasedPlans: [
    { id: "raw-3", title: "Honeymoon in Paris", traveler: "Emma & James", price: 89, purchaseDate: "Jan 15, 2026" },
    { id: "1", title: "Paris Adventure", type: "AI-Optimized", purchaseDate: "Dec 20, 2025" },
  ],
  
  // Upcoming/Active trips
  activeTrips: [
    { 
      id: "trip-1", 
      destination: "Paris", 
      dates: "Feb 10 - Feb 18, 2026", 
      status: "upcoming",
      daysUntil: 15,
      planId: "raw-3"
    }
  ],
  
  // Recommended based on preferences
  recommendations: [
    { destination: "Rome", reason: "Based on your love for history & culture", match: 94 },
    { destination: "Lisbon", reason: "Great for budget-conscious foodies", match: 89 },
    { destination: "Kyoto", reason: "Perfect blend of culture & nature", match: 87 },
  ],
  
  // Preferences
  preferences: {
    budgetRange: "$100-200/day",
    tripLength: "7-10 days",
    travelStyle: "Couple",
    interests: ["Museums", "Local Food", "Walking Tours", "Photography", "Cafes"],
    avoidances: ["Crowded Tourist Spots", "Long Bus Tours"]
  }
}

export default function ProfilePage() {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState("overview")
  const { user, isAuthenticated, logout } = useAuth()
  
  // Merge real user data with mock data when authenticated
  const displayUser = isAuthenticated && user ? {
    ...userData,
    name: user.full_name || user.username || userData.name,
    email: user.email || userData.email,
    avatar: user.avatar_url || userData.avatar,
    location: user.country || userData.location,
    travelPersonality: user.personality_scores ? {
      ...userData.travelPersonality,
      scores: {
        adventure: user.personality_scores.adventure === "high" ? 90 : user.personality_scores.adventure === "medium" ? 60 : 30,
        cultural: user.personality_scores.cultural === "high" ? 90 : user.personality_scores.cultural === "medium" ? 60 : 30,
        relaxation: user.personality_scores.relaxation === "high" ? 90 : user.personality_scores.relaxation === "medium" ? 60 : 30,
        culinary: user.personality_scores.culinary === "high" ? 90 : user.personality_scores.culinary === "medium" ? 60 : 30,
        budget: user.personality_scores.budget === "high" ? 90 : user.personality_scores.budget === "medium" ? 60 : 30,
        nature: user.personality_scores.nature === "high" ? 90 : user.personality_scores.nature === "medium" ? 60 : 30,
      }
    } : userData.travelPersonality,
  } : userData
  
  return (
    <div className="min-h-screen bg-background pb-24">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="size-4" />
          <span>{t("profile.backToExplore")}</span>
        </Link>
        
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          <div className="relative">
            <div className="size-24 sm:size-32 rounded-full overflow-hidden border-4 border-background shadow-lg">
              <Image src={displayUser.avatar || "/placeholder.svg"} alt={displayUser.name} fill sizes="(max-width: 640px) 96px, 128px" className="object-cover" />
            </div>
            <Button size="icon" variant="secondary" className="absolute bottom-0 end-0 size-8 rounded-full">
              <Edit className="size-4" />
            </Button>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{displayUser.name}</h1>
                <p className="text-muted-foreground flex items-center gap-1.5 mt-1">
                  <MapPin className="size-4" />
                  {displayUser.location}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{t("profile.memberSince")} {displayUser.joinedDate}</p>
              </div>
              
              <div className="flex gap-2">
                {userData.isPremium ? (
                  <Badge className="bg-amber-500 text-white">
                    <Crown className="size-3 me-1" />
                    Premium
                  </Badge>
                ) : (
                  <Button size="sm" className="bg-amber-500 hover:bg-amber-600" onClick={() => toast({ title: "Premium", description: "Coming soon..." })}>
                    <Crown className="size-4 me-1" />
                    Upgrade to Premium
                  </Button>
                )}
                <Button size="icon" variant="outline" className="bg-transparent" onClick={() => toast({ title: "Settings", description: "Coming soon..." })}>
                  <Settings className="size-4" />
                </Button>
              </div>
            </div>
            
            {/* Travel Personality Badge */}
            <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-forest/10 to-emerald-100/50 dark:from-forest/20 dark:to-emerald-900/20 border border-forest/20">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-forest/20 flex items-center justify-center">
                  <Compass className="size-5 text-forest" />
                </div>
                <div>
                  <p className="font-semibold text-forest">{userData.travelPersonality.type}</p>
                  <p className="text-xs text-muted-foreground">{userData.travelPersonality.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          <Card className="p-4 text-center">
            <Heart className="size-5 mx-auto text-rose-500 mb-1" />
            <p className="text-2xl font-bold">{userData.stats.savedItineraries}</p>
            <p className="text-xs text-muted-foreground">Saved</p>
          </Card>
          <Card className="p-4 text-center">
            <DollarSign className="size-5 mx-auto text-emerald-500 mb-1" />
            <p className="text-2xl font-bold">{userData.stats.purchasedPlans}</p>
            <p className="text-xs text-muted-foreground">Purchased</p>
          </Card>
          <Card className="p-4 text-center">
            <Globe className="size-5 mx-auto text-blue-500 mb-1" />
            <p className="text-2xl font-bold">{userData.stats.countriesInterested}</p>
            <p className="text-xs text-muted-foreground">Countries</p>
          </Card>
          <Card className="p-4 text-center">
            <Star className="size-5 mx-auto text-amber-500 mb-1" />
            <p className="text-2xl font-bold">{userData.stats.reviewsWritten}</p>
            <p className="text-xs text-muted-foreground">Reviews</p>
          </Card>
          <Card className="p-4 text-center col-span-2 sm:col-span-1">
            <Award className="size-5 mx-auto text-violet-500 mb-1" />
            <p className="text-2xl font-bold">{userData.stats.quizzesTaken}</p>
            <p className="text-xs text-muted-foreground">Quizzes</p>
          </Card>
        </div>
        
        {/* Active Trip Banner */}
        {userData.activeTrips.length > 0 && (
          <Card className="mb-8 p-4 bg-gradient-to-r from-forest/10 via-forest/5 to-emerald-50 dark:from-forest/20 dark:to-emerald-950/30 border-forest/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-forest flex items-center justify-center">
                  <Plane className="size-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-forest font-medium">{t("profile.upcomingTrip")}</p>
                  <p className="text-lg font-bold">{userData.activeTrips[0].destination}</p>
                  <p className="text-sm text-muted-foreground">{userData.activeTrips[0].dates}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-forest/10 text-forest">
                  {userData.activeTrips[0].daysUntil} days to go
                </Badge>
                <Link href={`/trip-companion?trip=${userData.activeTrips[0].id}`}>
                  <Button className="bg-forest hover:bg-forest/90">
                    <Sparkles className="size-4 me-2" />
                    Trip Companion
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">{t("profile.overview")}</TabsTrigger>
            <TabsTrigger value="saved">{t("profile.saved")}</TabsTrigger>
            <TabsTrigger value="purchases">{t("profile.purchases")}</TabsTrigger>
            <TabsTrigger value="preferences">{t("profile.preferences")}</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Travel Personality Breakdown */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="size-5 text-forest" />
                {t("profile.travelPersonality")}
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {userData.travelPersonality.traits.map(trait => (
                  <Badge key={trait} variant="secondary">{trait}</Badge>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {Object.entries(userData.travelPersonality.scores).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{key}</span>
                      <span className="font-medium">{value}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>
            
            {/* AI Recommendations */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="size-5 text-forest" />
                {t("profile.recommended")}
              </h3>
              <div className="space-y-3">
                {userData.recommendations.map((rec, idx) => (
                  <Link 
                    key={idx} 
                    href={`/?destination=${rec.destination}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-forest/10 flex items-center justify-center">
                        <MapPin className="size-5 text-forest" />
                      </div>
                      <div>
                        <p className="font-medium">{rec.destination}</p>
                        <p className="text-xs text-muted-foreground">{rec.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-100 text-emerald-700">{rec.match}% match</Badge>
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          </TabsContent>
          
          {/* Saved Tab */}
          <TabsContent value="saved" className="space-y-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {userData.wishlist.map(item => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="relative h-32">
                    <Image src={item.image || "/placeholder.svg"} alt={item.destination} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
                    <Button size="icon" variant="ghost" className="absolute top-2 end-2 bg-white/80 hover:bg-white">
                      <Heart className="size-4 fill-rose-500 text-rose-500" />
                    </Button>
                  </div>
                  <div className="p-3">
                    <h4 className="font-semibold">{item.destination}</h4>
                    <p className="text-sm text-muted-foreground">{item.country}</p>
                    <p className="text-xs text-muted-foreground mt-1">Saved {item.savedDate}</p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Purchases Tab */}
          <TabsContent value="purchases" className="space-y-4">
            {userData.purchasedPlans.map(plan => (
              <Card key={plan.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-forest/10 flex items-center justify-center">
                      <Map className="size-5 text-forest" />
                    </div>
                    <div>
                      <p className="font-medium">{plan.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {plan.traveler ? `By ${plan.traveler}` : plan.type} - Purchased {plan.purchaseDate}
                      </p>
                    </div>
                  </div>
                  <Link href={`/itinerary/${plan.id}`}>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      {t("profile.viewPlan")}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </TabsContent>
          
          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">{t("profile.travelPreferences")}</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Budget Range</p>
                  <p className="font-medium flex items-center gap-2">
                    <DollarSign className="size-4 text-forest" />
                    {userData.preferences.budgetRange}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Preferred Trip Length</p>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="size-4 text-forest" />
                    {userData.preferences.tripLength}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Travel Style</p>
                  <p className="font-medium flex items-center gap-2">
                    <Users className="size-4 text-forest" />
                    {userData.preferences.travelStyle}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {userData.preferences.interests.map(interest => (
                  <Badge key={interest} variant="secondary" className="py-1.5 px-3">
                    {interest}
                  </Badge>
                ))}
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Things to Avoid</h3>
              <div className="flex flex-wrap gap-2">
                {userData.preferences.avoidances.map(item => (
                  <Badge key={item} variant="outline" className="py-1.5 px-3 bg-transparent">
                    {item}
                  </Badge>
                ))}
              </div>
            </Card>
            
            <Button variant="outline" className="w-full bg-transparent" onClick={() => toast({ title: t("profile.editPreferences"), description: "Coming soon..." })}>
              <Edit className="size-4 me-2" />
              {t("profile.editPreferences")}
            </Button>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
