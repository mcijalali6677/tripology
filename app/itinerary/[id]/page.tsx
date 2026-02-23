import ItineraryDetailPageClient from "./client"
import RawTripDetailClient from "./raw-trip-client"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://tripology7.shop"
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://tripology7.shop/api/v1"

export async function generateStaticParams() {
  try {
    const res = await fetch(`${SITE_URL}/api/itineraries`, { next: { revalidate: 3600 } })
    if (res.ok) {
      const data = await res.json()
      return (data as { id: string }[]).map((i) => ({ id: i.id }))
    }
  } catch {
    // fallback IDs
  }
  return [
    { id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }, { id: "6" },
    { id: "raw-1" }, { id: "raw-2" }, { id: "raw-3" }, { id: "raw-4" },
  ]
}

async function fetchItinerary(id: string) {
  // Try Python backend
  try {
    const res = await fetch(`${API_BASE}/itineraries/${id}`, {
      next: { revalidate: 60 },
    })
    if (res.ok) {
      return await res.json()
    }
  } catch {
    // Backend not available
  }
  // Fallback to Next.js API route (which serves server-side data)
  try {
    const res = await fetch(`${SITE_URL}/api/itineraries/${id}`, {
      next: { revalidate: 60 },
    })
    if (res.ok) {
      return await res.json()
    }
  } catch {
    // API route not available either
  }
  return null
}

export default async function ItineraryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const itinerary = await fetchItinerary(id)

  if (!itinerary) {
    return <ItineraryDetailPageClient itinerary={null} />
  }

  // Use different client for raw traveler plans
  if (itinerary.planType === "raw") {
    return <RawTripDetailClient itinerary={itinerary} />
  }

  return <ItineraryDetailPageClient itinerary={itinerary} />
}
