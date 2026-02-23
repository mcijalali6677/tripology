import { NextResponse } from "next/server"

/**
 * Geo-detection API route.
 * Uses request headers (x-forwarded-for, cf-ipcountry, etc.) to detect
 * if the user is coming from Iran (IR) and returns the suggested locale.
 *
 * Fallback: uses a free IP geolocation API when headers are unavailable.
 */

// Iranian IP ranges (CIDR) — simplified check via known Iranian ASNs
// In production, Cloudflare / Vercel automatically sets cf-ipcountry or x-vercel-ip-country
const IRAN_COUNTRY_CODES = ["IR"]

export async function GET(request: Request) {
  const headers = Object.fromEntries(request.headers.entries())

  // 1. Try platform-level country headers (Vercel, Cloudflare, Nginx)
  const country =
    headers["x-vercel-ip-country"] ||
    headers["cf-ipcountry"] ||
    headers["x-country-code"] ||
    ""

  if (IRAN_COUNTRY_CODES.includes(country.toUpperCase())) {
    return NextResponse.json({ country: "IR", locale: "fa", isIran: true })
  }

  // 2. Fallback: check IP via free geolocation API
  const forwarded = headers["x-forwarded-for"]
  const ip = forwarded ? forwarded.split(",")[0].trim() : headers["x-real-ip"] || ""

  if (ip && ip !== "127.0.0.1" && ip !== "::1") {
    try {
      const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`, {
        signal: AbortSignal.timeout(2000),
      })
      if (geoRes.ok) {
        const geo = await geoRes.json()
        if (geo.countryCode && IRAN_COUNTRY_CODES.includes(geo.countryCode.toUpperCase())) {
          return NextResponse.json({ country: "IR", locale: "fa", isIran: true })
        }
        return NextResponse.json({ country: geo.countryCode || "US", locale: "en", isIran: false })
      }
    } catch {
      // Timeout or network error — fall through to default
    }
  }

  return NextResponse.json({ country: country || "US", locale: "en", isIran: false })
}
