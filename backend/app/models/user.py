import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Boolean, DateTime, Text, Float, Integer, 
    ForeignKey, JSON, Enum as SQLEnum, Index
)
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class UserRole(str, enum.Enum):
    TRAVELER = "traveler"
    CREATOR = "creator"     # Can submit itineraries
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    avatar_url = Column(String(500))
    bio = Column(Text)
    country = Column(String(100))
    
    # Role & Status
    role = Column(SQLEnum(UserRole), default=UserRole.TRAVELER, nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # Travel Profile
    travel_styles = Column(ARRAY(String), default=[])
    languages = Column(ARRAY(String), default=[])
    trips_shared = Column(Integer, default=0)
    
    # Personality Quiz Results
    personality_scores = Column(JSON, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    
    # Relationships
    itineraries = relationship("Itinerary", back_populates="creator", lazy="selectin")
    reviews = relationship("Review", back_populates="user", lazy="selectin")
    bookings = relationship("Booking", back_populates="user", lazy="selectin")
    chat_sessions = relationship("ChatSession", back_populates="user", lazy="selectin")
    refresh_tokens = relationship("RefreshToken", back_populates="user", lazy="selectin")
    
    __table_args__ = (
        Index("idx_users_email", "email"),
        Index("idx_users_role", "role"),
    )


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token = Column(String(500), unique=True, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
    is_revoked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Device info (for mobile)
    device_name = Column(String(255), nullable=True)
    device_type = Column(String(50), nullable=True)  # "ios", "android", "web"
    
    user = relationship("User", back_populates="refresh_tokens")
