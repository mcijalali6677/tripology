from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime


# ===== Auth Schemas =====

class RegisterRequest(BaseModel):
    email: EmailStr
    username: str = Field(min_length=3, max_length=100)
    password: str = Field(min_length=8, max_length=128)
    full_name: Optional[str] = None
    device_type: Optional[str] = None  # "ios", "android", "web"
    device_name: Optional[str] = None


class LoginRequest(BaseModel):
    email: Optional[str] = None  # email or username
    username: Optional[str] = None
    password: str
    device_type: Optional[str] = None
    device_name: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds


class RefreshRequest(BaseModel):
    refresh_token: str


# ===== User Schemas =====

class UserResponse(BaseModel):
    id: UUID
    email: str
    username: str
    full_name: Optional[str]
    avatar_url: Optional[str]
    bio: Optional[str]
    country: Optional[str]
    role: str
    travel_styles: List[str]
    trips_shared: int
    personality_scores: Optional[dict]
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    country: Optional[str] = None
    avatar_url: Optional[str] = None
    travel_styles: Optional[List[str]] = None


class PersonalityQuizResult(BaseModel):
    adventure: str  # high, medium, low
    culinary: str
    budget: str
    relaxation: str
    cultural: str
    nature: str
