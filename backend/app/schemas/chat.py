from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime


# ===== Chat Schemas =====

class ChatSessionCreate(BaseModel):
    title: Optional[str] = "New Chat"
    context: Optional[Dict[str, Any]] = None  # {destination, budget, ...}


class ChatSessionResponse(BaseModel):
    id: UUID
    title: str
    context: Optional[Dict]
    message_count: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ChatMessageRequest(BaseModel):
    message: str = Field(max_length=2000)
    destination: Optional[str] = None


class ChatMessageResponse(BaseModel):
    id: UUID
    role: str
    content: str
    model_used: Optional[str]
    latency_ms: Optional[int]
    sources: Optional[List[Dict]] = None  # RAG sources
    created_at: datetime
    
    class Config:
        from_attributes = True


class ChatStreamEvent(BaseModel):
    """SSE event for streaming chat."""
    type: str  # "token", "done", "error", "sources"
    content: Optional[str] = None
    sources: Optional[List[Dict]] = None


# ===== AI Generation Schemas =====

class GenerateItineraryRequest(BaseModel):
    basket: List[Dict[str, Any]]
    trip_days: int = Field(ge=1, le=30)
    travelers: int = Field(ge=1, le=20)
    destination: str = "Paris, France"
    start_date: str = "2026-03-14"
    budget_level: str = "mid"


class SwapActivityRequest(BaseModel):
    current_activity: Dict[str, Any]
    day_theme: str
    destination: str
    travel_style: str = "general"


class RecommendationRequest(BaseModel):
    personality_scores: Optional[Dict[str, str]] = None
    travel_styles: Optional[List[str]] = None
    budget_range: Optional[Dict[str, float]] = None
    preferred_duration: Optional[int] = None
    query: Optional[str] = None


class RecommendationResponse(BaseModel):
    itinerary_id: str
    title: str
    destination: str
    match_score: float
    reasons: List[str]


# ===== Review Schemas =====

class ReviewCreate(BaseModel):
    rating: float = Field(ge=1, le=5)
    title: Optional[str] = None
    comment: Optional[str] = None
    trip_type: Optional[str] = None


class ReviewResponse(BaseModel):
    id: UUID
    user_id: UUID
    rating: float
    title: Optional[str]
    comment: Optional[str]
    trip_type: Optional[str]
    is_verified: bool
    helpful_count: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# ===== Booking Schemas =====

class BookingCreate(BaseModel):
    itinerary_id: UUID
    payment_method: str = "stripe"


class BookingResponse(BaseModel):
    id: UUID
    user_id: UUID
    itinerary_id: UUID
    status: str
    amount: float
    currency: str
    payment_method: Optional[str]
    created_at: datetime
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True
