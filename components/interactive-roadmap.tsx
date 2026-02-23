'use client';

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Play, Pause, ChevronLeft, ChevronRight, Plane, Train, Ship, Bus, MapPin, Calendar, DollarSign, Landmark, Utensils, ShoppingBag, Building, UmbrellaOff as UmbrellaBeach, Sailboat, Mountain, Waves, Palmtree, Fish, Droplets, Sparkles, Clock, Star, Heart } from "lucide-react"
import type { RoadmapData, RoadmapCity } from "@/lib/types"

interface InteractiveRoadmapProps {
  roadmap: RoadmapData
}

const activityIcons: Record<string, React.ReactNode> = {
  landmark: <Landmark className="size-4" />,
  utensils: <Utensils className="size-4" />,
  "shopping-bag": <ShoppingBag className="size-4" />,
  building: <Building className="size-4" />,
  "umbrella-beach": <UmbrellaBeach className="size-4" />,
  sailboat: <Sailboat className="size-4" />,
  mountain: <Mountain className="size-4" />,
  waves: <Waves className="size-4" />,
  ship: <Ship className="size-4" />,
  palmtree: <Palmtree className="size-4" />,
  fish: <Fish className="size-4" />,
  droplets: <Droplets className="size-4" />,
}

const transportIcons: Record<string, React.ReactNode> = {
  flight: <Plane className="size-4" />,
  train: <Train className="size-4" />,
  ferry: <Ship className="size-4" />,
  bus: <Bus className="size-4" />,
}

export function InteractiveRoadmap({ roadmap }: InteractiveRoadmapProps) {
  const [selectedCity, setSelectedCity] = useState<RoadmapCity | null>(null)
  const [currentDay, setCurrentDay] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)
  const mapRef = useRef<HTMLDivElement>(null)

  // Get city for current day
  const getCityForDay = (day: number) => {
    return roadmap.cities.find((city) => day >= city.startDay && day <= city.endDay)
  }

  const activeCity = getCityForDay(currentDay)

  // Play trip animation
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setCurrentDay((prev) => {
        if (prev >= roadmap.totalDays) {
          setIsPlaying(false)
          return 1
        }
        return prev + 1
      })
    }, 1500)
    return () => clearInterval(interval)
  }, [isPlaying, roadmap.totalDays])

  // Calculate map positions (simplified 2D projection)
  const getMapPosition = (city: RoadmapCity, index: number) => {
    const mapWidth = 100
    const mapHeight = 100
    const padding = 15
    const availableWidth = mapWidth - padding * 2
    const availableHeight = mapHeight - padding * 2

    // Spread cities horizontally based on index
    const x = padding + (index / (roadmap.cities.length - 1 || 1)) * availableWidth
    // Add some vertical variation based on coordinates
    const yVariation = ((city.coordinates.lat - 10) / 5) * 20
    const y = 50 + yVariation

    return { x, y }
  }

  const getTransportForCities = (fromId: number, toId: number) => {
    return roadmap.transport.find((t) => t.from === fromId && t.to === toId)
  }

  return (
    null
  )
}
