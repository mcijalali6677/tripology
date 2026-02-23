/**
 * Chat API route — proxies to self-hosted FastAPI backend (Ollama LLM).
 * Falls back to smart OpenStreetMap-powered responses when backend is unavailable.
 */

import { getSmartLocationResponse } from "./location-ai"

// Use internal URL for server-side requests to avoid double-proxying through Nginx
const API_BASE = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export const maxDuration = 180;

export async function POST(req: Request) {
  const body = await req.json();
  const { messages, message, sessionId, location, locale } = body;

  // Extract latest user message (support both formats)
  const lastUserMsg = message ||
    [...(messages || [])].reverse().find((m: { role: string }) => m.role === "user")?.content || "";

  // Build locale instruction so LLM responds in the user's language
  const LOCALE_NAMES: Record<string, string> = {
    fa: "Persian (Farsi)",
    ar: "Arabic",
    fr: "French",
    en: "English",
  };
  const userLocale = locale || "fa";
  const localeInstruction = userLocale !== "en"
    ? `[IMPORTANT: Respond entirely in ${LOCALE_NAMES[userLocale] || userLocale}. Do NOT respond in English.] `
    : "";

  // Prepend location context to the message if available
  const locationContext = location
    ? `[User location: ${location.address || `${location.lat}, ${location.lng}`}] `
    : "";
  const enrichedMsg = localeInstruction + locationContext + lastUserMsg;

  const token = req.headers.get("authorization");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: token } : {}),
  };

  try {
    // 1. Create or reuse session
    let sid = sessionId;
    if (!sid) {
      const sessionRes = await fetch(`${API_BASE}/chat/sessions`, {
        method: "POST",
        headers,
        body: JSON.stringify({ title: lastUserMsg.slice(0, 80) || "Web Chat" }),
        signal: AbortSignal.timeout(8000),
      });
      if (sessionRes.ok) {
        const session = await sessionRes.json();
        sid = session.id;
      }
    }

    if (!sid) throw new Error("Could not create chat session");

    // 2. Stream response from backend
    const streamRes = await fetch(`${API_BASE}/chat/sessions/${sid}/stream`, {
      method: "POST",
      headers,
      body: JSON.stringify({ message: enrichedMsg }),
      signal: AbortSignal.timeout(180000),
    });

    if (streamRes.ok && streamRes.body) {
      // Pass backend SSE stream directly to the client (no intermediate buffering).
      // SessionId is sent as a response header to avoid needing a TransformStream.
      return new Response(streamRes.body, {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          "X-Accel-Buffering": "no",
          "X-Session-Id": sid,
        },
      });
    }

    // 3. Fallback: non-streaming
    const msgRes = await fetch(`${API_BASE}/chat/sessions/${sid}/messages`, {
      method: "POST",
      headers,
      body: JSON.stringify({ message: enrichedMsg }),
      signal: AbortSignal.timeout(30000),
    });

    if (msgRes.ok) {
      const data = await msgRes.json();
      // Return as SSE-formatted response so the frontend parser works uniformly
      const ssePayload = [
        `data: ${JSON.stringify({ sessionId: sid })}\n\n`,
        `data: ${JSON.stringify({ token: data.response })}\n\n`,
        `data: ${JSON.stringify({ done: true, content: data.response })}\n\n`,
      ].join("");
      return new Response(ssePayload, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "X-Session-Id": sid,
        },
      });
    }

    throw new Error(`Backend error: ${streamRes.status}`);
  } catch (error) {
    console.error("[chat] Backend error, using smart fallback:", error);
    
    // Smart fallback: use OpenStreetMap data to respond with real nearby places
    try {
      const smartResponse = await getSmartLocationResponse(
        lastUserMsg,
        location ? { lat: location.lat, lng: location.lng, address: location.address } : undefined,
        locale || "fa"
      );
      if (smartResponse) {
        return Response.json({ role: "assistant", content: smartResponse, fallback: true });
      }
    } catch {
      // If even the smart fallback fails, return error status
    }

    return Response.json(
      { role: "assistant", content: "متأسفانه در حال حاضر سرویس هوش مصنوعی در دسترس نیست. لطفاً دقایقی دیگر تلاش کنید.", error: "backend_unavailable" },
      { status: 503 }
    );
  }
}
