"""Semantic search endpoint using vector embeddings."""
from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from app.database import get_db
from app.ai.embeddings import embedding_engine
from app.schemas.itinerary import ItineraryListResponse

router = APIRouter(prefix="/search", tags=["Search"])


@router.get("", response_model=List[ItineraryListResponse])
async def semantic_search(
    q: str = Query(min_length=2, max_length=500),
    destination: Optional[str] = None,
    limit: int = Query(default=10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    """
    Semantic search for itineraries.
    Uses vector similarity (pgvector) for intelligent matching.
    """
    # Generate query embedding
    query_embedding = await embedding_engine.embed_text(q)
    
    # Build SQL with pgvector cosine distance
    filters = ["is_published = true"]
    params = {"embedding": str(query_embedding), "limit": limit}
    
    if destination:
        filters.append("destination ILIKE :dest")
        params["dest"] = f"%{destination}%"
    
    where_clause = " AND ".join(filters)
    
    sql = text(f"""
        SELECT 
            id, title, slug, destination, country, duration,
            budget_min, budget_max, cover_image, travel_styles,
            plan_type, price, rating, review_count, highlight,
            is_premium, is_verified, created_at,
            1 - (embedding <=> :embedding::vector) as similarity
        FROM itineraries
        WHERE {where_clause}
            AND embedding IS NOT NULL
        ORDER BY embedding <=> :embedding::vector
        LIMIT :limit
    """)
    
    result = await db.execute(sql, params)
    rows = result.fetchall()
    
    return [
        {
            "id": row.id,
            "title": row.title,
            "slug": row.slug,
            "destination": row.destination,
            "country": row.country,
            "duration": row.duration,
            "budget_min": row.budget_min,
            "budget_max": row.budget_max,
            "cover_image": row.cover_image,
            "travel_styles": row.travel_styles or [],
            "plan_type": row.plan_type,
            "price": row.price or 0,
            "rating": row.rating or 0,
            "review_count": row.review_count or 0,
            "highlight": row.highlight,
            "is_premium": row.is_premium,
            "is_verified": row.is_verified,
            "created_at": row.created_at,
        }
        for row in rows
    ]


@router.get("/knowledge")
async def search_knowledge(
    q: str = Query(min_length=2, max_length=500),
    destination: Optional[str] = None,
    category: Optional[str] = None,
    limit: int = Query(default=5, ge=1, le=20),
    db: AsyncSession = Depends(get_db),
):
    """
    Search the travel knowledge base (used by RAG internally, also exposed as API).
    """
    from app.ai.rag import rag_pipeline
    
    chunks = await rag_pipeline.retrieve(
        query=q,
        db=db,
        destination=destination,
        category=category,
    )
    
    return {"results": chunks[:limit], "total": len(chunks)}
