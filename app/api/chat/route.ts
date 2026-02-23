/**
 * Chat API route — proxies to self-hosted FastAPI backend (Ollama LLM).
 * Falls back to smart OpenStreetMap-powered responses when backend is unavailable.
 */

import { getSmartLocationResponse } from "./location-ai"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const maxDuration = 60;

export async function POST(req: Request) {
  const body = await req.json();
  const { messages, sessionId, location, locale } = body;

  // Extract latest user message
  const lastUserMsg =
    [...(messages || [])].reverse().find((m: { role: string }) => m.role === "user")?.content || "";

  // Prepend location context to the message if available
  const locationContext = location
    ? `[User location: ${location.address || `${location.lat}, ${location.lng}`}] `
    : "";
  const enrichedMsg = locationContext + lastUserMsg;

  // If we have a sessionId, use the streaming endpoint
  const targetSessionId = sessionId || "default";

  try {
    // Try to create a session if we don't have one
    let sid = sessionId;
    if (!sid) {
      const token = req.headers.get("authorization");
      const sessionRes = await fetch(`${API_BASE}/chat/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: token } : {}),
        },
        body: JSON.stringify({ title: "Web Chat" }),
        signal: AbortSignal.timeout(5000),
      });
      if (sessionRes.ok) {
        const session = await sessionRes.json();
        sid = session.id;
      }
    }

    if (sid) {
      const token = req.headers.get("authorization");
      const streamRes = await fetch(`${API_BASE}/chat/sessions/${sid}/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: token } : {}),
        },
        body: JSON.stringify({ message: enrichedMsg }),
        signal: AbortSignal.timeout(30000),
      });

      if (streamRes.ok && streamRes.body) {
        return new Response(streamRes.body, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        });
      }
    }

    // Fallback: call the non-streaming message endpoint
    const token = req.headers.get("authorization");
    const msgRes = await fetch(`${API_BASE}/chat/sessions/${sid || targetSessionId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
      body: JSON.stringify({ message: enrichedMsg }),
      signal: AbortSignal.timeout(15000),
    });

    if (msgRes.ok) {
      const data = await msgRes.json();
      return Response.json({ role: "assistant", content: data.response });
    }

    throw new Error("Backend unreachable");
  } catch (error) {
    // Smart fallback: use OpenStreetMap data to respond with real nearby places
    try {
      const smartResponse = await getSmartLocationResponse(
        lastUserMsg,
        location ? { lat: location.lat, lng: location.lng, address: location.address } : undefined,
        locale || "fa"
      );
      if (smartResponse) {
        return Response.json({ role: "assistant", content: smartResponse });
      }
    } catch {
      // If even the smart fallback fails, return error status
    }

    return Response.json(
      { role: "assistant", error: "backend_unavailable" },
      { status: 503 }
    );
  }
}
