"""Admin panel schemas."""
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


# ── Dashboard ──────────────────────────────────────────────
class DashboardStats(BaseModel):
    total_users: int = 0
    total_itineraries: int = 0
    total_bookings: int = 0
    total_revenue: float = 0.0
    active_users: int = 0
    published_itineraries: int = 0
    pending_reviews: int = 0
    new_users_today: int = 0
    new_users_this_week: int = 0
    new_users_this_month: int = 0
    bookings_this_month: int = 0
    revenue_this_month: float = 0.0


class RecentActivity(BaseModel):
    id: str
    type: str            # "user_registered" | "itinerary_created" | "booking" | "review"
    description: str
    user: Optional[str] = None
    timestamp: datetime


class MonthlyStats(BaseModel):
    month: str           # e.g. "2026-01"
    users: int = 0
    itineraries: int = 0
    bookings: int = 0
    revenue: float = 0.0


# ── User Management ───────────────────────────────────────
class AdminUserResponse(BaseModel):
    id: UUID
    email: str
    username: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    role: str
    is_active: bool
    is_verified: bool
    country: Optional[str] = None
    travel_styles: list[str] = []
    trips_shared: int = 0
    created_at: datetime

    class Config:
        from_attributes = True


class AdminUserUpdate(BaseModel):
    role: Optional[str] = None
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None
    full_name: Optional[str] = None


class PaginatedUsers(BaseModel):
    users: list[AdminUserResponse]
    total: int
    page: int
    per_page: int
    total_pages: int


# ── Itinerary Management ─────────────────────────────────
class AdminItineraryResponse(BaseModel):
    id: UUID
    title: str
    destination: str
    country: str
    duration: int
    price: float
    plan_type: str
    is_published: bool
    is_verified: bool
    rating: float
    review_count: int
    views_count: int
    purchases_count: int
    creator_username: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class AdminItineraryUpdate(BaseModel):
    is_published: Optional[bool] = None
    is_verified: Optional[bool] = None
    is_premium: Optional[bool] = None


class PaginatedItineraries(BaseModel):
    itineraries: list[AdminItineraryResponse]
    total: int
    page: int
    per_page: int
    total_pages: int


# ── Booking Management ────────────────────────────────────
class AdminBookingResponse(BaseModel):
    id: UUID
    user_email: str
    itinerary_title: str
    status: str
    amount: float
    currency: str
    payment_method: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PaginatedBookings(BaseModel):
    bookings: list[AdminBookingResponse]
    total: int
    page: int
    per_page: int
    total_pages: int


# ── Review Management ─────────────────────────────────────
class AdminReviewResponse(BaseModel):
    id: UUID
    user_email: str
    itinerary_title: str
    rating: int
    title: Optional[str] = None
    comment: Optional[str] = None
    is_verified: bool
    helpful_count: int
    created_at: datetime

    class Config:
        from_attributes = True


class PaginatedReviews(BaseModel):
    reviews: list[AdminReviewResponse]
    total: int
    page: int
    per_page: int
    total_pages: int
