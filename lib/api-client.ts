/**
 * Tripology API Client
 * Connects the Next.js frontend to the self-hosted FastAPI backend.
 *
 * When accessing from mobile on LAN, the browser's hostname is the LAN IP,
 * so we dynamically build the API URL to match the current host.
 */
function getApiBase(): string {
  // 1. Explicit env var always wins (set by run-tripology.bat)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // 2. In browser: use same hostname as the page (works for both localhost & LAN IP)
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    return `http://${host}:8001/api/v1`;
  }
  // 3. Server-side fallback
  return "http://localhost:8001/api/v1";
}

const API_BASE = getApiBase();

// ===== Token Management =====

let accessToken: string | null = null;
let refreshToken: string | null = null;

export function setTokens(access: string, refresh: string) {
  accessToken = access;
  refreshToken = refresh;
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  }
}

export function getTokens() {
  if (typeof window !== "undefined" && !accessToken) {
    accessToken = localStorage.getItem("access_token");
    refreshToken = localStorage.getItem("refresh_token");
  }
  return { accessToken, refreshToken };
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
}

// ===== Core Fetch =====

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  requireAuth = false
): Promise<T> {
  const { accessToken: token } = getTokens();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else if (requireAuth) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle token refresh on 401
  if (response.status === 401 && refreshToken) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      headers["Authorization"] = `Bearer ${accessToken}`;
      const retryResponse = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });
      if (!retryResponse.ok) {
        throw new ApiError(retryResponse.status, await retryResponse.text());
      }
      return retryResponse.json();
    }
    clearTokens();
    throw new Error("Session expired. Please login again.");
  }

  if (!response.ok) {
    const errorBody = await response.text();
    throw new ApiError(response.status, errorBody);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

async function refreshAccessToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (response.ok) {
      const data = await response.json();
      setTokens(data.access_token, data.refresh_token);
      return true;
    }
  } catch {}
  return false;
}

class ApiError extends Error {
  status: number;
  body: string;
  constructor(status: number, body: string) {
    super(`API Error ${status}: ${body}`);
    this.status = status;
    this.body = body;
  }
}

// ===== Auth API =====

export const authApi = {
  register: (data: {
    email: string;
    username: string;
    password: string;
    full_name?: string;
    device_type?: string;
  }) =>
    apiFetch<{ access_token: string; refresh_token: string; expires_in: number }>(
      "/auth/register",
      { method: "POST", body: JSON.stringify(data) }
    ).then((res) => {
      setTokens(res.access_token, res.refresh_token);
      return res;
    }),

  login: (data: {
    email?: string;
    username?: string;
    password: string;
    device_type?: string;
  }) =>
    apiFetch<{ access_token: string; refresh_token: string; expires_in: number }>(
      "/auth/login",
      { method: "POST", body: JSON.stringify(data) }
    ).then((res) => {
      setTokens(res.access_token, res.refresh_token);
      return res;
    }),

  logout: () => {
    const { refreshToken: rt } = getTokens();
    if (rt) {
      apiFetch("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refresh_token: rt }),
      }, true).catch(() => {});
    }
    clearTokens();
  },

  getMe: () => apiFetch<UserProfile>("/auth/me", {}, true),
};

// ===== Users API =====

export const usersApi = {
  getProfile: () => apiFetch<UserProfile>("/users/me", {}, true),

  updateProfile: (data: Partial<UserProfile>) =>
    apiFetch<UserProfile>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    }, true),

  savePersonality: (scores: PersonalityScores) =>
    apiFetch<UserProfile>("/users/me/personality", {
      method: "POST",
      body: JSON.stringify(scores),
    }, true),
};

// ===== Itineraries API =====

export const itinerariesApi = {
  list: (params?: ItinerarySearchParams) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return apiFetch<ItineraryListItem[]>(`/itineraries${query ? `?${query}` : ""}`);
  },

  get: (id: string) => apiFetch<ItineraryDetail>(`/itineraries/${id}`),

  create: (data: CreateItineraryData) =>
    apiFetch<ItineraryDetail>("/itineraries", {
      method: "POST",
      body: JSON.stringify(data),
    }, true),

  publish: (id: string) =>
    apiFetch(`/itineraries/${id}/publish`, { method: "PATCH" }, true),

  delete: (id: string) =>
    apiFetch(`/itineraries/${id}`, { method: "DELETE" }, true),
};

// ===== AI Chat API =====

export const chatApi = {
  createSession: (data?: { title?: string; context?: Record<string, unknown> }) =>
    apiFetch<ChatSession>("/chat/sessions", {
      method: "POST",
      body: JSON.stringify(data || {}),
    }, true),

  listSessions: () => apiFetch<ChatSession[]>("/chat/sessions", {}, true),

  sendMessage: (sessionId: string, message: string, destination?: string) =>
    apiFetch<ChatResponse>(`/chat/sessions/${sessionId}/messages`, {
      method: "POST",
      body: JSON.stringify({ message, destination }),
    }, true),

  /**
   * Send message with streaming response (SSE).
   * Returns a ReadableStream of tokens.
   */
  sendMessageStream: async (
    sessionId: string,
    message: string,
    destination?: string,
    onToken?: (token: string) => void,
    onDone?: () => void,
    onError?: (error: string) => void
  ) => {
    const { accessToken: token } = getTokens();
    const response = await fetch(
      `${API_BASE}/chat/sessions/${sessionId}/stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message, destination }),
      }
    );

    if (!response.ok) {
      throw new Error(`Chat stream failed: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) throw new Error("No response body");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === "token" && onToken) {
              onToken(data.content);
            } else if (data.type === "done" && onDone) {
              onDone();
            } else if (data.type === "error" && onError) {
              onError(data.content);
            }
          } catch {}
        }
      }
    }
  },
};

// ===== AI Generation API =====

export const aiApi = {
  generateItinerary: (data: {
    basket: BasketItem[];
    trip_days: number;
    travelers: number;
    destination?: string;
    start_date?: string;
    budget_level?: string;
  }) =>
    apiFetch<GeneratedItinerary>("/ai/generate-itinerary", {
      method: "POST",
      body: JSON.stringify(data),
    }, true),

  swapActivity: (data: {
    current_activity: Record<string, unknown>;
    day_theme: string;
    destination: string;
    travel_style?: string;
  }) =>
    apiFetch<{ alternatives: ActivityAlternative[] }>("/ai/swap-activity", {
      method: "POST",
      body: JSON.stringify(data),
    }, true),

  getRecommendations: (data?: {
    personality_scores?: PersonalityScores;
    travel_styles?: string[];
    budget_range?: { min: number; max: number };
    query?: string;
  }) =>
    apiFetch<Recommendation[]>("/ai/recommendations", {
      method: "POST",
      body: JSON.stringify(data || {}),
    }, true),

  healthCheck: () => apiFetch<AIHealthStatus>("/ai/health"),
};

// ===== Search API =====

export const searchApi = {
  search: (q: string, destination?: string, limit?: number) => {
    const params = new URLSearchParams({ q });
    if (destination) params.set("destination", destination);
    if (limit) params.set("limit", String(limit));
    return apiFetch<ItineraryListItem[]>(`/search?${params}`);
  },

  searchKnowledge: (q: string, destination?: string, category?: string) => {
    const params = new URLSearchParams({ q });
    if (destination) params.set("destination", destination);
    if (category) params.set("category", category);
    return apiFetch<{ results: KnowledgeChunk[]; total: number }>(
      `/search/knowledge?${params}`
    );
  },
};

// ===== Bookings API =====

export const bookingsApi = {
  purchase: (itineraryId: string, paymentMethod = "stripe") =>
    apiFetch<BookingRecord>("/bookings", {
      method: "POST",
      body: JSON.stringify({
        itinerary_id: itineraryId,
        payment_method: paymentMethod,
      }),
    }, true),

  list: () => apiFetch<BookingRecord[]>("/bookings", {}, true),
};

// ===== Reviews API =====

export const reviewsApi = {
  create: (itineraryId: string, data: { rating: number; title?: string; comment?: string; trip_type?: string }) =>
    apiFetch<ReviewRecord>(`/itineraries/${itineraryId}/reviews`, {
      method: "POST",
      body: JSON.stringify(data),
    }, true),

  list: (itineraryId: string) =>
    apiFetch<ReviewRecord[]>(`/itineraries/${itineraryId}/reviews`),
};

// ===== Types =====

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  country: string | null;
  role: string;
  travel_styles: string[];
  trips_shared: number;
  personality_scores: PersonalityScores | null;
  created_at: string;
}

export interface PersonalityScores {
  adventure: "high" | "medium" | "low";
  culinary: "high" | "medium" | "low";
  budget: "high" | "medium" | "low";
  relaxation: "high" | "medium" | "low";
  cultural: "high" | "medium" | "low";
  nature: "high" | "medium" | "low";
}

export interface ItinerarySearchParams {
  destination?: string;
  country?: string;
  plan_type?: string;
  min_budget?: number;
  max_budget?: number;
  difficulty?: string;
  travel_styles?: string;
  sort_by?: string;
  page?: number;
  per_page?: number;
}

export interface ItineraryListItem {
  id: string;
  title: string;
  slug: string;
  destination: string;
  country: string;
  duration: number;
  budget_min: number | null;
  budget_max: number | null;
  cover_image: string | null;
  travel_styles: string[];
  plan_type: string;
  price: number;
  rating: number;
  review_count: number;
  highlight: string | null;
  is_premium: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface ItineraryDetail extends ItineraryListItem {
  creator_id: string;
  description: string | null;
  city: string | null;
  budget_level: string | null;
  currency: string;
  difficulty: string | null;
  best_season: string | null;
  suitable_for: string[];
  personality_scores: Record<string, string> | null;
  is_published: boolean;
  views_count: number;
  purchases_count: number;
  updated_at: string;
  days: TripDayData[];
  checklist_items: ChecklistItemData[];
  accommodations: AccommodationData[];
}

export interface TripDayData {
  id: string;
  day_number: number;
  title: string | null;
  description: string | null;
  activities: ActivityData[];
}

export interface ActivityData {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  coordinates: { lat: number; lng: number } | null;
  activity_type: string;
  time_period: string | null;
  image: string | null;
  cost: number;
  duration: string | null;
  tips: string | null;
  transport_options: Record<string, unknown>[] | null;
  alternatives: Record<string, unknown>[] | null;
  traveler_photos: string[];
}

export interface ChecklistItemData {
  id: string;
  category: string;
  title: string;
  description: string | null;
  priority: string;
  link: string | null;
}

export interface AccommodationData {
  id: string;
  name: string;
  accommodation_type: string | null;
  image: string | null;
  price_per_night: number | null;
  rating: number | null;
  review_count: number;
  neighborhood: string | null;
  amenities: string[];
  popular_with: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  context: Record<string, unknown> | null;
  message_count: number;
  created_at: string;
  updated_at: string;
}

export interface ChatResponse {
  response: string;
  sources: KnowledgeChunk[];
  latency_ms: number;
}

export interface KnowledgeChunk {
  id: string;
  title: string;
  content: string;
  source: string;
  category: string;
  destination: string;
  similarity: number;
}

export interface BasketItem {
  title: string;
  description?: string;
  category?: string;
  duration?: string;
  cost?: number;
  date?: string;
}

export interface GeneratedItinerary {
  title: string;
  summary: string;
  totalDays: number;
  estimatedTotalCost: number;
  days: {
    dayNumber: number;
    date: string;
    theme: string;
    activities: {
      timePeriod: string;
      title: string;
      description: string;
      location: string;
      duration: string;
      type: string;
      estimatedCost: number;
      tips: string;
    }[];
  }[];
  packingTips: string[];
  localTips: string[];
  checklist: {
    id: string;
    category: string;
    title: string;
    description: string;
    completed: boolean;
  }[];
}

export interface ActivityAlternative {
  title: string;
  description: string;
  location: string;
  type: string;
  cost: number;
  duration: string;
}

export interface Recommendation {
  itinerary_id: string;
  title: string;
  destination: string;
  match_score: number;
  reasons: string[];
}

export interface AIHealthStatus {
  llm: { status: string; model?: string; model_loaded?: boolean };
  embeddings: { status: string; model?: string; dimensions?: number };
  overall: string;
}

export interface BookingRecord {
  id: string;
  user_id: string;
  itinerary_id: string;
  status: string;
  amount: number;
  currency: string;
  payment_method: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface ReviewRecord {
  id: string;
  user_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  trip_type: string | null;
  is_verified: boolean;
  helpful_count: number;
  created_at: string;
}

export interface CreateItineraryData {
  title: string;
  description?: string;
  highlight?: string;
  cover_image?: string;
  destination: string;
  country: string;
  city?: string;
  duration: number;
  budget_min?: number;
  budget_max?: number;
  budget_level?: string;
  difficulty?: string;
  best_season?: string;
  suitable_for?: string[];
  travel_styles?: string[];
  plan_type?: string;
  price?: number;
  days?: {
    day_number: number;
    title?: string;
    description?: string;
    activities?: {
      title: string;
      description?: string;
      location?: string;
      activity_type?: string;
      time_period?: string;
      cost?: number;
      duration?: string;
      tips?: string;
    }[];
  }[];
}
