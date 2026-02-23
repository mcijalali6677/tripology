"""Booking & Review endpoints."""
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.itinerary import Itinerary
from app.models.booking import Booking, BookingStatus, Review
from app.schemas.chat import BookingCreate, BookingResponse, ReviewCreate, ReviewResponse

router = APIRouter(tags=["Bookings & Reviews"])


# ===== Bookings =====

@router.post("/bookings", response_model=BookingResponse, status_code=201)
async def create_booking(
    data: BookingCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Purchase an itinerary."""
    # Get itinerary
    result = await db.execute(
        select(Itinerary).where(Itinerary.id == data.itinerary_id, Itinerary.is_published == True)
    )
    itinerary = result.scalar_one_or_none()
    if not itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    
    # Check if already purchased
    existing = await db.execute(
        select(Booking).where(
            Booking.user_id == user.id,
            Booking.itinerary_id == data.itinerary_id,
            Booking.status == BookingStatus.COMPLETED,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Already purchased")
    
    booking = Booking(
        user_id=user.id,
        itinerary_id=itinerary.id,
        amount=itinerary.price,
        currency=itinerary.currency,
        payment_method=data.payment_method,
        status=BookingStatus.COMPLETED,  # Simplified — add real payment later
    )
    db.add(booking)
    
    # Update purchase count
    itinerary.purchases_count += 1
    
    return booking


@router.get("/bookings", response_model=list[BookingResponse])
async def list_my_bookings(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List user's purchased itineraries."""
    result = await db.execute(
        select(Booking)
        .where(Booking.user_id == user.id)
        .order_by(Booking.created_at.desc())
    )
    return result.scalars().all()


# ===== Reviews =====

@router.post("/itineraries/{itinerary_id}/reviews", response_model=ReviewResponse, status_code=201)
async def create_review(
    itinerary_id: UUID,
    data: ReviewCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Write a review for an itinerary."""
    # Check itinerary exists
    result = await db.execute(select(Itinerary).where(Itinerary.id == itinerary_id))
    itinerary = result.scalar_one_or_none()
    if not itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    
    # Check if already reviewed
    existing = await db.execute(
        select(Review).where(
            Review.user_id == user.id,
            Review.itinerary_id == itinerary_id,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Already reviewed")
    
    # Check if user purchased (for verified review badge)
    purchase = await db.execute(
        select(Booking).where(
            Booking.user_id == user.id,
            Booking.itinerary_id == itinerary_id,
            Booking.status == BookingStatus.COMPLETED,
        )
    )
    is_verified = purchase.scalar_one_or_none() is not None
    
    review = Review(
        user_id=user.id,
        itinerary_id=itinerary_id,
        rating=data.rating,
        title=data.title,
        comment=data.comment,
        trip_type=data.trip_type,
        is_verified=is_verified,
    )
    db.add(review)
    
    # Update itinerary average rating
    from sqlalchemy import func
    avg_result = await db.execute(
        select(func.avg(Review.rating), func.count(Review.id))
        .where(Review.itinerary_id == itinerary_id)
    )
    avg_row = avg_result.one()
    if avg_row[0]:
        itinerary.rating = round(float(avg_row[0]), 1)
        itinerary.review_count = int(avg_row[1]) + 1  # +1 for current
    
    return review


@router.get("/itineraries/{itinerary_id}/reviews", response_model=list[ReviewResponse])
async def list_reviews(
    itinerary_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """List reviews for an itinerary."""
    result = await db.execute(
        select(Review)
        .where(Review.itinerary_id == itinerary_id)
        .order_by(Review.created_at.desc())
    )
    return result.scalars().all()
