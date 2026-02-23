"""Itinerary CRUD endpoints."""
import re
from typing import Optional, List
from uuid import UUID, uuid4
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, asc

from app.database import get_db
from app.core.dependencies import get_current_user, get_current_user_optional, require_creator
from app.models.user import User
from app.models.itinerary import Itinerary, TripDay, Activity, ChecklistItem, Accommodation
from app.schemas.itinerary import (
    ItineraryCreate, ItineraryResponse, ItineraryListResponse,
)
from app.ai.embeddings import embedding_engine

router = APIRouter(prefix="/itineraries", tags=["Itineraries"])


def generate_slug(title: str) -> str:
    """Generate URL-safe slug from title."""
    slug = re.sub(r"[^\w\s-]", "", title.lower())
    slug = re.sub(r"[\s_]+", "-", slug).strip("-")
    return f"{slug}-{uuid4().hex[:8]}"


@router.get("", response_model=List[ItineraryListResponse])
async def list_itineraries(
    destination: Optional[str] = None,
    country: Optional[str] = None,
    plan_type: Optional[str] = None,
    min_budget: Optional[float] = None,
    max_budget: Optional[float] = None,
    difficulty: Optional[str] = None,
    travel_styles: Optional[str] = None,  # comma-separated
    sort_by: str = Query(default="popular", pattern="^(popular|rating|price_low|price_high|newest)$"),
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=12, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    """List published itineraries with filters and pagination."""
    query = select(Itinerary).where(Itinerary.is_published == True)
    
    # Filters
    if destination:
        query = query.where(Itinerary.destination.ilike(f"%{destination}%"))
    if country:
        query = query.where(Itinerary.country.ilike(f"%{country}%"))
    if plan_type:
        query = query.where(Itinerary.plan_type == plan_type)
    if min_budget is not None:
        query = query.where(Itinerary.budget_max >= min_budget)
    if max_budget is not None:
        query = query.where(Itinerary.budget_min <= max_budget)
    if difficulty:
        query = query.where(Itinerary.difficulty == difficulty)
    if travel_styles:
        styles = [s.strip() for s in travel_styles.split(",")]
        query = query.where(Itinerary.travel_styles.overlap(styles))
    
    # Sorting
    sort_map = {
        "popular": desc(Itinerary.views_count),
        "rating": desc(Itinerary.rating),
        "price_low": asc(Itinerary.price),
        "price_high": desc(Itinerary.price),
        "newest": desc(Itinerary.created_at),
    }
    query = query.order_by(sort_map.get(sort_by, desc(Itinerary.views_count)))
    
    # Pagination
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page)
    
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{itinerary_id}", response_model=ItineraryResponse)
async def get_itinerary(
    itinerary_id: UUID,
    user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db),
):
    """Get full itinerary details."""
    result = await db.execute(
        select(Itinerary).where(Itinerary.id == itinerary_id)
    )
    itinerary = result.scalar_one_or_none()
    
    if not itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    
    if not itinerary.is_published and (not user or user.id != itinerary.creator_id):
        raise HTTPException(status_code=404, detail="Itinerary not found")
    
    # Increment view count
    itinerary.views_count += 1
    
    return itinerary


@router.post("", response_model=ItineraryResponse, status_code=201)
async def create_itinerary(
    data: ItineraryCreate,
    user: User = Depends(require_creator),
    db: AsyncSession = Depends(get_db),
):
    """Create a new itinerary (requires creator role)."""
    # Create main itinerary
    itinerary = Itinerary(
        creator_id=user.id,
        title=data.title,
        slug=generate_slug(data.title),
        description=data.description,
        highlight=data.highlight,
        cover_image=data.cover_image,
        destination=data.destination,
        country=data.country,
        city=data.city,
        coordinates=data.coordinates,
        duration=data.duration,
        budget_min=data.budget_min,
        budget_max=data.budget_max,
        budget_level=data.budget_level,
        currency=data.currency,
        difficulty=data.difficulty,
        best_season=data.best_season,
        suitable_for=data.suitable_for,
        travel_styles=data.travel_styles,
        plan_type=data.plan_type,
        price=data.price,
    )
    db.add(itinerary)
    await db.flush()
    
    # Create days with activities
    for day_data in data.days:
        day = TripDay(
            itinerary_id=itinerary.id,
            day_number=day_data.day_number,
            title=day_data.title,
            description=day_data.description,
        )
        db.add(day)
        await db.flush()
        
        for idx, act_data in enumerate(day_data.activities):
            activity = Activity(
                trip_day_id=day.id,
                title=act_data.title,
                description=act_data.description,
                location=act_data.location,
                coordinates=act_data.coordinates,
                activity_type=act_data.activity_type,
                time_period=act_data.time_period,
                sort_order=idx,
                image=act_data.image,
                cost=act_data.cost,
                duration=act_data.duration,
                tips=act_data.tips,
                transport_options=act_data.transport_options,
                alternatives=act_data.alternatives,
            )
            db.add(activity)
    
    # Create checklist items
    for item_data in data.checklist_items:
        item = ChecklistItem(
            itinerary_id=itinerary.id,
            category=item_data.category,
            title=item_data.title,
            description=item_data.description,
            priority=item_data.priority,
            link=item_data.link,
        )
        db.add(item)
    
    # Create accommodations
    for acc_data in data.accommodations:
        acc = Accommodation(
            itinerary_id=itinerary.id,
            name=acc_data.name,
            accommodation_type=acc_data.accommodation_type,
            image=acc_data.image,
            price_per_night=acc_data.price_per_night,
            rating=acc_data.rating,
            neighborhood=acc_data.neighborhood,
            amenities=acc_data.amenities,
            popular_with=acc_data.popular_with,
        )
        db.add(acc)
    
    # Generate embedding for search
    try:
        embed_text = f"{data.title} {data.destination} {data.description or ''} {' '.join(data.travel_styles)}"
        embedding = await embedding_engine.embed_text(embed_text)
        itinerary.embedding = embedding
    except Exception:
        pass  # Don't fail creation if embedding fails
    
    await db.flush()
    
    # Update user trips count
    user.trips_shared += 1
    
    return itinerary


@router.patch("/{itinerary_id}/publish")
async def publish_itinerary(
    itinerary_id: UUID,
    user: User = Depends(require_creator),
    db: AsyncSession = Depends(get_db),
):
    """Publish an itinerary (make it visible)."""
    result = await db.execute(
        select(Itinerary).where(
            Itinerary.id == itinerary_id,
            Itinerary.creator_id == user.id,
        )
    )
    itinerary = result.scalar_one_or_none()
    if not itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    
    from datetime import datetime
    itinerary.is_published = True
    itinerary.published_at = datetime.utcnow()
    
    return {"message": "Itinerary published", "id": str(itinerary.id)}


@router.delete("/{itinerary_id}", status_code=204)
async def delete_itinerary(
    itinerary_id: UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete own itinerary."""
    result = await db.execute(
        select(Itinerary).where(Itinerary.id == itinerary_id)
    )
    itinerary = result.scalar_one_or_none()
    if not itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    
    if itinerary.creator_id != user.id and user.role != "admin":
        raise HTTPException(status_code=403, detail="Not your itinerary")
    
    await db.delete(itinerary)
