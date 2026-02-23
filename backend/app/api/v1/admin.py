"""Admin panel API routes — requires admin role."""
from datetime import datetime, timedelta, timezone
from math import ceil
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select, and_, case, extract
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import aliased

from app.database import get_db
from app.core.dependencies import require_admin
from app.models.user import User
from app.models.itinerary import Itinerary
from app.models.booking import Booking, Review
from app.schemas.admin import (
    DashboardStats,
    RecentActivity,
    MonthlyStats,
    AdminUserResponse,
    AdminUserUpdate,
    PaginatedUsers,
    AdminItineraryResponse,
    AdminItineraryUpdate,
    PaginatedItineraries,
    AdminBookingResponse,
    PaginatedBookings,
    AdminReviewResponse,
    PaginatedReviews,
)

router = APIRouter(prefix="/admin", tags=["admin"])


# ── Dashboard ──────────────────────────────────────────────

@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Get admin dashboard statistics."""
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = today_start - timedelta(days=now.weekday())
    month_start = today_start.replace(day=1)

    # Users
    total_users = (await db.execute(select(func.count(User.id)))).scalar() or 0
    active_users = (await db.execute(
        select(func.count(User.id)).where(User.is_active == True)
    )).scalar() or 0
    new_users_today = (await db.execute(
        select(func.count(User.id)).where(User.created_at >= today_start)
    )).scalar() or 0
    new_users_week = (await db.execute(
        select(func.count(User.id)).where(User.created_at >= week_start)
    )).scalar() or 0
    new_users_month = (await db.execute(
        select(func.count(User.id)).where(User.created_at >= month_start)
    )).scalar() or 0

    # Itineraries
    total_itineraries = (await db.execute(select(func.count(Itinerary.id)))).scalar() or 0
    published_itineraries = (await db.execute(
        select(func.count(Itinerary.id)).where(Itinerary.is_published == True)
    )).scalar() or 0

    # Bookings & Revenue
    total_bookings = (await db.execute(select(func.count(Booking.id)))).scalar() or 0
    total_revenue = (await db.execute(
        select(func.coalesce(func.sum(Booking.amount), 0.0))
    )).scalar() or 0.0
    bookings_month = (await db.execute(
        select(func.count(Booking.id)).where(Booking.created_at >= month_start)
    )).scalar() or 0
    revenue_month = (await db.execute(
        select(func.coalesce(func.sum(Booking.amount), 0.0)).where(
            Booking.created_at >= month_start
        )
    )).scalar() or 0.0

    # Reviews
    pending_reviews = (await db.execute(
        select(func.count(Review.id)).where(Review.is_verified == False)
    )).scalar() or 0

    return DashboardStats(
        total_users=total_users,
        total_itineraries=total_itineraries,
        total_bookings=total_bookings,
        total_revenue=float(total_revenue),
        active_users=active_users,
        published_itineraries=published_itineraries,
        pending_reviews=pending_reviews,
        new_users_today=new_users_today,
        new_users_this_week=new_users_week,
        new_users_this_month=new_users_month,
        bookings_this_month=bookings_month,
        revenue_this_month=float(revenue_month),
    )


@router.get("/dashboard/recent-activity", response_model=list[RecentActivity])
async def get_recent_activity(
    limit: int = Query(10, ge=1, le=50),
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Get recent platform activity for the admin dashboard."""
    activities: list[RecentActivity] = []

    # Recent users
    result = await db.execute(
        select(User).order_by(User.created_at.desc()).limit(limit)
    )
    for user in result.scalars():
        activities.append(RecentActivity(
            id=str(user.id),
            type="user_registered",
            description=f"New user: {user.username} ({user.email})",
            user=user.username,
            timestamp=user.created_at,
        ))

    # Recent itineraries
    result = await db.execute(
        select(Itinerary).order_by(Itinerary.created_at.desc()).limit(limit)
    )
    for it in result.scalars():
        activities.append(RecentActivity(
            id=str(it.id),
            type="itinerary_created",
            description=f"New itinerary: {it.title} ({it.destination})",
            timestamp=it.created_at,
        ))

    # Recent bookings
    result = await db.execute(
        select(Booking, User.username).join(User, Booking.user_id == User.id)
        .order_by(Booking.created_at.desc()).limit(limit)
    )
    for booking, username in result:
        activities.append(RecentActivity(
            id=str(booking.id),
            type="booking",
            description=f"New booking: ${booking.amount} by {username}",
            user=username,
            timestamp=booking.created_at,
        ))

    # Sort all by timestamp descending and return top N
    activities.sort(key=lambda a: a.timestamp, reverse=True)
    return activities[:limit]


@router.get("/dashboard/monthly-stats", response_model=list[MonthlyStats])
async def get_monthly_stats(
    months: int = Query(12, ge=1, le=24),
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Get monthly statistics for charts."""
    now = datetime.now(timezone.utc)
    stats: list[MonthlyStats] = []

    for i in range(months - 1, -1, -1):
        # Calculate month start/end
        month = now.month - i
        year = now.year
        while month <= 0:
            month += 12
            year -= 1
        month_start = datetime(year, month, 1, tzinfo=timezone.utc)
        if month == 12:
            month_end = datetime(year + 1, 1, 1, tzinfo=timezone.utc)
        else:
            month_end = datetime(year, month + 1, 1, tzinfo=timezone.utc)

        label = month_start.strftime("%Y-%m")

        users_count = (await db.execute(
            select(func.count(User.id)).where(
                and_(User.created_at >= month_start, User.created_at < month_end)
            )
        )).scalar() or 0

        itin_count = (await db.execute(
            select(func.count(Itinerary.id)).where(
                and_(Itinerary.created_at >= month_start, Itinerary.created_at < month_end)
            )
        )).scalar() or 0

        bookings_count = (await db.execute(
            select(func.count(Booking.id)).where(
                and_(Booking.created_at >= month_start, Booking.created_at < month_end)
            )
        )).scalar() or 0

        revenue = (await db.execute(
            select(func.coalesce(func.sum(Booking.amount), 0.0)).where(
                and_(Booking.created_at >= month_start, Booking.created_at < month_end)
            )
        )).scalar() or 0.0

        stats.append(MonthlyStats(
            month=label,
            users=users_count,
            itineraries=itin_count,
            bookings=bookings_count,
            revenue=float(revenue),
        ))

    return stats


# ── User Management ───────────────────────────────────────

@router.get("/users", response_model=PaginatedUsers)
async def list_users(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """List all users with pagination and filters."""
    query = select(User)
    count_query = select(func.count(User.id))

    # Filters
    if search:
        search_filter = User.email.ilike(f"%{search}%") | User.username.ilike(f"%{search}%")
        if search.replace(" ", "").isalpha():
            search_filter = search_filter | User.full_name.ilike(f"%{search}%")
        query = query.where(search_filter)
        count_query = count_query.where(search_filter)

    if role:
        query = query.where(User.role == role)
        count_query = count_query.where(User.role == role)

    if is_active is not None:
        query = query.where(User.is_active == is_active)
        count_query = count_query.where(User.is_active == is_active)

    total = (await db.execute(count_query)).scalar() or 0
    total_pages = ceil(total / per_page) if total > 0 else 1

    result = await db.execute(
        query.order_by(User.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
    )
    users = result.scalars().all()

    return PaginatedUsers(
        users=[AdminUserResponse.model_validate(u) for u in users],
        total=total,
        page=page,
        per_page=per_page,
        total_pages=total_pages,
    )


@router.patch("/users/{user_id}", response_model=AdminUserResponse)
async def update_user(
    user_id: UUID,
    data: AdminUserUpdate,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Update a user's role, status, or verification."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Prevent self-demotion
    if user.id == admin.id and data.role and data.role != "admin":
        raise HTTPException(status_code=400, detail="Cannot change your own admin role")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)

    await db.commit()
    await db.refresh(user)
    return AdminUserResponse.model_validate(user)


@router.delete("/users/{user_id}", status_code=204)
async def delete_user(
    user_id: UUID,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Delete a user (soft-delete by deactivating)."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")

    user.is_active = False
    await db.commit()


# ── Itinerary Management ─────────────────────────────────

@router.get("/itineraries", response_model=PaginatedItineraries)
async def list_itineraries(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    is_published: Optional[bool] = Query(None),
    is_verified: Optional[bool] = Query(None),
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """List all itineraries with pagination and filters."""
    query = select(Itinerary, User.username).outerjoin(User, Itinerary.creator_id == User.id)
    count_query = select(func.count(Itinerary.id))

    if search:
        sf = Itinerary.title.ilike(f"%{search}%") | Itinerary.destination.ilike(f"%{search}%")
        query = query.where(sf)
        count_query = count_query.where(sf)

    if is_published is not None:
        query = query.where(Itinerary.is_published == is_published)
        count_query = count_query.where(Itinerary.is_published == is_published)

    if is_verified is not None:
        query = query.where(Itinerary.is_verified == is_verified)
        count_query = count_query.where(Itinerary.is_verified == is_verified)

    total = (await db.execute(count_query)).scalar() or 0
    total_pages = ceil(total / per_page) if total > 0 else 1

    result = await db.execute(
        query.order_by(Itinerary.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
    )
    rows = result.all()

    itineraries = []
    for itin, creator_username in rows:
        item = AdminItineraryResponse.model_validate(itin)
        item.creator_username = creator_username
        itineraries.append(item)

    return PaginatedItineraries(
        itineraries=itineraries,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=total_pages,
    )


@router.patch("/itineraries/{itinerary_id}", response_model=AdminItineraryResponse)
async def update_itinerary(
    itinerary_id: UUID,
    data: AdminItineraryUpdate,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Update itinerary publish/verify/premium status."""
    result = await db.execute(select(Itinerary).where(Itinerary.id == itinerary_id))
    itin = result.scalar_one_or_none()
    if not itin:
        raise HTTPException(status_code=404, detail="Itinerary not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(itin, field, value)

    await db.commit()
    await db.refresh(itin)
    return AdminItineraryResponse.model_validate(itin)


@router.delete("/itineraries/{itinerary_id}", status_code=204)
async def delete_itinerary(
    itinerary_id: UUID,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Delete an itinerary permanently."""
    result = await db.execute(select(Itinerary).where(Itinerary.id == itinerary_id))
    itin = result.scalar_one_or_none()
    if not itin:
        raise HTTPException(status_code=404, detail="Itinerary not found")

    await db.delete(itin)
    await db.commit()


# ── Booking Management ────────────────────────────────────

@router.get("/bookings", response_model=PaginatedBookings)
async def list_bookings(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status_filter: Optional[str] = Query(None, alias="status"),
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """List all bookings with pagination."""
    query = (
        select(Booking, User.email, Itinerary.title)
        .join(User, Booking.user_id == User.id)
        .join(Itinerary, Booking.itinerary_id == Itinerary.id)
    )
    count_query = select(func.count(Booking.id))

    if status_filter:
        query = query.where(Booking.status == status_filter)
        count_query = count_query.where(Booking.status == status_filter)

    total = (await db.execute(count_query)).scalar() or 0
    total_pages = ceil(total / per_page) if total > 0 else 1

    result = await db.execute(
        query.order_by(Booking.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
    )
    rows = result.all()

    bookings = []
    for booking, user_email, itin_title in rows:
        bookings.append(AdminBookingResponse(
            id=booking.id,
            user_email=user_email,
            itinerary_title=itin_title,
            status=booking.status,
            amount=float(booking.amount),
            currency=booking.currency,
            payment_method=booking.payment_method,
            created_at=booking.created_at,
            completed_at=booking.completed_at,
        ))

    return PaginatedBookings(
        bookings=bookings,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=total_pages,
    )


# ── Review Management ─────────────────────────────────────

@router.get("/reviews", response_model=PaginatedReviews)
async def list_reviews(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    is_verified: Optional[bool] = Query(None),
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """List all reviews with pagination."""
    query = (
        select(Review, User.email, Itinerary.title)
        .join(User, Review.user_id == User.id)
        .join(Itinerary, Review.itinerary_id == Itinerary.id)
    )
    count_query = select(func.count(Review.id))

    if is_verified is not None:
        query = query.where(Review.is_verified == is_verified)
        count_query = count_query.where(Review.is_verified == is_verified)

    total = (await db.execute(count_query)).scalar() or 0
    total_pages = ceil(total / per_page) if total > 0 else 1

    result = await db.execute(
        query.order_by(Review.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
    )
    rows = result.all()

    reviews = []
    for review, user_email, itin_title in rows:
        reviews.append(AdminReviewResponse(
            id=review.id,
            user_email=user_email,
            itinerary_title=itin_title,
            rating=review.rating,
            title=review.title,
            comment=review.comment,
            is_verified=review.is_verified,
            helpful_count=review.helpful_count,
            created_at=review.created_at,
        ))

    return PaginatedReviews(
        reviews=reviews,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=total_pages,
    )


@router.patch("/reviews/{review_id}/verify")
async def verify_review(
    review_id: UUID,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Toggle review verification."""
    result = await db.execute(select(Review).where(Review.id == review_id))
    review = result.scalar_one_or_none()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    review.is_verified = not review.is_verified
    await db.commit()
    return {"verified": review.is_verified}


@router.delete("/reviews/{review_id}", status_code=204)
async def delete_review(
    review_id: UUID,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Delete a review."""
    result = await db.execute(select(Review).where(Review.id == review_id))
    review = result.scalar_one_or_none()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    await db.delete(review)
    await db.commit()
