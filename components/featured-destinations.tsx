"use client"

import { motion } from "framer-motion"
import { MapPin, Star, Clock, Users, ArrowRight, Heart, Sparkles, TrendingUp, Compass } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"

type Destination = {
  id: string
  nameKey: string
  countryKey: string
  taglineKey: string
  image: string
  rating: number
  plans: number
  travelers: string
  priceFrom: number
  tags: string[]
  color: string
  featured: boolean
}

const INTERNATIONAL_DESTINATIONS: Destination[] = [
  {
    id: "paris",
    nameKey: "paris",
    countryKey: "france",
    taglineKey: "parisTagline",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    rating: 4.9,
    plans: 48,
    travelers: "12K+",
    priceFrom: 45,
    tags: ["Romantic", "Cultural", "Foodie"],
    color: "from-rose-500/80 to-pink-600/80",
    featured: true,
  },
  {
    id: "tokyo",
    nameKey: "tokyo",
    countryKey: "japan",
    taglineKey: "tokyoTagline",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    rating: 4.8,
    plans: 35,
    travelers: "8K+",
    priceFrom: 55,
    tags: ["Adventure", "Foodie", "Cultural"],
    color: "from-red-500/80 to-orange-600/80",
    featured: true,
  },
  {
    id: "bali",
    nameKey: "bali",
    countryKey: "indonesia",
    taglineKey: "baliTagline",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    rating: 4.7,
    plans: 42,
    travelers: "15K+",
    priceFrom: 35,
    tags: ["Nature", "Relaxation", "Budget"],
    color: "from-emerald-500/80 to-teal-600/80",
    featured: false,
  },
  {
    id: "istanbul",
    nameKey: "istanbul",
    countryKey: "turkey",
    taglineKey: "istanbulTagline",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80",
    rating: 4.8,
    plans: 28,
    travelers: "6K+",
    priceFrom: 30,
    tags: ["Cultural", "Foodie", "History"],
    color: "from-amber-500/80 to-orange-600/80",
    featured: false,
  },
  {
    id: "barcelona",
    nameKey: "barcelona",
    countryKey: "spain",
    taglineKey: "barcelonaTagline",
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80",
    rating: 4.7,
    plans: 31,
    travelers: "9K+",
    priceFrom: 40,
    tags: ["City Break", "Beach", "Art"],
    color: "from-blue-500/80 to-indigo-600/80",
    featured: false,
  },
  {
    id: "morocco",
    nameKey: "marrakech",
    countryKey: "morocco",
    taglineKey: "marrakechTagline",
    image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800&q=80",
    rating: 4.6,
    plans: 22,
    travelers: "5K+",
    priceFrom: 25,
    tags: ["Adventure", "Cultural", "Budget"],
    color: "from-yellow-500/80 to-red-600/80",
    featured: false,
  },
]

const IRANIAN_DESTINATIONS: Destination[] = [
  {
    id: "isfahan",
    nameKey: "isfahan",
    countryKey: "iran",
    taglineKey: "isfahanTagline",
    image: "/iran-isfahan.jpg",
    rating: 4.9,
    plans: 65,
    travelers: "۲۵K+",
    priceFrom: 800,
    tags: ["تاریخی", "فرهنگی", "معماری"],
    color: "from-blue-600/80 to-cyan-700/80",
    featured: true,
  },
  {
    id: "shiraz",
    nameKey: "shiraz",
    countryKey: "iran",
    taglineKey: "shirazTagline",
    image: "/iran-shiraz.jpg",
    rating: 4.8,
    plans: 52,
    travelers: "۱۸K+",
    priceFrom: 900,
    tags: ["شعر", "باغ", "تاریخ"],
    color: "from-pink-500/80 to-rose-600/80",
    featured: true,
  },
  {
    id: "yazd",
    nameKey: "yazd",
    countryKey: "iran",
    taglineKey: "yazdTagline",
    image: "/iran-yazd.jpg",
    rating: 4.8,
    plans: 38,
    travelers: "۱۲K+",
    priceFrom: 600,
    tags: ["کویر", "معماری", "یونسکو"],
    color: "from-amber-500/80 to-yellow-600/80",
    featured: false,
  },
  {
    id: "tabriz",
    nameKey: "tabriz",
    countryKey: "iran",
    taglineKey: "tabrizTagline",
    image: "https://images.unsplash.com/photo-1590595978583-3f3d10e88e69?w=800&q=80",
    rating: 4.7,
    plans: 32,
    travelers: "۱۰K+",
    priceFrom: 550,
    tags: ["بازار", "تاریخ", "غذا"],
    color: "from-indigo-500/80 to-blue-700/80",
    featured: false,
  },
  {
    id: "kashan",
    nameKey: "kashan",
    countryKey: "iran",
    taglineKey: "kashanTagline",
    image: "https://images.unsplash.com/photo-1565108781645-65b9b28d1b88?w=800&q=80",
    rating: 4.9,
    plans: 28,
    travelers: "۹K+",
    priceFrom: 450,
    tags: ["خانه تاریخی", "گلاب", "سنتی"],
    color: "from-rose-400/80 to-pink-600/80",
    featured: false,
  },
  {
    id: "hormozgan",
    nameKey: "hormozgan",
    countryKey: "iran",
    taglineKey: "hormozganTagline",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    rating: 4.6,
    plans: 24,
    travelers: "۷K+",
    priceFrom: 700,
    tags: ["جزیره", "ساحل", "ماجراجویی"],
    color: "from-cyan-500/80 to-teal-600/80",
    featured: false,
  },
]

/* Desktop bento class lookup – Paris & Tokyo get double-height spotlight */
const DESKTOP_GRID_CLASSES: Record<number, string> = {
  0: "lg:col-span-3 lg:row-span-2",   // Paris — wide hero card
  1: "lg:col-span-3 lg:row-span-2",   // Tokyo — wide hero card
  2: "lg:col-span-2 lg:row-span-1",
  3: "lg:col-span-2 lg:row-span-1",
  4: "lg:col-span-2 lg:row-span-1",
  5: "lg:col-span-2 lg:row-span-1",
}

const DestinationCard = ({ destination, index, t, isIranUser }: { destination: Destination; index: number; t: (key: string) => string; isIranUser: boolean }) => {
  const isLarge = destination.featured
  const currency = isIranUser ? "تومان" : "$"
  const priceDisplay = isIranUser ? `${destination.priceFrom.toLocaleString("fa-IR")} ${currency}` : `$${destination.priceFrom}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl cursor-pointer",
        /* Mobile: simple 2-col grid, featured takes 2 cols */
        destination.featured ? "col-span-2" : "col-span-1",
        DESKTOP_GRID_CLASSES[index] || ""
      )}
    >
      <Link href={`/explore?destination=${destination.id}`} className="block h-full">
        <div className={cn("relative", destination.featured ? "h-[280px] sm:h-[360px] lg:h-full" : "h-[200px] sm:h-[240px] lg:h-full")}>
          {/* Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url(${destination.image})` }}
          />
          {/* Overlay */}
          <div className={cn("absolute inset-0 bg-gradient-to-t", destination.color, "opacity-60")} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-5 lg:p-6">
            {/* Top */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-2.5 py-1 text-white">
                <Star className="size-3 fill-amber-300 text-amber-300" />
                <span className="text-xs font-medium">{destination.rating}</span>
              </div>
              <button className="rounded-full bg-white/20 backdrop-blur-md p-2 text-white hover:bg-white/30 transition-colors">
                <Heart className="size-3.5" />
              </button>
            </div>

            {/* Bottom */}
            <div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {destination.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/20 backdrop-blur-sm px-2 py-0.5 text-[10px] lg:text-xs font-medium text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className={cn(
                "font-serif font-bold text-white",
                isLarge ? "text-2xl sm:text-3xl lg:text-4xl" : "text-lg lg:text-xl"
              )}>
                {t(`featuredDest.${destination.nameKey}`)}
              </h3>
              <p className={cn("text-white/80 flex items-center gap-1 mt-0.5", isLarge ? "text-sm lg:text-base" : "text-sm")}>
                <MapPin className="size-3" />
                {t(`featuredDest.${destination.countryKey}`)}
                {isLarge && <span className="ms-2 hidden sm:inline">{t(`featuredDest.${destination.taglineKey}`)}</span>}
              </p>
              <div className={cn(
                "flex items-center gap-3 mt-2",
                isLarge ? "text-sm lg:text-base" : "text-xs"
              )}>
                <span className="text-white/70">
                  <strong className="text-white">{destination.plans}</strong> {t("featuredDest.plans")}
                </span>
                <span className="text-white/40">•</span>
                <span className="text-white/70">
                  <strong className="text-white">{destination.travelers}</strong> {t("featuredDest.travelers")}
                </span>
                <span className="text-white/40">•</span>
                <span className="text-white/70">
                  {t("featuredDest.from")} <strong className="text-emerald-300">{priceDisplay}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Hover Arrow */}
          <div className="absolute bottom-5 end-5 lg:bottom-6 lg:end-6 size-10 lg:size-12 rounded-full bg-white/0 group-hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0">
            <ArrowRight className="size-5 lg:size-6 text-white" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function FeaturedDestinations() {
  const { t, locale } = useI18n()
  const isIranUser = locale === "fa"
  const destinations = isIranUser ? IRANIAN_DESTINATIONS : INTERNATIONAL_DESTINATIONS

  return (
    <section className="py-12 sm:py-16 lg:py-20 xl:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 lg:mb-10 xl:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="size-8 lg:size-10 rounded-xl bg-forest/10 flex items-center justify-center">
                <Compass className="size-4 lg:size-5 text-forest" />
              </div>
              <span className="text-xs lg:text-sm font-medium text-forest uppercase tracking-wider">{t("featuredDest.discover")}</span>
            </div>
            <h2 className="font-serif text-2xl font-bold sm:text-3xl lg:text-4xl xl:text-[2.75rem] lg:leading-tight">{t("featuredDest.title")}</h2>
            <p className="text-muted-foreground text-sm lg:text-base mt-1 lg:mt-2 lg:max-w-xl">{t("featuredDest.subtitle")}</p>
          </div>
          <Button variant="outline" className="hidden sm:flex bg-transparent lg:h-11 lg:px-5 lg:text-sm" asChild>
            <Link href="/explore">
              {t("featuredDest.viewAll")}
              <ArrowRight className="size-4 ms-2" />
            </Link>
          </Button>
        </div>

        {/* Mobile grid: 2 cols */}
        {/* Desktop grid: 6 cols bento */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-4 xl:gap-5 lg:auto-rows-[180px] xl:auto-rows-[200px] 2xl:auto-rows-[220px]">
          {destinations.map((dest, i) => (
            <DestinationCard key={dest.id} destination={dest} index={i} t={t} isIranUser={isIranUser} />
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-6 sm:hidden text-center">
          <Button variant="outline" className="bg-transparent w-full" asChild>
            <Link href="/explore">
              {t("featuredDest.exploreAll")}
              <ArrowRight className="size-4 ms-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
