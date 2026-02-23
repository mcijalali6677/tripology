import { NextResponse } from "next/server"
import { headers } from "next/headers"
import type { ItineraryListItem } from "@/lib/types"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://tripology7.shop/api/v1"

const IRAN_CODES = ["IR"]

/** Detect if request originates from Iran using headers */
function isIranianRequest(request: Request): boolean {
  const h = Object.fromEntries(request.headers.entries())
  const country =
    h["x-vercel-ip-country"] || h["cf-ipcountry"] || h["x-country-code"] || ""
  if (IRAN_CODES.includes(country.toUpperCase())) return true
  // Also check the locale query param as a client-side hint
  const url = new URL(request.url)
  return url.searchParams.get("locale") === "fa"
}

/**
 * GET /api/itineraries — Returns itinerary list for marketplace.
 * Tries Python backend first, falls back to static data.
 * If user is from Iran (or locale=fa), serves Iranian itineraries.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const planType = searchParams.get("planType")
  const sortBy = searchParams.get("sortBy") || "popular"
  const isIran = isIranianRequest(request)

  // Try Python backend first
  try {
    const backendUrl = new URL(`${API_BASE}/itineraries`)
    if (planType) backendUrl.searchParams.set("plan_type", planType)
    backendUrl.searchParams.set("sort_by", sortBy)
    backendUrl.searchParams.set("per_page", "50")
    if (isIran) backendUrl.searchParams.set("country", "Iran")

    const res = await fetch(backendUrl.toString(), {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(3000),
    })
    if (res.ok) {
      const data = await res.json()
      if (data && data.length > 0) {
        return NextResponse.json(data, {
          headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
        })
      }
    }
  } catch {
    // Backend not available, use fallback data
  }

  // Fallback: return static data (loaded server-side only)
  let items: ItineraryListItem[]

  if (isIran) {
    const { iranianFallbackItineraries } = await import("@/lib/data/itineraries-iran")
    items = iranianFallbackItineraries
  } else {
    const { fallbackItineraries } = await import("@/lib/data/itineraries")
    items = fallbackItineraries
  }

  if (planType && planType !== "all") {
    items = items.filter(i => i.planType === planType)
  }

  return NextResponse.json(items, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  })
}
