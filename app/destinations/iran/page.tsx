"use client"

import React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  ArrowLeft, Star, MapPin, Calendar, Clock, Users, 
  Check, ChevronRight, Plane, Hotel, Car, Camera,
  Utensils, Shield, MessageCircle, Heart, Share2,
  Sun, Thermometer, DollarSign, Globe, Phone, Mail
} from "lucide-react"

// Iran Cities Data
const iranCities = [
  {
    id: "isfahan",
    name: "Isfahan",
    persianName: "اصفهان",
    tagline: "Half of the World",
    description: "Known as 'Nesf-e Jahan' (Half of the World), Isfahan is home to some of the most stunning Islamic architecture on Earth. The magnificent Imam Square, mesmerizing blue-tiled mosques, and historic bridges over the Zayandeh River create an unforgettable experience.",
    image: "/iran-isfahan.jpg",
    highlights: ["Imam Square (UNESCO)", "Sheikh Lotfollah Mosque", "Si-o-se-pol Bridge", "Armenian Quarter", "Traditional Bazaar"],
    bestFor: ["Architecture lovers", "Photography", "History buffs"],
    days: "3-4 days recommended",
  },
  {
    id: "shiraz",
    name: "Shiraz",
    persianName: "شیراز",
    tagline: "City of Poetry & Gardens",
    description: "The cultural heart of Iran, Shiraz is famous for its literary history as home to poets Hafez and Saadi. The stunning Pink Mosque, Persian gardens, and nearby Persepolis ruins make it essential for any Iran itinerary.",
    image: "/iran-shiraz.jpg",
    highlights: ["Nasir al-Mulk (Pink Mosque)", "Persepolis", "Hafez Tomb", "Eram Garden", "Vakil Bazaar"],
    bestFor: ["Culture seekers", "Literature fans", "Garden lovers"],
    days: "3-4 days recommended",
  },
  {
    id: "yazd",
    name: "Yazd",
    persianName: "یزد",
    tagline: "Ancient Desert Gem",
    description: "One of the oldest continuously inhabited cities in the world, Yazd is a UNESCO World Heritage site famous for its unique desert architecture, windcatchers, and Zoroastrian heritage.",
    image: "/iran-yazd.jpg",
    highlights: ["Old Town (UNESCO)", "Zoroastrian Fire Temple", "Tower of Silence", "Windcatcher houses", "Desert tours"],
    bestFor: ["Adventure seekers", "Architecture", "Unique experiences"],
    days: "2-3 days recommended",
  },
  {
    id: "tehran",
    name: "Tehran",
    persianName: "تهران",
    tagline: "Modern Meets Ancient",
    description: "Iran's vibrant capital offers world-class museums, bustling bazaars, and a dynamic food scene. From the opulent Golestan Palace to the contemporary art galleries, Tehran bridges Iran's past and present.",
    image: "/iran-tehran.jpg",
    highlights: ["Golestan Palace", "National Museum", "Grand Bazaar", "Darband hiking", "Art galleries"],
    bestFor: ["City explorers", "Food lovers", "Museum fans"],
    days: "2-3 days recommended",
  },
]

// Tour Packages
const tourPackages = [
  {
    id: "essential",
    name: "Essential Iran",
    duration: "10 Days",
    cities: ["Tehran", "Isfahan", "Shiraz"],
    price: { budget: 1200, mid: 2400, luxury: 4500 },
    highlights: [
      "Tehran city tour & museums",
      "Isfahan's iconic squares & mosques", 
      "Shiraz gardens & Persepolis",
      "Domestic flights included",
      "English-speaking guide",
    ],
    bestFor: "First-time visitors",
    popular: true,
  },
  {
    id: "complete",
    name: "Complete Persia",
    duration: "14 Days",
    cities: ["Tehran", "Kashan", "Isfahan", "Yazd", "Shiraz"],
    price: { budget: 1800, mid: 3500, luxury: 6500 },
    highlights: [
      "All major cities covered",
      "Desert experience in Yazd",
      "Traditional house stays",
      "Cooking class included",
      "All transport & flights",
    ],
    bestFor: "Comprehensive experience",
    popular: false,
  },
  {
    id: "culture",
    name: "Cultural Deep Dive",
    duration: "12 Days",
    cities: ["Tehran", "Isfahan", "Yazd", "Kerman"],
    price: { budget: 1500, mid: 3000, luxury: 5500 },
    highlights: [
      "Off-the-beaten-path sites",
      "Local family visits",
      "Traditional crafts workshops",
      "Desert camping option",
      "Expert cultural guide",
    ],
    bestFor: "Culture enthusiasts",
    popular: false,
  },
  {
    id: "adventure",
    name: "Iran Adventure",
    duration: "16 Days",
    cities: ["Tehran", "Tabriz", "Isfahan", "Yazd", "Shiraz", "Persian Gulf"],
    price: { budget: 2200, mid: 4200, luxury: 7500 },
    highlights: [
      "Northwest mountains & bazaars",
      "Desert trekking",
      "Island hopping in Persian Gulf",
      "Nomad encounters",
      "Adventure activities",
    ],
    bestFor: "Active travelers",
    popular: false,
  },
]

// What's Included
const inclusions = [
  { icon: Hotel, title: "Premium Hotels", desc: "Hand-picked 4-5 star hotels or boutique traditional houses" },
  { icon: Car, title: "Private Transport", desc: "Air-conditioned vehicle with professional driver" },
  { icon: Users, title: "Expert Guides", desc: "Licensed English-speaking local guides" },
  { icon: Plane, title: "Domestic Flights", desc: "Internal flights for longer distances" },
  { icon: Utensils, title: "Authentic Meals", desc: "Daily breakfast + selected lunches & dinners" },
  { icon: Camera, title: "Unique Experiences", desc: "Cooking classes, craft workshops, local visits" },
]

// FAQ
const faqs = [
  {
    q: "Is Iran safe to visit?",
    a: "Yes, Iran is very safe for tourists. Iranians are known for their legendary hospitality. Petty crime is rare, and violent crime against tourists is virtually unheard of. Our local team ensures your comfort and safety throughout."
  },
  {
    q: "What about visa requirements?",
    a: "Most nationalities can obtain a visa on arrival or e-visa. We provide full visa support including invitation letters. Some nationalities (US, UK, Canada) require a licensed guide, which is included in all our packages."
  },
  {
    q: "What should I wear?",
    a: "Women should wear loose-fitting clothing and a headscarf (can be loose). Men should avoid shorts in public. We provide detailed packing guides. Don't worry - it's much more relaxed than you might expect!"
  },
  {
    q: "Can I use credit cards?",
    a: "International cards don't work in Iran due to sanctions. We provide a pre-loaded local card and help with currency exchange. Cash (EUR/USD) is easily exchanged at excellent rates."
  },
  {
    q: "What's the best time to visit?",
    a: "Spring (March-May) and autumn (September-November) offer perfect weather. Nowruz (Persian New Year, late March) is magical but busy. Summer can be hot, winter mild in the south."
  },
]

export default function IranPage() {
  const { t } = useI18n()
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [showContactForm, setShowContactForm] = useState(false)
  const [budgetLevel, setBudgetLevel] = useState<"budget" | "mid" | "luxury">("mid")
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px]">
        <Image
          src="/iran-isfahan.jpg"
          alt="Isfahan, Iran - Imam Square"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        
        {/* Navigation */}
        <div className="absolute top-0 start-0 end-0 z-20">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="size-4" />
              <span className="text-sm">{t("iran.hero.backToTripology")}</span>
            </Link>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-white max-w-4xl px-4">
            <Badge className="mb-4 bg-amber-500/90 hover:bg-amber-500 text-white border-0">
              {t("iran.hero.badge")}
            </Badge>
            <p className="text-amber-300 font-arabic text-2xl mb-2">ایران</p>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance">
              {t("iran.hero.title")}
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">
              {t("iran.hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-amber-500 hover:bg-amber-600 text-white"
                onClick={() => setShowContactForm(true)}
              >
                <MessageCircle className="size-4 me-2" />
                {t("iran.hero.exploreTours")}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent border-white/50 text-white hover:bg-white/10"
                asChild
              >
                <a href="#packages">
                  {t("iran.packages.title")}
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="absolute bottom-0 start-0 end-0 bg-black/60 backdrop-blur-sm border-t border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-wrap justify-center gap-8 text-white text-center">
              <div>
                <p className="text-2xl font-bold text-amber-400">24</p>
                <p className="text-xs text-white/70">UNESCO Sites</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-400">7,000+</p>
                <p className="text-xs text-white/70">Years of History</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-400">4.9</p>
                <p className="text-xs text-white/70">Traveler Rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-400">100%</p>
                <p className="text-xs text-white/70">Customizable</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Iran Section */}
      <section className="py-16 bg-amber-50/50 dark:bg-amber-950/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
              {t("iran.whyManaged.title")}
            </h2>
            <p className="text-muted-foreground text-lg">
              Iran offers what few destinations can: authentic experiences untouched by mass tourism, 
              legendary hospitality, and some of the world's most spectacular architecture and landscapes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Globe, title: "Untouched by Mass Tourism", desc: "Experience genuine culture and hospitality without the crowds found at other world heritage destinations." },
              { icon: Heart, title: "Legendary Hospitality", desc: "Iranians are famous for their warmth. Expect to be invited for tea, offered help, and treated like honored guests." },
              { icon: DollarSign, title: "Incredible Value", desc: "Your money goes further in Iran. Enjoy luxury experiences, fine dining, and premium hotels at a fraction of typical costs." },
            ].map((item, idx) => (
              <Card key={idx} className="border-amber-200 dark:border-amber-900">
                <CardContent className="p-6 text-center">
                  <div className="size-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="size-6 text-amber-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section className="py-16" id="cities">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
              {t("iran.cities.title")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each city offers a unique window into Persian culture, from the architectural wonders of Isfahan 
              to the ancient desert charm of Yazd.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {iranCities.map((city) => (
              <Card key={city.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0">
                    <Image
                      src={city.image || "/placeholder.svg"}
                      alt={city.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 192px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/60 to-transparent" />
                    <div className="absolute bottom-3 start-3 sm:bottom-auto sm:top-3 text-white">
                      <p className="text-amber-300 text-sm font-arabic">{city.persianName}</p>
                      <h3 className="font-serif text-2xl font-bold">{city.name}</h3>
                    </div>
                  </div>
                  <CardContent className="p-5 flex-1">
                    <p className="text-amber-600 dark:text-amber-400 text-sm font-medium mb-2">{city.tagline}</p>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{city.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1.5">Highlights</p>
                        <div className="flex flex-wrap gap-1.5">
                          {city.highlights.slice(0, 3).map((h, i) => (
                            <Badge key={i} variant="secondary" className="text-[10px]">{h}</Badge>
                          ))}
                          {city.highlights.length > 3 && (
                            <Badge variant="outline" className="text-[10px]">+{city.highlights.length - 3} more</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="size-3" />
                          {city.days}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 p-0 h-auto"
                          onClick={() => setShowContactForm(true)}
                        >
                          Include in my trip
                          <ChevronRight className="size-4 ms-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tour Packages Section */}
      <section className="py-16 bg-slate-900 text-white" id="packages">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30">
              Curated Packages
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
              {t("iran.packages.title")}
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-6">
              Choose from our carefully designed itineraries or let us create a completely custom journey for you.
            </p>
            
            {/* Budget Toggle */}
            <div className="flex justify-center gap-2 mb-8">
              {[
                { value: "budget", label: "Budget", desc: "Comfortable" },
                { value: "mid", label: "Mid-Range", desc: "Recommended" },
                { value: "luxury", label: "Luxury", desc: "Premium" },
              ].map((level) => (
                <Button
                  key={level.value}
                  variant={budgetLevel === level.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBudgetLevel(level.value as typeof budgetLevel)}
                  className={budgetLevel === level.value 
                    ? "bg-amber-500 hover:bg-amber-600" 
                    : "bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800"
                  }
                >
                  {level.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
            {tourPackages.map((pkg) => (
              <Card 
                key={pkg.id} 
                className={`bg-slate-800 border-slate-700 relative overflow-hidden ${
                  pkg.popular ? "ring-2 ring-amber-500" : ""
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 end-0 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5">
                    {t("common.popular")}
                  </div>
                )}
                <CardContent className="p-5">
                  <div className="mb-4">
                    <h3 className="font-serif text-xl font-bold text-white mb-1">{pkg.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Calendar className="size-3.5" />
                      {pkg.duration}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {pkg.cities.map((city, i) => (
                      <Badge key={i} variant="outline" className="text-[10px] border-slate-600 text-slate-300">
                        {city}
                      </Badge>
                    ))}
                  </div>
                  
                  <ul className="space-y-2 mb-4">
                    {pkg.highlights.map((h, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <Check className="size-3.5 text-amber-500 shrink-0 mt-0.5" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="pt-4 border-t border-slate-700">
                    <p className="text-[10px] text-slate-500 mb-1">{t("iran.packages.startingFrom")}</p>
                    <p className="text-2xl font-bold text-amber-400">
                      ${pkg.price[budgetLevel].toLocaleString()}
                      <span className="text-sm font-normal text-slate-400 ms-1">/ person</span>
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">Best for: {pkg.bestFor}</p>
                  </div>
                  
                  <Button 
                    className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white"
                    onClick={() => {
                      setSelectedPackage(pkg.id)
                      setShowContactForm(true)
                    }}
                  >
                    {t("iran.packages.book")}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-slate-400 mb-4">Don't see what you're looking for?</p>
            <Button 
              variant="outline" 
              size="lg"
              className="bg-transparent border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-white"
              onClick={() => setShowContactForm(true)}
            >
              {t("iran.packages.requestCustom")}
            </Button>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
              What's Included
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every tour includes comprehensive services for a worry-free journey through Iran.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {inclusions.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="size-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                  <item.icon className="size-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Info */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-3xl font-bold mb-8 text-center">
              Practical Information
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card>
                <CardContent className="p-5">
                  <Sun className="size-8 text-amber-500 mb-3" />
                  <h3 className="font-semibold mb-2">Best Time to Visit</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Spring (Mar-May) and Autumn (Sep-Nov) offer ideal weather across most regions.
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="secondary">March-May</Badge>
                    <Badge variant="secondary">Sep-Nov</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-5">
                  <Thermometer className="size-8 text-amber-500 mb-3" />
                  <h3 className="font-semibold mb-2">Climate</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Varied climate from hot deserts to cool mountains. Pack layers!
                  </p>
                  <div className="text-sm">
                    <p>Spring: 15-25°C</p>
                    <p>Autumn: 15-28°C</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-5">
                  <Shield className="size-8 text-amber-500 mb-3" />
                  <h3 className="font-semibold mb-2">Safety</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Iran is very safe for tourists with low crime rates and welcoming locals.
                  </p>
                  <Badge className="bg-green-100 text-green-700">Very Safe</Badge>
                </CardContent>
              </Card>
            </div>

            {/* FAQ */}
            <h3 className="font-serif text-2xl font-bold mb-6 text-center">
              {t("iran.faq.title")}
            </h3>
            <div className="space-y-3 max-w-3xl mx-auto">
              {faqs.map((faq, idx) => (
                <Card 
                  key={idx} 
                  className="cursor-pointer"
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{faq.q}</h4>
                      <ChevronRight className={`size-5 text-muted-foreground transition-transform ${
                        expandedFaq === idx ? "rotate-90" : ""
                      }`} />
                    </div>
                    {expandedFaq === idx && (
                      <p className="text-sm text-muted-foreground mt-3 pt-3 border-t">
                        {faq.a}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-amber-600 to-amber-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
            Ready to Explore Iran?
          </h2>
          <p className="text-amber-100 text-lg mb-8 max-w-2xl mx-auto">
            Let our team craft your perfect Iranian adventure. Tell us your interests, 
            budget, and travel dates, and we'll handle everything else.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-amber-700 hover:bg-amber-50"
              onClick={() => setShowContactForm(true)}
            >
              <MessageCircle className="size-4 me-2" />
              Start Planning
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent border-white/50 text-white hover:bg-white/10"
              asChild
            >
              <a href="mailto:iran@tripology.com">
                <Mail className="size-4 me-2" />
                iran@tripology.com
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Form Dialog */}
      <Dialog open={showContactForm} onOpenChange={setShowContactForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Plan Your Iran Trip</DialogTitle>
            <DialogDescription>
              Tell us about your dream Iran adventure. Our team will create a personalized itinerary within 24 hours.
            </DialogDescription>
          </DialogHeader>
          
          {formSubmitted ? (
            <div className="py-8 text-center">
              <div className="size-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check className="size-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Request Received!</h3>
              <p className="text-muted-foreground text-sm">
                Our Iran specialist will contact you within 24 hours with a personalized itinerary proposal.
              </p>
              <Button 
                className="mt-4"
                onClick={() => {
                  setShowContactForm(false)
                  setFormSubmitted(false)
                }}
              >
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input id="name" required placeholder="John Smith" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required placeholder="john@email.com" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="travelers">Travelers</Label>
                  <Select defaultValue="2">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 person</SelectItem>
                      <SelectItem value="2">2 people</SelectItem>
                      <SelectItem value="3">3-4 people</SelectItem>
                      <SelectItem value="5">5+ people</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Level</Label>
                  <Select defaultValue="mid">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">Budget</SelectItem>
                      <SelectItem value="mid">Mid-Range</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Trip Duration</Label>
                  <Select defaultValue="10-14">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7-10">7-10 days</SelectItem>
                      <SelectItem value="10-14">10-14 days</SelectItem>
                      <SelectItem value="14+">14+ days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="when">When?</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {["March", "April", "May", "September", "October", "November", "Flexible"].map(m => (
                        <SelectItem key={m} value={m.toLowerCase()}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {selectedPackage && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Selected package: <strong>{tourPackages.find(p => p.id === selectedPackage)?.name}</strong>
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="interests">Your Interests & Questions</Label>
                <Textarea 
                  id="interests" 
                  placeholder="Tell us what you'd like to see, any special interests (architecture, food, adventure), or questions..."
                  rows={3}
                />
              </div>
              
              <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600">
                Send Request
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                We typically respond within 24 hours with a custom itinerary proposal.
              </p>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
