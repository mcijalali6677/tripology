import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Boolean, DateTime, Text, Float, Integer,
    ForeignKey, JSON, Enum as SQLEnum, Index
)
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from app.database import Base
import enum


class PlanType(str, enum.Enum):
    RAW = "raw"
    AI_OPTIMIZED = "ai-optimized"


class DifficultyLevel(str, enum.Enum):
    EASY = "Easy"
    MODERATE = "Moderate"
    CHALLENGING = "Challenging"


class BudgetLevel(str, enum.Enum):
    BUDGET = "Budget"
    MID_RANGE = "Mid-range"
    LUXURY = "Luxury"


class Itinerary(Base):
    __tablename__ = "itineraries"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    creator_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Basic Info
    title = Column(String(300), nullable=False, index=True)
    slug = Column(String(350), unique=True, nullable=False, index=True)
    description = Column(Text)
    highlight = Column(Text)
    cover_image = Column(String(500))
    
    # Destination
    destination = Column(String(255), nullable=False, index=True)
    country = Column(String(100), nullable=False, index=True)
    city = Column(String(100))
    coordinates = Column(JSON)  # {lat, lng}
    
    # Trip Details
    duration = Column(Integer, nullable=False)  # days
    budget_min = Column(Float)
    budget_max = Column(Float)
    budget_level = Column(SQLEnum(BudgetLevel))
    currency = Column(String(10), default="CAD")
    difficulty = Column(SQLEnum(DifficultyLevel), default=DifficultyLevel.EASY)
    best_season = Column(String(255))
    suitable_for = Column(ARRAY(String), default=[])
    travel_styles = Column(ARRAY(String), default=[])
    
    # Plan Type
    plan_type = Column(SQLEnum(PlanType), default=PlanType.RAW, nullable=False)
    price = Column(Float, default=0)  # Price to buy this itinerary
    is_premium = Column(Boolean, default=False)
    
    # AI Data
    personality_scores = Column(JSON, nullable=True)
    ai_travelers_count = Column(Integer, default=0)
    ai_last_updated = Column(String(50))
    
    # Ratings
    rating = Column(Float, default=0)
    review_count = Column(Integer, default=0)
    
    # Status
    is_published = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    views_count = Column(Integer, default=0)
    purchases_count = Column(Integer, default=0)
    
    # Vector embedding for semantic search (768-dim for nomic-embed-text)
    embedding = Column(Vector(768), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    published_at = Column(DateTime, nullable=True)
    
    # Relationships
    creator = relationship("User", back_populates="itineraries")
    days = relationship("TripDay", back_populates="itinerary", cascade="all, delete-orphan", order_by="TripDay.day_number", lazy="selectin")
    reviews = relationship("Review", back_populates="itinerary", lazy="selectin")
    checklist_items = relationship("ChecklistItem", back_populates="itinerary", cascade="all, delete-orphan", lazy="selectin")
    accommodations = relationship("Accommodation", back_populates="itinerary", cascade="all, delete-orphan", lazy="selectin")
    bookings = relationship("Booking", back_populates="itinerary", lazy="selectin")
    
    __table_args__ = (
        Index("idx_itineraries_destination", "destination"),
        Index("idx_itineraries_plan_type", "plan_type"),
        Index("idx_itineraries_published", "is_published"),
        Index("idx_itineraries_rating", "rating"),
    )


class TripDay(Base):
    __tablename__ = "trip_days"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    itinerary_id = Column(UUID(as_uuid=True), ForeignKey("itineraries.id", ondelete="CASCADE"), nullable=False)
    
    day_number = Column(Integer, nullable=False)
    title = Column(String(255))
    description = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    itinerary = relationship("Itinerary", back_populates="days")
    activities = relationship("Activity", back_populates="trip_day", cascade="all, delete-orphan", order_by="Activity.sort_order", lazy="selectin")


class ActivityType(str, enum.Enum):
    ACTIVITY = "activity"
    FOOD = "food"
    TRANSPORT = "transport"
    ACCOMMODATION = "accommodation"
    EXPERIENCE = "experience"


class TimePeriod(str, enum.Enum):
    EARLY_MORNING = "early_morning"
    MORNING = "morning"
    MIDDAY = "midday"
    AFTERNOON = "afternoon"
    EVENING = "evening"
    NIGHT = "night"


class Activity(Base):
    __tablename__ = "activities"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trip_day_id = Column(UUID(as_uuid=True), ForeignKey("trip_days.id", ondelete="CASCADE"), nullable=False)
    
    title = Column(String(300), nullable=False)
    description = Column(Text)
    location = Column(String(255))
    coordinates = Column(JSON)  # {lat, lng}
    
    activity_type = Column(SQLEnum(ActivityType), default=ActivityType.ACTIVITY)
    time_period = Column(SQLEnum(TimePeriod))
    sort_order = Column(Integer, default=0)
    
    image = Column(String(500))
    cost = Column(Float, default=0)
    duration = Column(String(100))
    tips = Column(Text)
    
    # Transport to next activity
    transport_options = Column(JSON, nullable=True)  # [{type, duration, cost, description}]
    
    # Alternative activities
    alternatives = Column(JSON, nullable=True)  # [{title, description, cost, ...}]
    
    # Traveler photos
    traveler_photos = Column(ARRAY(String), default=[])
    
    # Vector embedding for activity search
    embedding = Column(Vector(768), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    trip_day = relationship("TripDay", back_populates="activities")


class ChecklistItem(Base):
    __tablename__ = "checklist_items"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    itinerary_id = Column(UUID(as_uuid=True), ForeignKey("itineraries.id", ondelete="CASCADE"), nullable=False)
    
    category = Column(String(50), nullable=False)  # essential, packing, documents, booking
    title = Column(String(300), nullable=False)
    description = Column(Text)
    priority = Column(String(20), default="medium")  # high, medium, low
    link = Column(String(500), nullable=True)
    
    itinerary = relationship("Itinerary", back_populates="checklist_items")


class Accommodation(Base):
    __tablename__ = "accommodations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    itinerary_id = Column(UUID(as_uuid=True), ForeignKey("itineraries.id", ondelete="CASCADE"), nullable=False)
    
    name = Column(String(300), nullable=False)
    accommodation_type = Column(String(50))  # hotel, airbnb, hostel, boutique
    image = Column(String(500))
    price_per_night = Column(Float)
    rating = Column(Float)
    review_count = Column(Integer, default=0)
    neighborhood = Column(String(255))
    amenities = Column(ARRAY(String), default=[])
    popular_with = Column(ARRAY(String), default=[])
    
    itinerary = relationship("Itinerary", back_populates="accommodations")
