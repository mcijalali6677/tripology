import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Boolean, DateTime, Text, Float,
    ForeignKey, JSON, Enum as SQLEnum, Index
)
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class VendorType(str, enum.Enum):
    HOTEL = "hotel"
    AIRLINE = "airline"
    TOUR_AGENCY = "tour_agency"
    CAR_RENTAL = "car_rental"
    RESTAURANT = "restaurant"
    HOMESTAY = "homestay"          # خانه‌های اقامتی
    TRAVEL_INSURANCE = "travel_insurance"
    VISA_SERVICE = "visa_service"
    LOCAL_GUIDE = "local_guide"
    TRANSPORT = "transport"        # اتوبوس، قطار، ...
    OTHER = "other"


class VendorStatus(str, enum.Enum):
    PENDING = "pending"           # در انتظار بررسی
    DOCUMENTS_REQUIRED = "documents_required"  # نیاز به مدارک بیشتر
    UNDER_REVIEW = "under_review"  # در حال بررسی
    APPROVED = "approved"         # تایید شده
    REJECTED = "rejected"         # رد شده
    SUSPENDED = "suspended"       # تعلیق شده


class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)

    # Business Info
    business_name = Column(String(255), nullable=False)
    business_name_fa = Column(String(255), nullable=True)  # نام فارسی
    vendor_type = Column(SQLEnum(VendorType), nullable=False)
    description = Column(Text, nullable=True)
    description_fa = Column(Text, nullable=True)

    # Contact Info
    phone = Column(String(20), nullable=False)
    website = Column(String(500), nullable=True)
    address = Column(Text, nullable=True)
    city = Column(String(100), nullable=True)
    province = Column(String(100), nullable=True)

    # Business Documents
    license_number = Column(String(100), nullable=True)
    national_id = Column(String(20), nullable=True)  # کد ملی مدیر
    tax_id = Column(String(50), nullable=True)        # شناسه مالیاتی
    documents = Column(JSON, default=[])               # Array of {type, url, verified}

    # Logo & branding
    logo_url = Column(String(500), nullable=True)
    banner_url = Column(String(500), nullable=True)

    # Verification & Status
    status = Column(SQLEnum(VendorStatus), default=VendorStatus.PENDING, nullable=False)
    verified_at = Column(DateTime, nullable=True)
    rejection_reason = Column(Text, nullable=True)
    admin_notes = Column(Text, nullable=True)

    # Commission
    commission_rate = Column(Float, default=15.0)  # درصد کمیسیون (پیش‌فرض ۱۵٪)

    # Stats
    total_listings = Column(Float, default=0)
    total_sales = Column(Float, default=0)
    total_revenue = Column(Float, default=0)
    rating = Column(Float, default=0)
    review_count = Column(Float, default=0)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", backref="vendor_profile")

    __table_args__ = (
        Index("idx_vendors_status", "status"),
        Index("idx_vendors_type", "vendor_type"),
        Index("idx_vendors_user", "user_id"),
    )
