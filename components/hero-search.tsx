"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, Users, Sparkles, Plane, Globe, TrendingUp, Star, Compass, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"

const TRENDING_DESTINATIONS = [
  { nameKey: "paris", countryKey: "france", emoji: "🇫🇷" },
  { nameKey: "tokyo", countryKey: "japan", emoji: "🇯🇵" },
  { nameKey: "bali", countryKey: "indonesia", emoji: "🇮🇩" },
  { nameKey: "istanbul", countryKey: "turkey", emoji: "🇹🇷" },
  { nameKey: "barcelona", countryKey: "spain", emoji: "🇪🇸" },
  { nameKey: "marrakech", countryKey: "morocco", emoji: "🇲🇦" },
]

const HERO_BACKGROUNDS = [
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=80",
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&q=80",
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80",
]

const GALLERY = [
  { src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80", city: "Paris", country: "France", rating: 4.9, plans: "48" },
  { src: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80", city: "Tokyo", country: "Japan", rating: 4.8, plans: "35" },
  { src: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80", city: "Bali", country: "Indonesia", rating: 4.7, plans: "42" },
  { src: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=80", city: "Istanbul", country: "Turkey", rating: 4.8, plans: "28" },
]

export function HeroSearch() {
  const { t } = useI18n()
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [bgIndex, setBgIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex(i => (i + 1) % HERO_BACKGROUNDS.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const handleSearch = (searchQuery?: string) => {
    const q = searchQuery || query
    if (q.trim()) {
      router.push(`/explore?q=${encodeURIComponent(q.trim())}`)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    handleSearch(suggestion)
  }

  return (
    <section className="relative overflow-hidden">
      {/* Animated Background — mobile only; desktop uses solid gradient */}
      <div className="absolute inset-0 lg:hidden">
        {HERO_BACKGROUNDS.map((bg, i) => (
          <div
            key={bg}
            className={cn(
              "absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms]",
              i === bgIndex ? "opacity-100" : "opacity-0"
            )}
            style={{ backgroundImage: `url(${bg})` }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>
      {/* Desktop background — rich radial gradient */}
      <div className="absolute inset-0 hidden lg:block bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.12),transparent),linear-gradient(to_bottom_right,#0c1a12,#162b1e,#0e1c13)]" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 xl:px-10 py-20 sm:py-28 lg:py-0">
        <div className="w-full flex flex-col lg:flex-row lg:items-center lg:gap-20 xl:gap-24 2xl:gap-28 lg:py-14 xl:py-16">
          {/* Left — Content & Search */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-3xl text-center lg:text-start lg:mx-0 lg:flex-1 lg:max-w-[500px] xl:max-w-[540px]"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-5 lg:mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-4 py-2 text-sm text-white/90 border border-white/20"
            >
              <Sparkles className="size-4 text-amber-300" />
              <span>{t("heroSearch.badge")}</span>
              <span className="rounded-full bg-emerald-400/20 text-emerald-300 px-2 py-0.5 text-xs font-medium">{t("heroSearch.badgeNew")}</span>
            </motion.div>

            {/* Title — much bigger on desktop */}
            <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[2.75rem] xl:text-5xl lg:leading-[1.12]">
              {t("heroSearch.title1")}
              <br />
              <span className="bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-300 bg-clip-text text-transparent">
                {t("heroSearch.titleHighlight")}
              </span>{" "}
              {t("heroSearch.title2")}
            </h1>

            <p className="mb-8 lg:mb-8 text-base text-white/70 sm:text-lg lg:text-lg lg:max-w-md leading-relaxed mx-auto lg:mx-0">
              {t("heroSearch.subtitle")}
            </p>

            {/* Search Bar */}
            <div className="relative mx-auto max-w-2xl lg:mx-0">
              <div
                className={cn(
                  "relative flex items-center rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl transition-all duration-300",
                  isFocused ? "ring-2 ring-forest/50 shadow-forest/20" : "ring-1 ring-white/30"
                )}
              >
                <div className="flex items-center gap-3 flex-1 px-5 py-4 lg:py-5">
                  <Search className="size-5 text-muted-foreground shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder={t("heroSearch.placeholder")}
                    className="flex-1 bg-transparent text-sm lg:text-base text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <Button
                  onClick={() => handleSearch()}
                  className="me-2 rounded-xl bg-forest hover:bg-forest/90 px-6 lg:px-8 h-11 lg:h-12 shrink-0"
                >
                  <Sparkles className="size-4 me-2" />
                  {t("heroSearch.explore")}
                </Button>
              </div>

              {/* Search Dropdown */}
              <AnimatePresence>
                {isFocused && !query && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 inset-x-0 bg-white rounded-2xl shadow-2xl border overflow-hidden z-50"
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-3">
                        <TrendingUp className="size-3.5" />
                        {t("heroSearch.popularSearches")}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[t("heroSearch.suggestion1"), t("heroSearch.suggestion2"), t("heroSearch.suggestion3"), t("heroSearch.suggestion4"), t("heroSearch.suggestion5"), t("heroSearch.suggestion6")].map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="rounded-full bg-secondary/60 hover:bg-secondary px-3 py-1.5 text-xs text-foreground transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="border-t px-4 py-3">
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-3">
                        <Globe className="size-3.5" />
                        {t("heroSearch.trendingDestinations")}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {TRENDING_DESTINATIONS.map((dest) => (
                          <button
                            key={dest.nameKey}
                            onClick={() => handleSuggestionClick(`${t("heroSearch.tripTo")} ${t(`featuredDest.${dest.nameKey}`)}`)}
                            className="flex items-center gap-2 rounded-xl hover:bg-secondary/60 p-2 transition-colors text-start"
                          >
                            <span className="text-lg">{dest.emoji}</span>
                            <div>
                              <div className="text-xs font-medium">{t(`featuredDest.${dest.nameKey}`)}</div>
                              <div className="text-[10px] text-muted-foreground">{t(`featuredDest.${dest.countryKey}`)}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 lg:mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 lg:gap-6 text-sm text-white/60"
            >
              <div className="flex items-center gap-2">
                <Plane className="size-4" />
                <span><strong className="text-white/80">{t("heroSearch.stat1")}</strong> {t("heroSearch.stat1Label")}</span>
              </div>
              <div className="h-4 w-px bg-white/20" />
              <div className="flex items-center gap-2">
                <MapPin className="size-4" />
                <span><strong className="text-white/80">{t("heroSearch.stat2")}</strong> {t("heroSearch.stat2Label")}</span>
              </div>
              <div className="h-4 w-px bg-white/20" />
              <div className="flex items-center gap-2">
                <Users className="size-4" />
                <span><strong className="text-white/80">{t("heroSearch.stat3")}</strong> {t("heroSearch.stat3Label")}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Desktop gallery composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden lg:block lg:flex-1 lg:max-w-[420px] xl:max-w-[480px] lg:px-6 xl:px-8"
          >
            <div className="relative">
              {/* Main hero image */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 aspect-[3/4] border border-white/10"
              >
                <img
                  src={GALLERY[0].src}
                  alt={GALLERY[0].city}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-2.5 py-1 text-xs text-white font-medium">
                      <Star className="size-3 fill-amber-300 text-amber-300" />
                      {GALLERY[0].rating}
                    </span>
                    <span className="rounded-full bg-emerald-400/20 backdrop-blur-md px-2.5 py-1 text-xs text-emerald-300 font-medium">
                      {GALLERY[0].plans} plans
                    </span>
                  </div>
                  <h3 className="text-2xl xl:text-3xl font-serif font-bold text-white leading-tight">{GALLERY[0].city}</h3>
                  <p className="text-white/60 text-sm mt-0.5">{GALLERY[0].country}</p>
                </div>
              </motion.div>

              {/* Floating card top-right */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -end-4 xl:-end-6 w-36 xl:w-40 rounded-2xl overflow-hidden shadow-xl border border-white/15 bg-black/40 backdrop-blur-xl"
                >
                  <div className="aspect-[3/2] overflow-hidden">
                    <img src={GALLERY[1].src} alt={GALLERY[1].city} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm font-semibold">{GALLERY[1].city}</span>
                      <span className="flex items-center gap-0.5 text-amber-200 text-xs">
                        <Star className="size-2.5 fill-amber-300 text-amber-300" />{GALLERY[1].rating}
                      </span>
                    </div>
                    <span className="text-white/50 text-xs">{GALLERY[1].country}</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Floating card bottom-left */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-4 -start-4 xl:-start-6 w-36 xl:w-40 rounded-2xl overflow-hidden shadow-xl border border-white/15 bg-black/40 backdrop-blur-xl"
                >
                  <div className="aspect-[3/2] overflow-hidden">
                    <img src={GALLERY[2].src} alt={GALLERY[2].city} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm font-semibold">{GALLERY[2].city}</span>
                      <span className="flex items-center gap-0.5 text-amber-200 text-xs">
                        <Star className="size-2.5 fill-amber-300 text-amber-300" />{GALLERY[2].rating}
                      </span>
                    </div>
                    <span className="text-white/50 text-xs">{GALLERY[2].country}</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Accent rings decoration */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
                className="absolute top-1/2 -start-12 -translate-y-1/2 pointer-events-none"
              >
                <div className="size-20 xl:size-24 rounded-full border border-emerald-400/20 flex items-center justify-center">
                  <div className="size-14 xl:size-16 rounded-full border border-emerald-400/10 flex items-center justify-center">
                    <Compass className="size-6 text-emerald-300/40 animate-spin" style={{ animationDuration: "15s" }} />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
