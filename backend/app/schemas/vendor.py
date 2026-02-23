from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from enum import Enum


class VendorTypeEnum(str, Enum):
    HOTEL = "hotel"
    AIRLINE = "airline"
    TOUR_AGENCY = "tour_agency"
    CAR_RENTAL = "car_rental"
    RESTAURANT = "restaurant"
    HOMESTAY = "homestay"
    TRAVEL_INSURANCE = "travel_insurance"
    VISA_SERVICE = "visa_service"
    LOCAL_GUIDE = "local_guide"
    TRANSPORT = "transport"
    OTHER = "other"


class VendorStatusEnum(str, Enum):
    PENDING = "pending"
    DOCUMENTS_REQUIRED = "documents_required"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    SUSPENDED = "suspended"


class DocumentInfo(BaseModel):
    type: str  # "license", "national_id", "tax_certificate", "other"
    url: str
    verified: bool = False


class VendorRegisterRequest(BaseModel):
    business_name: str = Field(min_length=2, max_length=255)
    business_name_fa: Optional[str] = None
    vendor_type: VendorTypeEnum
    description: Optional[str] = None
    description_fa: Optional[str] = None
    phone: str = Field(min_length=8, max_length=20)
    website: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    province: Optional[str] = None
    license_number: Optional[str] = None
    national_id: Optional[str] = None
    tax_id: Optional[str] = None


class VendorResponse(BaseModel):
    id: UUID
    user_id: UUID
    business_name: str
    business_name_fa: Optional[str]
    vendor_type: str
    description: Optional[str]
    description_fa: Optional[str]
    phone: str
    website: Optional[str]
    address: Optional[str]
    city: Optional[str]
    province: Optional[str]
    license_number: Optional[str]
    logo_url: Optional[str]
    banner_url: Optional[str]
    status: str
    commission_rate: float
    total_listings: float
    total_sales: float
    total_revenue: float
    rating: float
    review_count: float
    verified_at: Optional[datetime]
    rejection_reason: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class VendorListResponse(BaseModel):
    id: UUID
    business_name: str
    business_name_fa: Optional[str]
    vendor_type: str
    city: Optional[str]
    province: Optional[str]
    status: str
    rating: float
    review_count: float
    total_listings: float
    logo_url: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class VendorUpdateRequest(BaseModel):
    business_name: Optional[str] = None
    business_name_fa: Optional[str] = None
    description: Optional[str] = None
    description_fa: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    province: Optional[str] = None
    license_number: Optional[str] = None
    national_id: Optional[str] = None
    tax_id: Optional[str] = None


class AdminVendorAction(BaseModel):
    status: VendorStatusEnum
    rejection_reason: Optional[str] = None
    admin_notes: Optional[str] = None
    commission_rate: Optional[float] = None
