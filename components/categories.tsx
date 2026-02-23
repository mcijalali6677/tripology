"use client"

import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { useI18n } from "@/lib/i18n/context"

const categories = [
  { key: "beach", count: 124, image: "/tropical-beach-paradise.png", href: "/#itineraries" },
  { key: "adventure", count: 89, image: "/mountain-hiking-adventure.png", href: "/#itineraries" },
  { key: "cityBreak", count: 156, image: "/european-city-architecture.jpg", href: "/#itineraries" },
  { key: "cultural", count: 98, image: "/ancient-temple-cultural-site.jpg", href: "/#itineraries" },
  { key: "nature", count: 67, image: "/scenic-road-trip-landscape.jpg", href: "/#itineraries" },
  { key: "budget", count: 143, image: "/backpacker-hostel-travel.jpg", href: "/#itineraries" },
]

export function Categories() {
  const { t } = useI18n()

  return (
    <section className="py-6 sm:py-8">
      <div className="container mx-auto px-4">
        <h2 className="font-serif text-lg font-bold sm:text-xl mb-4">{t("categories.title")}</h2>
        <div className="grid gap-3 grid-cols-3 sm:grid-cols-6">
          {categories.map((category) => (
            <Link key={category.key} href={category.href}>
              <Card className="group relative overflow-hidden aspect-[3/4]">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={t(`categories.${category.key}`)}
                  fill
                  sizes="(max-width: 640px) 33vw, 16vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-2.5">
                  <h3 className="font-semibold text-white text-xs sm:text-sm">{t(`categories.${category.key}`)}</h3>
                  <p className="text-white/80 text-[10px]">{category.count} {t("common.days").toLowerCase()}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
