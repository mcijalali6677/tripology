import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, DateTime, Text, Float, Integer,
    ForeignKey, Boolean, Enum as SQLEnum, Index
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class BookingStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    REFUNDED = "refunded"
    CANCELLED = "cancelled"


class Booking(Base):
    """When a user purchases an itinerary."""
    __tablename__ = "bookings"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    itinerary_id = Column(UUID(as_uuid=True), ForeignKey("itineraries.id", ondelete="CASCADE"), nullable=False)
    
    status = Column(SQLEnum(BookingStatus), default=BookingStatus.PENDING)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="CAD")
    
    # Payment
    payment_method = Column(String(50))  # stripe, apple_pay, google_pay
    payment_id = Column(String(255), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    user = relationship("User", back_populates="bookings")
    itinerary = relationship("Itinerary", back_populates="bookings")
    
    __table_args__ = (
        Index("idx_bookings_user", "user_id"),
        Index("idx_bookings_status", "status"),
    )


class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    itinerary_id = Column(UUID(as_uuid=True), ForeignKey("itineraries.id", ondelete="CASCADE"), nullable=False)
    
    rating = Column(Float, nullable=False)
    title = Column(String(300))
    comment = Column(Text)
    trip_type = Column(String(50))  # solo, couple, family, friends
    
    is_verified = Column(Boolean, default=False)  # verified purchase
    helpful_count = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="reviews")
    itinerary = relationship("Itinerary", back_populates="reviews")
    
    __table_args__ = (
        Index("idx_reviews_itinerary", "itinerary_id"),
        Index("idx_reviews_rating", "rating"),
    )
