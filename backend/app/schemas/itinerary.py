from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime


# ===== Activity Schemas =====

class ActivityCreate(BaseModel):
    title: str
    description: Optional[str] = None
    location: Optional[str] = None
    coordinates: Optional[Dict[str, float]] = None
    activity_type: str = "activity"
    time_period: Optional[str] = None
    sort_order: int = 0
    image: Optional[str] = None
    cost: float = 0
    duration: Optional[str] = None
    tips: Optional[str] = None
    transport_options: Optional[List[Dict]] = None
    alternatives: Optional[List[Dict]] = None


class ActivityResponse(BaseModel):
    id: UUID
    title: str
    description: Optional[str]
    location: Optional[str]
    coordinates: Optional[Dict]
    activity_type: str
    time_period: Optional[str]
    image: Optional[str]
    cost: float
    duration: Optional[str]
    tips: Optional[str]
    transport_options: Optional[List[Dict]]
    alternatives: Optional[List[Dict]]
    traveler_photos: List[str]
    
    class Config:
        from_attributes = True


# ===== Trip Day Schemas =====

class TripDayCreate(BaseModel):
    day_number: int
    title: Optional[str] = None
    description: Optional[str] = None
    activities: List[ActivityCreate] = []


class TripDayResponse(BaseModel):
    id: UUID
    day_number: int
    title: Optional[str]
    description: Optional[str]
    activities: List[ActivityResponse]
    
    class Config:
        from_attributes = True


# ===== Checklist Schemas =====

class ChecklistItemCreate(BaseModel):
    category: str
    title: str
    description: Optional[str] = None
    priority: str = "medium"
    link: Optional[str] = None


class ChecklistItemResponse(BaseModel):
    id: UUID
    category: str
    title: str
    description: Optional[str]
    priority: str
    link: Optional[str]
    
    class Config:
        from_attributes = True


# ===== Accommodation Schemas =====

class AccommodationCreate(BaseModel):
    name: str
    accommodation_type: Optional[str] = None
    image: Optional[str] = None
    price_per_night: Optional[float] = None
    rating: Optional[float] = None
    neighborhood: Optional[str] = None
    amenities: List[str] = []
    popular_with: List[str] = []


class AccommodationResponse(BaseModel):
    id: UUID
    name: str
    accommodation_type: Optional[str]
    image: Optional[str]
    price_per_night: Optional[float]
    rating: Optional[float]
    review_count: int
    neighborhood: Optional[str]
    amenities: List[str]
    popular_with: List[str]
    
    class Config:
        from_attributes = True


# ===== Itinerary Schemas =====

class ItineraryCreate(BaseModel):
    title: str = Field(max_length=300)
    description: Optional[str] = None
    highlight: Optional[str] = None
    cover_image: Optional[str] = None
    destination: str
    country: str
    city: Optional[str] = None
    coordinates: Optional[Dict[str, float]] = None
    duration: int = Field(ge=1, le=90)
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    budget_level: Optional[str] = None
    currency: str = "CAD"
    difficulty: str = "Easy"
    best_season: Optional[str] = None
    suitable_for: List[str] = []
    travel_styles: List[str] = []
    plan_type: str = "raw"
    price: float = 0
    days: List[TripDayCreate] = []
    checklist_items: List[ChecklistItemCreate] = []
    accommodations: List[AccommodationCreate] = []


class ItineraryResponse(BaseModel):
    id: UUID
    creator_id: UUID
    title: str
    slug: str
    description: Optional[str]
    highlight: Optional[str]
    cover_image: Optional[str]
    destination: str
    country: str
    city: Optional[str]
    duration: int
    budget_min: Optional[float]
    budget_max: Optional[float]
    budget_level: Optional[str]
    currency: str
    difficulty: Optional[str]
    best_season: Optional[str]
    suitable_for: List[str]
    travel_styles: List[str]
    plan_type: str
    price: float
    is_premium: bool
    personality_scores: Optional[Dict]
    rating: float
    review_count: int
    is_published: bool
    is_verified: bool
    views_count: int
    purchases_count: int
    created_at: datetime
    updated_at: datetime
    
    # Nested
    days: List[TripDayResponse] = []
    checklist_items: List[ChecklistItemResponse] = []
    accommodations: List[AccommodationResponse] = []
    
    class Config:
        from_attributes = True


class ItineraryListResponse(BaseModel):
    """Lightweight version for list views."""
    id: UUID
    title: str
    slug: str
    destination: str
    country: str
    duration: int
    budget_min: Optional[float]
    budget_max: Optional[float]
    cover_image: Optional[str]
    travel_styles: List[str]
    plan_type: str
    price: float
    rating: float
    review_count: int
    highlight: Optional[str]
    is_premium: bool
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class ItinerarySearchQuery(BaseModel):
    query: Optional[str] = None
    destination: Optional[str] = None
    country: Optional[str] = None
    plan_type: Optional[str] = None
    min_budget: Optional[float] = None
    max_budget: Optional[float] = None
    min_duration: Optional[int] = None
    max_duration: Optional[int] = None
    difficulty: Optional[str] = None
    travel_styles: Optional[List[str]] = None
    sort_by: str = "popular"  # popular, rating, price_low, price_high, newest
    page: int = 1
    per_page: int = 12
