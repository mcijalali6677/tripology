/**
 * Smart location-based AI using OpenStreetMap Overpass API.
 * Returns structured POI data + formatted text for the chat.
 */

export interface Location {
  lat: number
  lng: number
  address?: string
}

export interface POI {
  name: string
  nameEn?: string
  type: string
  category: string
  distance: number
  lat: number
  lng: number
}

export interface SmartResponse {
  text: string
  pois: POI[]
  category?: string
  categoryLabel?: string
}

interface IntentMatch {
  category: string
  label: string
  labelFa: string
  icon: string
  overpassQuery: string
}

// ── Intent Detection ─────────────────────────────
const INTENTS: IntentMatch[] = [
  {
    category: "cafe",
    label: "cafes",
    labelFa: "کافه‌ها",
    icon: "☕",
    overpassQuery: `node["amenity"="cafe"](around:RADIUS,LAT,LNG);`,
  },
  {
    category: "restaurant",
    label: "restaurants",
    labelFa: "رستوران‌ها",
    icon: "🍽️",
    overpassQuery: `node["amenity"="restaurant"](around:RADIUS,LAT,LNG);node["amenity"="fast_food"](around:RADIUS,LAT,LNG);`,
  },
  {
    category: "park",
    label: "parks & nature",
    labelFa: "پارک‌ها و فضاهای سبز",
    icon: "🌳",
    overpassQuery: `node["leisure"="park"](around:RADIUS,LAT,LNG);way["leisure"="park"](around:RADIUS,LAT,LNG);node["leisure"="garden"](around:RADIUS,LAT,LNG);`,
  },
  {
    category: "attraction",
    label: "attractions",
    labelFa: "جاذبه‌های گردشگری",
    icon: "🏛️",
    overpassQuery: `node["tourism"](around:RADIUS,LAT,LNG);node["historic"](around:RADIUS,LAT,LNG);node["amenity"="place_of_worship"](around:RADIUS,LAT,LNG);`,
  },
  {
    category: "shopping",
    label: "shopping",
    labelFa: "مراکز خرید",
    icon: "🛍️",
    overpassQuery: `node["shop"="mall"](around:RADIUS,LAT,LNG);node["shop"="supermarket"](around:RADIUS,LAT,LNG);node["shop"="department_store"](around:RADIUS,LAT,LNG);node["shop"="clothes"](around:RADIUS,LAT,LNG);way["shop"="mall"](around:RADIUS,LAT,LNG);`,
  },
  {
    category: "entertainment",
    label: "entertainment",
    labelFa: "مراکز تفریحی",
    icon: "🎭",
    overpassQuery: `node["amenity"="cinema"](around:RADIUS,LAT,LNG);node["amenity"="theatre"](around:RADIUS,LAT,LNG);node["leisure"="amusement_arcade"](around:RADIUS,LAT,LNG);node["leisure"="fitness_centre"](around:RADIUS,LAT,LNG);node["leisure"="bowling_alley"](around:RADIUS,LAT,LNG);node["leisure"="swimming_pool"](around:RADIUS,LAT,LNG);`,
  },
]

const KEYWORD_MAP: Record<string, string[]> = {
  cafe: ["cafe", "coffee", "کافه", "قهوه", "کافی"],
  restaurant: ["restaurant", "food", "lunch", "dinner", "eat", "رستوران", "غذا", "ناهار", "شام", "غذاخوری"],
  park: ["park", "nature", "green", "garden", "پارک", "طبیعت", "سبز", "فضای سبز", "باغ"],
  attraction: ["attraction", "landmark", "tourist", "museum", "monument", "جاذبه", "دیدنی", "موزه", "گردشگری", "تاریخی", "بنا"],
  shopping: ["shop", "shopping", "mall", "store", "market", "خرید", "فروشگاه", "مال", "مرکز خرید", "بازار", "پاساژ"],
  entertainment: ["entertainment", "fun", "cinema", "theater", "game", "تفریح", "سرگرم", "سینما", "تئاتر", "بازی", "تفریحی", "استخر", "بولینگ"],
}

function detectIntent(message: string): IntentMatch | null {
  const lower = message.toLowerCase()
  for (const [category, keywords] of Object.entries(KEYWORD_MAP)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return INTENTS.find((i) => i.category === category) || null
    }
  }
  if (lower.includes("nearby") || lower.includes("نزدیک") || lower.includes("اطراف")) {
    return INTENTS.find((i) => i.category === "attraction") || null
  }
  return null
}

// ── Distance ─────────────────────────────────────
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// ── Overpass API (multi-mirror) ──────────────────
const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
]

async function queryOverpass(intent: IntentMatch, location: Location, radius = 3000): Promise<POI[]> {
  const query = intent.overpassQuery
    .replace(/RADIUS/g, String(radius))
    .replace(/LAT/g, String(location.lat))
    .replace(/LNG/g, String(location.lng))

  const fullQuery = `[out:json][timeout:25];(${query});out center 20;`

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(fullQuery)}`,
        signal: AbortSignal.timeout(15000),
      })
      if (!res.ok) continue
      const text = await res.text()
      if (text.startsWith("<")) continue
      const data = JSON.parse(text)

      const pois: POI[] = []
      for (const el of data.elements || []) {
        const lat = el.lat ?? el.center?.lat
        const lng = el.lon ?? el.center?.lon
        if (!lat || !lng) continue
        const tags = el.tags || {}
        const name = tags["name:fa"] || tags["name:ar"] || tags.name || tags["name:en"]
        if (!name) continue
        pois.push({
          name,
          nameEn: tags["name:en"],
          type: tags.amenity || tags.tourism || tags.leisure || tags.shop || tags.historic || intent.category,
          category: intent.category,
          distance: Math.round(haversineDistance(location.lat, location.lng, lat, lng)),
          lat,
          lng,
        })
      }
      pois.sort((a, b) => a.distance - b.distance)
      const seen = new Set<string>()
      return pois.filter((p) => {
        const k = p.name.toLowerCase()
        if (seen.has(k)) return false
        seen.add(k)
        return true
      }).slice(0, 8)
    } catch {
      continue
    }
  }
  return queryNominatim(intent, location)
}

// ── Nominatim fallback ───────────────────────────
const NOMINATIM_TERMS: Record<string, string[]> = {
  cafe: ["cafe", "coffee"],
  restaurant: ["restaurant"],
  park: ["park", "garden"],
  attraction: ["museum", "monument", "mosque", "palace"],
  shopping: ["mall", "shopping center", "bazaar"],
  entertainment: ["cinema", "theater", "amusement"],
}

async function queryNominatim(intent: IntentMatch, location: Location): Promise<POI[]> {
  const terms = NOMINATIM_TERMS[intent.category] || [intent.category]
  const all: POI[] = []
  const d = 0.02

  for (const term of terms.slice(0, 2)) {
    try {
      const url = new URL("https://nominatim.openstreetmap.org/search")
      url.searchParams.set("q", term)
      url.searchParams.set("format", "json")
      url.searchParams.set("limit", "10")
      url.searchParams.set("bounded", "1")
      url.searchParams.set("viewbox", `${location.lng - d},${location.lat + d},${location.lng + d},${location.lat - d}`)
      url.searchParams.set("accept-language", "fa,en")
      url.searchParams.set("addressdetails", "1")
      const res = await fetch(url.toString(), {
        headers: { "User-Agent": "Tripology/1.0" },
        signal: AbortSignal.timeout(8000),
      })
      if (!res.ok) continue
      const results = await res.json()
      for (const r of results) {
        const lat = parseFloat(r.lat)
        const lng = parseFloat(r.lon)
        if (!lat || !lng) continue
        all.push({
          name: r.display_name?.split(",")[0] || r.name || term,
          nameEn: r.namedetails?.["name:en"],
          type: intent.category,
          category: intent.category,
          distance: Math.round(haversineDistance(location.lat, location.lng, lat, lng)),
          lat,
          lng,
        })
      }
    } catch { continue }
  }
  all.sort((a, b) => a.distance - b.distance)
  const seen = new Set<string>()
  return all.filter((p) => {
    const k = p.name.toLowerCase()
    if (seen.has(k)) return false
    seen.add(k)
    return true
  }).slice(0, 8)
}

// ── Main Export ──────────────────────────────────
export async function getSmartLocationResponse(
  message: string,
  location?: Location,
  locale = "fa"
): Promise<SmartResponse> {
  const intent = detectIntent(message)

  if (!intent) {
    const text = locale === "fa"
      ? location
        ? `از دکمه‌های زیر برای پیدا کردن مکان‌های نزدیک استفاده کنید.`
        : `لطفاً دسترسی موقعیت مکانی را فعال کنید.`
      : location
        ? `Use the buttons below to find nearby places.`
        : `Please enable location access.`
    return { text, pois: [] }
  }

  if (!location) {
    const text = locale === "fa"
      ? `برای پیدا کردن ${intent.labelFa}، لطفاً دسترسی موقعیت مکانی را فعال کنید.`
      : `To find ${intent.label}, please enable location access.`
    return { text, pois: [], category: intent.category, categoryLabel: locale === "fa" ? intent.labelFa : intent.label }
  }

  const pois = await queryOverpass(intent, location)
  const catLabel = locale === "fa" ? intent.labelFa : intent.label

  const text = pois.length === 0
    ? (locale === "fa"
      ? `متأسفانه ${intent.labelFa} در نزدیکی شما پیدا نشد.`
      : `No ${intent.label} found near you.`)
    : (locale === "fa"
      ? `${intent.icon} ${pois.length} ${intent.labelFa} نزدیک شما پیدا شد:`
      : `${intent.icon} Found ${pois.length} ${intent.label} near you:`)

  return { text, pois, category: intent.category, categoryLabel: catLabel }
}
