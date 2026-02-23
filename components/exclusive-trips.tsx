"use client"

import React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Crown, 
  Star, 
  Shield, 
  Users, 
  MessageCircle, 
  Plane,
  MapPin,
  Calendar,
  Wallet,
  ChevronRight,
  CheckCircle,
  Sparkles
} from "lucide-react"

import { useI18n } from "@/lib/i18n/context"
import { formatPrice } from "@/lib/utils"

const exclusiveDestinations = [
  {
    id: "iran",
    name: "Iran",
    nameLocal: "ایران",
    tagline: "Ancient Persia Awaits",
    description: "5,000 years of history, stunning architecture, and warm hospitality.",
    image: "/iran-isfahan.jpg",
    highlights: ["Isfahan's stunning mosques", "Persepolis ancient ruins", "Shiraz gardens", "Tehran modern culture", "Desert adventures"],
    startingPrice: 1200,
    duration: "7-14 days",
    bestTime: "Mar-May, Sep-Nov",
    featured: true,
  },
  {
    id: "morocco",
    name: "Morocco",
    nameLocal: "المغرب",
    tagline: "Colors of the Maghreb",
    description: "Marrakech medinas to Sahara dunes, the magic of North Africa.",
    image: "/morocco-marrakech.jpg",
    highlights: ["Marrakech medina", "Sahara desert camp", "Fes tanneries", "Atlas Mountains", "Coastal Essaouira"],
    startingPrice: 900,
    duration: "5-12 days",
    bestTime: "Mar-May, Sep-Nov",
    featured: false,
  },
  {
    id: "uzbekistan",
    name: "Uzbekistan",
    nameLocal: "O'zbekiston",
    tagline: "Silk Road Treasures",
    description: "Silk Road through Samarkand, Bukhara, and Khiva - cities frozen in time.",
    image: "/uzbekistan-samarkand.jpg",
    highlights: ["Samarkand Registan", "Bukhara old town", "Khiva walled city", "Silk Road history", "Traditional crafts"],
    startingPrice: 800,
    duration: "7-10 days",
    bestTime: "Apr-Jun, Sep-Oct",
    featured: false,
  },
  {
    id: "jordan",
    name: "Jordan",
    nameLocal: "الأردن",
    tagline: "Kingdom of Wonders",
    description: "Petra's rose-red city to Wadi Rum's Martian landscapes.",
    image: "/jordan-petra.jpg",
    highlights: ["Petra ancient city", "Wadi Rum desert", "Dead Sea floating", "Amman citadel", "Jerash Roman ruins"],
    startingPrice: 1000,
    duration: "5-10 days",
    bestTime: "Mar-May, Sep-Nov",
    featured: false,
  },
]

export function ExclusiveTrips() {
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const { t, locale } = useI18n()
  
  const featuredDestination = exclusiveDestinations.find(d => d.featured)
  const otherDestinations = exclusiveDestinations.filter(d => !d.featured)

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30">
            <Crown className="size-3 me-1" />
            {t("exclusiveTrips.badge")}
          </Badge>
          <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl mb-2">
            {t("exclusiveTrips.title")} <span className="text-amber-400">{t("exclusiveTrips.titleHighlight")}</span> {t("exclusiveTrips.titleEnd")}
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            {t("exclusiveTrips.subtitle")}
          </p>
        </div>

        {/* What's Included */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Users, label: t("exclusiveTrips.feature1"), desc: t("exclusiveTrips.feature1Desc") },
            { icon: Star, label: t("exclusiveTrips.feature2"), desc: t("exclusiveTrips.feature2Desc") },
            { icon: Shield, label: t("exclusiveTrips.feature3"), desc: t("exclusiveTrips.feature3Desc") },
            { icon: Wallet, label: t("exclusiveTrips.feature4"), desc: t("exclusiveTrips.feature4Desc") },
          ].map((item) => (
            <div key={item.label} className="text-center p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <item.icon className="size-6 text-amber-400 mx-auto mb-2" />
              <p className="font-medium text-white text-sm">{item.label}</p>
              <p className="text-xs text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Featured Destination - Iran */}
        {featuredDestination && (
          <div className="mb-8">
            <Link href="/destinations/iran">
              <Card className="overflow-hidden bg-gradient-to-r from-slate-800 to-slate-800/50 border-amber-500/30 hover:border-amber-500 transition-colors cursor-pointer group">
                <div className="grid md:grid-cols-2">
                  <div className="relative h-64 md:h-auto">
                    <Image
                      src={featuredDestination.image || "/placeholder.svg"}
                      alt={featuredDestination.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-800/80 md:hidden" />
                    <Badge className="absolute top-4 start-4 bg-amber-500 text-white border-0">
                      <Star className="size-3 me-1 fill-current" />
                      {t("exclusiveTrips.featured")}
                    </Badge>
                  </div>
                  <CardContent className="p-6 md:p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-serif text-2xl md:text-3xl font-bold text-white group-hover:text-amber-400 transition-colors">
                        {featuredDestination.name}
                      </h3>
                      <span className="text-xl text-amber-400 font-medium font-arabic">{featuredDestination.nameLocal}</span>
                    </div>
                    <p className="text-amber-400 font-medium mb-3">{featuredDestination.tagline}</p>
                    <p className="text-slate-300 mb-4">{featuredDestination.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {featuredDestination.highlights.slice(0, 4).map((h) => (
                        <Badge key={h} variant="secondary" className="bg-slate-700 text-slate-200 text-xs">
                          {h}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-6">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-4" />
                        {featuredDestination.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Wallet className="size-4" />
                        {locale === "fa" ? `از ${featuredDestination.startingPrice.toLocaleString("fa-IR")} تومان` : `From $${featuredDestination.startingPrice}`}
                      </span>
                      <span className="flex items-center gap-1">
                        <Sparkles className="size-4" />
                        {featuredDestination.bestTime}
                      </span>
                    </div>
                    
                    <Button 
                      size="lg" 
                      className="bg-amber-500 hover:bg-amber-600 text-white w-full sm:w-auto"
                    >
                      <MessageCircle className="size-4 me-2" />
                      {t("exclusiveTrips.exploreTrips")}
                      <ChevronRight className="size-4 ms-1" />
                    </Button>
                  </CardContent>
                </div>
              </Card>
            </Link>
          </div>
        )}

        {/* Other Destinations Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherDestinations.map((destination) => (
            <Card key={destination.id} className="overflow-hidden bg-slate-800/50 border-slate-700 hover:border-amber-500/50 transition-colors group">
              <div className="relative h-40">
                <Image
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                <div className="absolute bottom-3 start-3">
                  <h3 className="font-serif text-xl font-bold text-white">{destination.name}</h3>
                  <p className="text-amber-400 text-sm">{destination.tagline}</p>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-slate-400 text-sm mb-3 line-clamp-2">{destination.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span>{destination.duration}</span>
                  <span>{locale === "fa" ? `از ${destination.startingPrice.toLocaleString("fa-IR")} تومان` : `From $${destination.startingPrice}`}</span>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full bg-transparent border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white"
                      onClick={() => setSelectedDestination(destination.id)}
                    >
                      {t("exclusiveTrips.requestCustomTour")}
                      <ChevronRight className="size-4 ms-1" />
                    </Button>
                  </DialogTrigger>
                  <TripRequestDialog 
                    destination={destination} 
                    formSubmitted={formSubmitted}
                    setFormSubmitted={setFormSubmitted}
                  />
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Note */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            {t("exclusiveTrips.contactNote")} <button className="text-amber-400 hover:text-amber-300 underline">{t("exclusiveTrips.contactUs")}</button>
          </p>
        </div>
      </div>
    </section>
  )
}

// Trip Request Dialog Component
function TripRequestDialog({ 
  destination, 
  formSubmitted, 
  setFormSubmitted 
}: { 
  destination: typeof exclusiveDestinations[0]
  formSubmitted: boolean
  setFormSubmitted: (v: boolean) => void
}) {
  const { t } = useI18n()
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
  }

  if (formSubmitted) {
    return (
      <DialogContent className="sm:max-w-md">
        <div className="text-center py-6">
          <div className="size-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="size-8 text-green-600" />
          </div>
          <DialogTitle className="text-xl mb-2">{t("exclusiveTrips.requestReceived")}</DialogTitle>
          <DialogDescription className="mb-4">
            {t("exclusiveTrips.requestReceivedDesc", { destination: destination.name })}
          </DialogDescription>
          <Button onClick={() => setFormSubmitted(false)} variant="outline" className="bg-transparent">
            {t("common.close")}
          </Button>
        </div>
      </DialogContent>
    )
  }

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Plane className="size-5 text-amber-500" />
          {t("exclusiveTrips.planYourTrip", { destination: destination.name })}
        </DialogTitle>
        <DialogDescription>
          {t("exclusiveTrips.planYourTripDesc")}
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("exclusiveTrips.yourName")}</Label>
            <Input id="name" placeholder="John Doe" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t("exclusiveTrips.email")}</Label>
            <Input id="email" type="email" placeholder="john@example.com" required />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="travelers">{t("exclusiveTrips.numberOfTravelers")}</Label>
            <Select defaultValue="2">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 person</SelectItem>
                <SelectItem value="2">2 people</SelectItem>
                <SelectItem value="3-4">3-4 people</SelectItem>
                <SelectItem value="5+">5+ people</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget">{t("exclusiveTrips.budgetRange")}</Label>
            <Select defaultValue="mid">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="budget">Budget ($800-1500)</SelectItem>
                <SelectItem value="mid">Mid-range ($1500-3000)</SelectItem>
                <SelectItem value="luxury">Luxury ($3000+)</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="duration">{t("exclusiveTrips.tripDuration")}</Label>
            <Select defaultValue="7-10">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5-7">5-7 days</SelectItem>
                <SelectItem value="7-10">7-10 days</SelectItem>
                <SelectItem value="10-14">10-14 days</SelectItem>
                <SelectItem value="14+">14+ days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="when">{t("exclusiveTrips.whenTravel")}</Label>
            <Input id="when" type="month" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="interests">{t("exclusiveTrips.interests")}</Label>
          <Textarea 
            id="interests" 
            placeholder="Travel style, must-see places, special requests..."
            rows={3}
          />
        </div>
        
        <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600">
          <MessageCircle className="size-4 me-2" />
          {t("exclusiveTrips.sendRequest")}
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          {t("exclusiveTrips.responseNote")}
        </p>
      </form>
    </DialogContent>
  )
}
