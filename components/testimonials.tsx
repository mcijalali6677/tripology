"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Quote } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

const testimonials = [
  {
    name: "Sarah Mitchell",
    avatar: "/professional-woman-portrait.png",
    location: "Toronto, Canada",
    rating: 5,
    text: "Tripology changed how I plan trips. The Japan itinerary I bought had every detail perfect - from the best ramen spots to hidden temples. Worth every penny!",
    trip: "10-Day Japan Adventure",
  },
  {
    name: "Marcus Johnson",
    avatar: "/casual-man-portrait.png",
    location: "Vancouver, Canada",
    rating: 5,
    text: "As a solo traveler, having a tested itinerary with safety tips made me feel confident exploring Morocco. The AI match feature found exactly what I needed.",
    trip: "Morocco Cultural Journey",
  },
  {
    name: "Emily & David Chen",
    avatar: "/couple-portrait-happy.jpg",
    location: "Montreal, Canada",
    rating: 5,
    text: "We saved hours of research for our honeymoon. The Bali itinerary included romantic spots we never would have found ourselves. Absolutely magical trip!",
    trip: "Bali Honeymoon Escape",
  },
]

export function Testimonials() {
  const { t } = useI18n()

  return (
    <section className="py-12 sm:py-16 bg-cream">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-10">
          <h2 className="mb-4 font-serif text-2xl font-bold sm:text-3xl">{t("testimonials.title")}</h2>
          <p className="text-muted-foreground">
            {t("testimonials.subtitle")}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="relative">
              <CardContent className="p-6">
                <Quote className="absolute top-4 end-4 size-8 text-forest/10" />
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-4">{testimonial.text}</p>
                <p className="text-xs text-forest font-medium mb-4">Trip: {testimonial.trip}</p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
