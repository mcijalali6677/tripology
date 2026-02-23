"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Star, Quote, MapPin, Calendar, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n/context"

type Testimonial = {
  id: number
  name: string
  avatar: string
  location: string
  trip: string
  tripImage: string
  rating: number
  text: string
  verified: boolean
  color: string
}

const INTERNATIONAL_TESTIMONIALS_DATA = [
  { id: 1, key: "t1", avatar: "SC", tripImage: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=75", color: "bg-rose-100 text-rose-700" },
  { id: 2, key: "t2", avatar: "MR", tripImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=75", color: "bg-blue-100 text-blue-700" },
  { id: 3, key: "t3", avatar: "AP", tripImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=75", color: "bg-emerald-100 text-emerald-700" },
  { id: 4, key: "t4", avatar: "AK", tripImage: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=75", color: "bg-amber-100 text-amber-700" },
  { id: 5, key: "t5", avatar: "ED", tripImage: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=75", color: "bg-purple-100 text-purple-700" },
  { id: 6, key: "t6", avatar: "DM", tripImage: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600&q=75", color: "bg-teal-100 text-teal-700" },
]

const IRANIAN_TESTIMONIALS_DATA = [
  { id: 1, key: "t1", avatar: "مر", tripImage: "/iran-isfahan.jpg", color: "bg-sky-100 text-sky-700" },
  { id: 2, key: "t2", avatar: "عم", tripImage: "/iran-shiraz.jpg", color: "bg-pink-100 text-pink-700" },
  { id: 3, key: "t3", avatar: "سا", tripImage: "/iran-yazd.jpg", color: "bg-amber-100 text-amber-700" },
  { id: 4, key: "t4", avatar: "رک", tripImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=75", color: "bg-emerald-100 text-emerald-700" },
  { id: 5, key: "t5", avatar: "نع", tripImage: "https://images.unsplash.com/photo-1609686523687-6aea8e945dae?w=600&q=75", color: "bg-orange-100 text-orange-700" },
  { id: 6, key: "t6", avatar: "مح", tripImage: "/iran-tehran.jpg", color: "bg-slate-100 text-slate-700" },
]

export function TestimonialsAdvanced() {
  const { t, locale } = useI18n()
  const isIran = locale === "fa"

  const dataSet = isIran ? IRANIAN_TESTIMONIALS_DATA : INTERNATIONAL_TESTIMONIALS_DATA

  const TESTIMONIALS: Testimonial[] = dataSet.map(d => ({
    id: d.id,
    name: t(`testimonialsAdv.${d.key}Name`),
    avatar: d.avatar,
    location: t(`testimonialsAdv.${d.key}Location`),
    trip: t(`testimonialsAdv.${d.key}Trip`),
    tripImage: d.tripImage,
    rating: 5,
    text: t(`testimonialsAdv.${d.key}Text`),
    verified: true,
    color: d.color,
  }))

  const featured = TESTIMONIALS[0]
  const rest = TESTIMONIALS.slice(1)

  return (
    <section className="py-16 sm:py-20 lg:py-20 xl:py-24 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-14 xl:mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5 text-sm text-amber-700 mb-4">
            <Star className="size-4 fill-amber-500 text-amber-500" />
            {t("testimonialsAdv.badge")}
          </div>
          <h2 className="font-serif text-3xl font-bold sm:text-4xl lg:text-4xl xl:text-[2.75rem] mb-3 lg:mb-4">
            {t("testimonialsAdv.title")} <span className="text-forest">{t("testimonialsAdv.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground max-w-md lg:max-w-xl mx-auto lg:text-base xl:text-lg">
            {t("testimonialsAdv.subtitle")}
          </p>
        </motion.div>

        {/* Mobile: masonry columns */}
        <div className="columns-1 sm:columns-2 gap-4 max-w-5xl mx-auto lg:hidden">
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} t={t} />
          ))}
        </div>

        {/* Desktop: featured card + grid */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-5 xl:gap-6 max-w-6xl mx-auto">
          {/* Featured — takes 2 cols */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="col-span-2 row-span-2"
          >
            <div className="rounded-2xl border-2 border-forest/10 bg-gradient-to-br from-forest/5 to-emerald-50/50 p-6 xl:p-8 h-full flex flex-col justify-between hover:shadow-xl transition-shadow duration-500">
              <div>
                {/* Trip image */}
                <div className="relative w-full h-36 xl:h-44 rounded-xl overflow-hidden mb-4 xl:mb-5">
                  <Image
                    src={featured.tripImage}
                    alt={featured.trip}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-2 start-3 flex items-center gap-1.5 text-white text-sm font-medium">
                    <MapPin className="size-3.5" />
                    {featured.trip}
                  </div>
                </div>
                <Quote className="size-8 xl:size-10 text-forest/15 mb-3 xl:mb-4" />
                <div className="flex items-center gap-0.5 mb-3">
                  {Array.from({ length: featured.rating }).map((_, i) => (
                    <Star key={i} className="size-4 xl:size-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-base xl:text-lg leading-relaxed text-foreground/80 mb-5 xl:mb-6">
                  &ldquo;{featured.text}&rdquo;
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center gap-1.5 rounded-full bg-secondary/60 px-3 py-1.5 text-sm text-muted-foreground">
                    <Calendar className="size-3.5" />
                    {featured.trip}
                  </div>
                  {featured.verified && (
                    <div className="flex items-center gap-1 text-sm text-emerald-600">
                      <CheckCircle2 className="size-3.5" />
                      {t("testimonialsAdv.verified")}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "size-12 xl:size-14 rounded-full flex items-center justify-center text-base xl:text-lg font-semibold",
                    featured.color
                  )}>
                    {featured.avatar}
                  </div>
                  <div>
                    <div className="text-sm xl:text-base font-semibold">{featured.name}</div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="size-3.5" />
                      {featured.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Other testimonials — 3 cols, 2 rows */}
          {rest.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="col-span-1"
            >
              <div className="rounded-2xl border bg-card p-5 xl:p-6 h-full hover:shadow-lg hover:border-forest/10 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
                <div>
                  {/* Trip image */}
                  <div className="relative w-full h-24 xl:h-28 rounded-lg overflow-hidden mb-3">
                    <Image
                      src={testimonial.tripImage}
                      alt={testimonial.trip}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-1.5 start-2 flex items-center gap-1 text-white text-xs font-medium">
                      <MapPin className="size-3" />
                      {testimonial.trip}
                    </div>
                  </div>
                  <Quote className="size-6 text-muted-foreground/10 mb-2" />
                  <div className="flex items-center gap-0.5 mb-3">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm xl:text-base leading-relaxed text-foreground/80 mb-4 xl:mb-5">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1.5 rounded-full bg-secondary/60 px-2.5 py-1 text-xs text-muted-foreground">
                      <Calendar className="size-3" />
                      {testimonial.trip}
                    </div>
                    {testimonial.verified && (
                      <div className="flex items-center gap-1 text-xs text-emerald-600">
                        <CheckCircle2 className="size-3" />
                        {t("testimonialsAdv.verified")}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "size-10 rounded-full flex items-center justify-center text-sm font-semibold",
                      testimonial.color
                    )}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{testimonial.name}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3" />
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* Shared card for mobile masonry */
function TestimonialCard({ testimonial, index, t }: { testimonial: Testimonial; index: number; t: (key: string) => string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="break-inside-avoid mb-4"
    >
      <div className="rounded-2xl border bg-card p-5 hover:shadow-md transition-shadow">
        {/* Trip image */}
        <div className="relative w-full h-28 rounded-lg overflow-hidden mb-3">
          <Image
            src={testimonial.tripImage}
            alt={testimonial.trip}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-1.5 start-2 flex items-center gap-1 text-white text-xs font-medium">
            <MapPin className="size-3" />
            {testimonial.trip}
          </div>
        </div>
        <Quote className="size-7 text-muted-foreground/10 mb-2" />
        <div className="flex items-center gap-0.5 mb-3">
          {Array.from({ length: testimonial.rating }).map((_: unknown, i: number) => (
            <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <p className="text-sm leading-relaxed text-foreground/80 mb-4">
          &ldquo;{testimonial.text}&rdquo;
        </p>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 rounded-full bg-secondary/60 px-2.5 py-1 text-xs text-muted-foreground">
            <Calendar className="size-3" />
            {testimonial.trip}
          </div>
          {testimonial.verified && (
            <div className="flex items-center gap-1 text-xs text-emerald-600">
              <CheckCircle2 className="size-3" />
              {t("testimonialsAdv.verified")}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className={cn(
            "size-10 rounded-full flex items-center justify-center text-sm font-semibold",
            testimonial.color
          )}>
            {testimonial.avatar}
          </div>
          <div>
            <div className="text-sm font-medium">{testimonial.name}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" />
              {testimonial.location}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
