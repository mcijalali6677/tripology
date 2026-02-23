import { NextResponse } from "next/server"

/**
 * GET /api/activities/paris — Returns Paris activity categories for custom-trip builder.
 * Data stays server-side, never in client JS bundle.
 */
export async function GET() {
  const { parisData } = await import("@/lib/paris-data")

  return NextResponse.json(parisData, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
  })
}
