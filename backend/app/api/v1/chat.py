"""AI Chat & Generation endpoints."""
import json
from uuid import UUID
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.core.dependencies import get_current_user, get_current_user_optional
from app.models.user import User
from app.models.chat import ChatSession
from app.ai.chat_agent import chat_agent
from app.ai.itinerary_generator import itinerary_generator
from app.ai.recommender import recommendation_engine
from app.ai.llm_engine import llm_engine
from app.ai.embeddings import embedding_engine
from app.schemas.chat import (
    ChatSessionCreate, ChatSessionResponse, ChatMessageRequest,
    ChatMessageResponse, GenerateItineraryRequest, SwapActivityRequest,
    RecommendationRequest, RecommendationResponse,
)

router = APIRouter(tags=["AI"])


# ===== Chat Sessions =====

@router.post("/chat/sessions", response_model=ChatSessionResponse, status_code=201)
async def create_chat_session(
    data: ChatSessionCreate,
    user: User = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db),
):
    """Create a new chat session (works for anonymous users too)."""
    session = ChatSession(
        user_id=user.id if user else None,
        title=data.title,
        context=data.context,
    )
    db.add(session)
    await db.flush()
    return session


@router.get("/chat/sessions", response_model=list[ChatSessionResponse])
async def list_chat_sessions(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List user's chat sessions."""
    result = await db.execute(
        select(ChatSession)
        .where(ChatSession.user_id == user.id)
        .order_by(ChatSession.updated_at.desc())
        .limit(50)
    )
    return result.scalars().all()


# ===== Chat Messages =====

@router.post("/chat/sessions/{session_id}/messages")
async def send_message(
    session_id: UUID,
    data: ChatMessageRequest,
    user: User = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db),
):
    """Send a message and get AI response (non-streaming)."""
    # Verify session exists (and ownership if logged in)
    query = select(ChatSession).where(ChatSession.id == session_id)
    if user:
        query = query.where(ChatSession.user_id == user.id)
    else:
        query = query.where(ChatSession.user_id.is_(None))
    result = await db.execute(query)
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
    
    # Get AI response with RAG
    response = await chat_agent.chat(
        message=data.message,
        session_id=session_id,
        db=db,
        destination=data.destination,
    )
    
    # Update session
    session.message_count += 2  # user + assistant
    
    return response


@router.post("/chat/sessions/{session_id}/stream")
async def send_message_stream(
    session_id: UUID,
    data: ChatMessageRequest,
    user: User = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db),
):
    """Send a message and get AI response (streaming via SSE)."""
    # Verify session exists (and ownership if logged in)
    query = select(ChatSession).where(ChatSession.id == session_id)
    if user:
        query = query.where(ChatSession.user_id == user.id)
    else:
        query = query.where(ChatSession.user_id.is_(None))
    result = await db.execute(query)
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
    
    async def event_stream():
        try:
            # Yield an immediate event to flush HTTP response headers to the client.
            # Without this, Node.js fetch() blocks until the first real token arrives.
            yield f"data: {json.dumps({'status': 'thinking'})}\n\n"

            full_response = ""
            async for token in chat_agent.chat_stream(
                message=data.message,
                session_id=session_id,
                db=db,
                destination=data.destination,
            ):
                full_response += token
                yield f"data: {json.dumps({'token': token})}\n\n"
            yield f"data: {json.dumps({'done': True, 'content': full_response})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
    
    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


# ===== AI Itinerary Generation =====

@router.post("/ai/generate-itinerary")
async def generate_itinerary(
    data: GenerateItineraryRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Generate a custom AI itinerary from user's activity basket."""
    try:
        result = await itinerary_generator.generate(
            basket=data.basket,
            trip_days=data.trip_days,
            travelers=data.travelers,
            destination=data.destination,
            start_date=data.start_date,
            budget_level=data.budget_level,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"AI generation failed: {str(e)}")


@router.post("/ai/swap-activity")
async def swap_activity(
    data: SwapActivityRequest,
    user: User = Depends(get_current_user),
):
    """Get 3 alternative activities to swap with current one."""
    try:
        alternatives = await itinerary_generator.swap_activity(
            current_activity=data.current_activity,
            day_theme=data.day_theme,
            destination=data.destination,
            travel_style=data.travel_style,
        )
        return {"alternatives": alternatives}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"AI swap failed: {str(e)}")


# ===== Recommendations =====

@router.post("/ai/recommendations", response_model=list[RecommendationResponse])
async def get_recommendations(
    data: RecommendationRequest,
    user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db),
):
    """Get personalized itinerary recommendations."""
    preferences = {
        "personality_scores": data.personality_scores or (user.personality_scores if user else {}),
        "travel_styles": data.travel_styles or (user.travel_styles if user else []),
        "budget_range": data.budget_range,
        "preferred_duration": data.preferred_duration,
        "query": data.query,
    }
    
    results = await recommendation_engine.get_recommendations(db, preferences)
    return results


# ===== Health Check =====

@router.get("/ai/health")
async def ai_health():
    """Check AI services health (LLM + Embeddings)."""
    llm_status = await llm_engine.health_check()
    embed_status = await embedding_engine.health_check()
    
    return {
        "llm": llm_status,
        "embeddings": embed_status,
        "overall": "healthy" if llm_status["status"] == "healthy" and embed_status["status"] == "healthy" else "degraded",
    }
