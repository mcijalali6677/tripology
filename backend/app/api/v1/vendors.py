"""Vendor registration & management endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from uuid import UUID
from datetime import datetime

from app.database import get_db
from app.models.vendor import Vendor, VendorStatus, VendorType
from app.models.user import User, UserRole
from app.schemas.vendor import (
    VendorRegisterRequest,
    VendorResponse,
    VendorListResponse,
    VendorUpdateRequest,
    AdminVendorAction,
)
from app.api.v1.auth import get_current_user

router = APIRouter(prefix="/vendors", tags=["vendors"])


@router.post("/register", response_model=VendorResponse, status_code=status.HTTP_201_CREATED)
async def register_vendor(
    data: VendorRegisterRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Register as a vendor (requires authentication)."""
    # Check if already registered as vendor
    existing = await db.execute(
        select(Vendor).where(Vendor.user_id == current_user.id)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already registered as a vendor.",
        )

    vendor = Vendor(
        user_id=current_user.id,
        business_name=data.business_name,
        business_name_fa=data.business_name_fa,
        vendor_type=VendorType(data.vendor_type.value),
        description=data.description,
        description_fa=data.description_fa,
        phone=data.phone,
        website=data.website,
        address=data.address,
        city=data.city,
        province=data.province,
        license_number=data.license_number,
        national_id=data.national_id,
        tax_id=data.tax_id,
        status=VendorStatus.PENDING,
    )
    db.add(vendor)
    await db.commit()
    await db.refresh(vendor)
    return vendor


@router.get("/me", response_model=VendorResponse)
async def get_my_vendor_profile(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get current user's vendor profile."""
    result = await db.execute(
        select(Vendor).where(Vendor.user_id == current_user.id)
    )
    vendor = result.scalar_one_or_none()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor profile not found.")
    return vendor


@router.put("/me", response_model=VendorResponse)
async def update_my_vendor_profile(
    data: VendorUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update current user's vendor profile."""
    result = await db.execute(
        select(Vendor).where(Vendor.user_id == current_user.id)
    )
    vendor = result.scalar_one_or_none()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor profile not found.")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(vendor, field, value)

    await db.commit()
    await db.refresh(vendor)
    return vendor


@router.get("/", response_model=list[VendorListResponse])
async def list_approved_vendors(
    vendor_type: str | None = None,
    city: str | None = None,
    limit: int = 50,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
):
    """List approved vendors (public)."""
    query = select(Vendor).where(Vendor.status == VendorStatus.APPROVED)
    if vendor_type:
        query = query.where(Vendor.vendor_type == VendorType(vendor_type))
    if city:
        query = query.where(Vendor.city.ilike(f"%{city}%"))
    query = query.order_by(Vendor.rating.desc()).offset(offset).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/stats")
async def vendor_stats(db: AsyncSession = Depends(get_db)):
    """Public stats for vendor landing page."""
    total = await db.execute(
        select(func.count(Vendor.id)).where(Vendor.status == VendorStatus.APPROVED)
    )
    types = await db.execute(
        select(Vendor.vendor_type, func.count(Vendor.id))
        .where(Vendor.status == VendorStatus.APPROVED)
        .group_by(Vendor.vendor_type)
    )
    return {
        "total_vendors": total.scalar() or 0,
        "by_type": {row[0]: row[1] for row in types.all()},
    }


# ===== Admin Endpoints =====

@router.get("/admin/all", response_model=list[VendorResponse])
async def admin_list_all_vendors(
    status_filter: str | None = None,
    limit: int = 50,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Admin: List all vendors (any status)."""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required.")

    query = select(Vendor)
    if status_filter:
        query = query.where(Vendor.status == VendorStatus(status_filter))
    query = query.order_by(Vendor.created_at.desc()).offset(offset).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.put("/admin/{vendor_id}/action", response_model=VendorResponse)
async def admin_vendor_action(
    vendor_id: UUID,
    data: AdminVendorAction,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Admin: Approve/Reject/Suspend a vendor."""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required.")

    result = await db.execute(select(Vendor).where(Vendor.id == vendor_id))
    vendor = result.scalar_one_or_none()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found.")

    vendor.status = VendorStatus(data.status.value)
    if data.rejection_reason:
        vendor.rejection_reason = data.rejection_reason
    if data.admin_notes:
        vendor.admin_notes = data.admin_notes
    if data.commission_rate is not None:
        vendor.commission_rate = data.commission_rate
    if data.status == "approved":
        vendor.verified_at = datetime.utcnow()
        # Optionally update user role
        user_result = await db.execute(select(User).where(User.id == vendor.user_id))
        user = user_result.scalar_one_or_none()
        if user:
            user.is_verified = True

    await db.commit()
    await db.refresh(vendor)
    return vendor
