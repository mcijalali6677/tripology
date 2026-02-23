/**
 * Swap Activity API route — proxies to self-hosted FastAPI backend (Ollama LLM).
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function POST(req: Request) {
  const { currentActivity, dayTitle, destination, travelStyle } = await req.json();

  try {
    const token = req.headers.get("authorization");
    const response = await fetch(`${API_BASE}/ai/swap-activity`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
      body: JSON.stringify({
        current_activity: {
          title: currentActivity.title,
          description: currentActivity.description,
          location: currentActivity.location || destination,
          type: currentActivity.type || "activity",
        },
        day_theme: dayTitle || "General Exploration",
        destination: destination || "Paris",
        travel_style: travelStyle || "cultural",
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return Response.json(data.alternatives || data);
    }

    throw new Error(`Backend returned ${response.status}`);
  } catch (error) {
    console.error("Swap activity fallback:", error);

    // Fallback alternatives
    const alternatives = [
      {
        title: `Alternative: ${currentActivity.title} variation`,
        description: `A similar experience near ${destination || "the area"}`,
        location: destination || "Paris",
        type: "activity",
        cost: 15,
        image: "/paris-montmartre-streets.jpg",
      },
      {
        title: "Local Hidden Gem",
        description: "A lesser-known spot recommended by locals",
        location: destination || "Paris",
        type: "experience",
        cost: 0,
        image: "/paris-cafe-terrace.jpg",
      },
      {
        title: "Relaxation Break",
        description: "Take it easy with a cafe visit or park stroll",
        location: destination || "Paris",
        type: "cafe",
        cost: 10,
        image: "/paris-seine-river.jpg",
      },
    ];

    return Response.json(alternatives);
  }
}
