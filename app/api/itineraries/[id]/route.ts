import { NextResponse } from "next/server"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1"

/**
 * GET /api/itineraries/[id] — Returns full itinerary details.
 * Tries Python backend first, falls back to static data.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Try Python backend first
  try {
    const res = await fetch(`${API_BASE}/itineraries/${id}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(3000),
    })
    if (res.ok) {
      const data = await res.json()
      if (data) {
        return NextResponse.json(data, {
          headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
        })
      }
    }
  } catch {
    // Backend not available
  }

  // Fallback: static data
  const { fallbackItinerariesFull } = await import("@/lib/data/itineraries")
  const itinerary = fallbackItinerariesFull.find(i => i.id === id)

  if (!itinerary) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(itinerary, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  })
}
