"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Play, Pause, RotateCcw } from "lucide-react"
import type { RoadmapData } from "@/lib/types"
import { useI18n } from "@/lib/i18n/context"
import { formatPrice, getCurrencyLabel } from "@/lib/utils"

interface TripMapProps {
  roadmap: RoadmapData
}

export function TripMap({ roadmap }: TripMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const { locale } = useI18n()
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const polylineRef = useRef<any>(null)
  const leafletRef = useRef<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentCityIndex, setCurrentCityIndex] = useState(0)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Dynamically import Leaflet
    const initMap = async () => {
      try {
        const L = (await import("leaflet")).default
        leafletRef.current = L

        // Add Leaflet CSS
        if (!document.getElementById("leaflet-css")) {
          const link = document.createElement("link")
          link.id = "leaflet-css"
          link.rel = "stylesheet"
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          document.head.appendChild(link)
        }

        // Wait for CSS to load
        await new Promise((resolve) => setTimeout(resolve, 100))

        // Calculate bounds
        const lats = roadmap.cities.map((c) => c.coordinates.lat)
        const lngs = roadmap.cities.map((c) => c.coordinates.lng)
        const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2
        const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2

        // Create map with minimal style
        const map = L.map(mapRef.current!, {
          center: [centerLat, centerLng],
          zoom: 6,
          zoomControl: false,
          attributionControl: false,
        })

        // Add minimal grayscale tile layer
        L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
          maxZoom: 19,
        }).addTo(map)

        // Add zoom control to bottom right
        L.control.zoom({ position: "bottomright" }).addTo(map)

        // Create custom markers
        const markers: any[] = []
        roadmap.cities.forEach((city, index) => {
          const isActive = index === 0

          // Custom marker icon
          const markerIcon = L.divIcon({
            className: "custom-marker",
            html: `
              <div class="relative flex items-center justify-center">
                <div class="absolute w-8 h-8 bg-primary/20 rounded-full animate-ping" style="display: ${isActive ? "block" : "none"}"></div>
                <div class="relative w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm shadow-lg transition-all" style="background: ${isActive ? "hsl(142, 71%, 35%)" : "white"}; color: ${isActive ? "white" : "black"}; border-color: ${isActive ? "hsl(142, 71%, 35%)" : "#e5e7eb"};">
                  ${index + 1}
                </div>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          })

          const marker = L.marker([city.coordinates.lat, city.coordinates.lng], {
            icon: markerIcon,
          }).addTo(map)

          // Add tooltip
          marker.bindTooltip(
            `
            <div class="font-sans">
              <div class="font-semibold">${city.name}</div>
              <div class="text-xs text-gray-500">${city.days} days • ${formatPrice(city.costs.total, locale)} ${getCurrencyLabel(locale)}</div>
            </div>
          `,
            {
              direction: "top",
              offset: [0, -20],
              className: "custom-tooltip",
            },
          )

          markers.push({ marker, city, index })
        })

        markersRef.current = markers

        // Draw route line
        const routeCoords = roadmap.cities.map((c) => [c.coordinates.lat, c.coordinates.lng] as [number, number])
        const polyline = L.polyline(routeCoords, {
          color: "hsl(142, 71%, 35%)",
          weight: 3,
          opacity: 0.7,
          dashArray: "10, 10",
          lineCap: "round",
        }).addTo(map)

        polylineRef.current = polyline

        // Add transport icons on route
        roadmap.transport.forEach((t) => {
          const fromCity = roadmap.cities.find((c) => c.id === t.from)
          const toCity = roadmap.cities.find((c) => c.id === t.to)
          if (!fromCity || !toCity) return

          const midLat = (fromCity.coordinates.lat + toCity.coordinates.lat) / 2
          const midLng = (fromCity.coordinates.lng + toCity.coordinates.lng) / 2

          const transportIcon = L.divIcon({
            className: "transport-icon",
            html: `
              <div class="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-xs border border-gray-200">
                ${t.type === "flight" ? "✈️" : t.type === "ferry" ? "⛴️" : t.type === "train" ? "🚆" : "🚌"}
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          })

          L.marker([midLat, midLng], { icon: transportIcon, interactive: false }).addTo(map)
        })

        // Fit bounds with padding
        map.fitBounds(polyline.getBounds(), { padding: [50, 50] })

        mapInstanceRef.current = map
        setMapLoaded(true)
      } catch (error) {
        console.error("Failed to initialize map:", error)
      }
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [roadmap])

  // Update markers when current city changes
  useEffect(() => {
    if (!mapLoaded || !markersRef.current.length || !leafletRef.current) return

    const L = leafletRef.current

    markersRef.current.forEach(({ marker, index }) => {
      const isActive = index === currentCityIndex

      const newIcon = L.divIcon({
        className: "custom-marker",
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-8 h-8 bg-primary/20 rounded-full animate-ping" style="display: ${isActive ? "block" : "none"}"></div>
            <div class="relative w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm shadow-lg transition-all" style="background: ${isActive ? "hsl(142, 71%, 35%)" : "white"}; color: ${isActive ? "white" : "black"}; border-color: ${isActive ? "hsl(142, 71%, 35%)" : "#e5e7eb"}; transform: scale(${isActive ? 1.1 : 1});">
              ${index + 1}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })

      marker.setIcon(newIcon)
    })

    // Pan to current city
    if (markersRef.current[currentCityIndex]) {
      const city = roadmap.cities[currentCityIndex]
      mapInstanceRef.current?.panTo([city.coordinates.lat, city.coordinates.lng], { animate: true })
    }
  }, [currentCityIndex, mapLoaded, roadmap.cities])

  // Play animation
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentCityIndex((prev) => {
        if (prev >= roadmap.cities.length - 1) {
          setIsPlaying(false)
          return 0
        }
        return prev + 1
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [isPlaying, roadmap.cities.length])

  const handleReset = () => {
    setCurrentCityIndex(0)
    setIsPlaying(false)
    if (mapInstanceRef.current && polylineRef.current) {
      mapInstanceRef.current.fitBounds(polylineRef.current.getBounds(), { padding: [50, 50] })
    }
  }

  const currentCity = roadmap.cities[currentCityIndex]

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/30 py-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2 font-serif text-lg">
            <MapPin className="size-5 text-primary" />
            Trip Route Map
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)} className="gap-1.5">
              {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1.5">
              <RotateCcw className="size-3.5" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Map Container */}
        <div className="relative">
          <div ref={mapRef} className="h-[350px] w-full sm:h-[400px]" />

          {/* Current City Info Overlay */}
          {currentCity && (
            <div className="absolute bottom-4 inset-x-4 z-[1000] sm:start-4 sm:end-auto">
              <div className="rounded-xl bg-background/95 p-3 shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {currentCityIndex + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold">{currentCity.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {currentCity.days} days • {formatPrice(currentCity.costs.total, locale)} {getCurrencyLabel(locale)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* City Progress Dots */}
          <div className="absolute end-4 top-4 z-[1000]">
            <div className="flex flex-col gap-1.5 rounded-lg bg-background/95 p-2 shadow-lg backdrop-blur-sm">
              {roadmap.cities.map((city, index) => (
                <button
                  key={city.id}
                  onClick={() => setCurrentCityIndex(index)}
                  className={`group flex items-center gap-2 rounded-md px-2 py-1 text-start transition-colors ${
                    index === currentCityIndex ? "bg-primary/10" : "hover:bg-muted"
                  }`}
                >
                  <div
                    className={`size-2 rounded-full transition-colors ${
                      index === currentCityIndex
                        ? "bg-primary"
                        : index < currentCityIndex
                          ? "bg-primary/50"
                          : "bg-muted-foreground/30"
                    }`}
                  />
                  <span
                    className={`text-xs ${index === currentCityIndex ? "font-medium text-foreground" : "text-muted-foreground"}`}
                  >
                    {city.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Transport Info */}
        <div className="border-t bg-muted/20 p-3">
          <div className="flex flex-wrap gap-2">
            {roadmap.transport.map((t, i) => {
              const fromCity = roadmap.cities.find((c) => c.id === t.from)
              const toCity = roadmap.cities.find((c) => c.id === t.to)
              return (
                <Badge key={i} variant="outline" className="gap-1.5 py-1">
                  <span>{t.type === "flight" ? "✈️" : t.type === "ferry" ? "⛴️" : "🚌"}</span>
                  <span className="font-normal">
                    {fromCity?.name} → {toCity?.name}
                  </span>
                  <span className="text-muted-foreground">• {t.duration}</span>
                </Badge>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
