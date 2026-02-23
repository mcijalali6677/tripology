/**
 * Generate Itinerary API route — proxies to self-hosted FastAPI backend (Ollama LLM).
 * Falls back to a demo itinerary if backend is unreachable.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const maxDuration = 120;

export async function POST(req: Request) {
  const { basket, tripDays, travelers, destination } = await req.json();

  try {
    const token = req.headers.get("authorization");
    const response = await fetch(`${API_BASE}/ai/generate-itinerary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
      body: JSON.stringify({
        basket: basket.map((item: { title: string; description?: string; duration?: string; cost?: number; category?: string; date?: string }) => ({
          title: item.title,
          description: item.description,
          category: item.category,
          duration: item.duration,
          cost: item.cost,
          date: item.date,
        })),
        trip_days: tripDays,
        travelers,
        destination: destination || "Paris, France",
        start_date: "2026-03-14",
        budget_level: "mid-range",
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return Response.json(data);
    }

    throw new Error(`Backend returned ${response.status}`);
  } catch (error) {
    console.error("Backend unreachable, returning demo itinerary:", error);

    // Fallback demo itinerary
    const demoItinerary = {
      title: `${destination || "Paris"} Adventure`,
      summary: `A ${tripDays}-day journey through ${destination || "Paris, France"} for ${travelers} travelers.`,
      totalDays: tripDays,
      estimatedTotalCost: basket.reduce((sum: number, item: { cost?: number }) => sum + (item.cost || 0), 0),
      days: Array.from({ length: Math.min(tripDays, 3) }, (_, i) => ({
        dayNumber: i + 1,
        date: `Day ${i + 1}`,
        theme: i === 0 ? "Arrival & Exploration" : i === 1 ? "Cultural Discovery" : "Local Experiences",
        activities: [
          {
            timePeriod: "morning",
            title: basket[i % basket.length]?.title || "Morning Activity",
            description: basket[i % basket.length]?.description || "Explore the city",
            location: destination || "Paris",
            duration: "2-3h",
            type: "activity",
            estimatedCost: basket[i % basket.length]?.cost || 0,
            tips: "Arrive early to avoid crowds",
          },
          {
            timePeriod: "midday",
            title: "Local Lunch",
            description: "Try local cuisine at a recommended restaurant",
            location: destination || "Paris",
            duration: "1.5h",
            type: "restaurant",
            estimatedCost: 25,
            tips: "Ask for the daily special",
          },
          {
            timePeriod: "afternoon",
            title: basket[(i + 1) % basket.length]?.title || "Afternoon Activity",
            description: basket[(i + 1) % basket.length]?.description || "Continue exploring",
            location: destination || "Paris",
            duration: "2h",
            type: "activity",
            estimatedCost: basket[(i + 1) % basket.length]?.cost || 0,
            tips: "Great for photos in afternoon light",
          },
        ],
      })),
      packingTips: [
        "Comfortable walking shoes",
        "Light layers for variable weather",
        "Portable charger",
        "Universal adapter",
        "Reusable water bottle",
      ],
      localTips: [
        "Learn basic local greetings",
        "Use public transportation",
        "Eat where locals eat",
        "Carry cash for small vendors",
        "Download offline maps",
      ],
      checklist: [
        { id: "c1", category: "book", title: "Book flights", description: "Search for best deals", completed: false, link: null },
        { id: "c2", category: "book", title: "Reserve accommodation", description: "Book hotels or Airbnb", completed: false, link: null },
        { id: "c3", category: "prepare", title: "Check passport validity", description: "Must be valid 6+ months", completed: false, link: null },
        { id: "c4", category: "buy", title: "Travel insurance", description: "Get comprehensive coverage", completed: false, link: null },
        { id: "c5", category: "pack", title: "Pack essentials", description: "Clothes, toiletries, electronics", completed: false, link: null },
      ],
    };

    return Response.json(demoItinerary);
  }
}
