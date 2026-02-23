"""
Travel Chat Agent — Handles conversation with RAG-powered context.
"""
import json
import time
import logging
from typing import AsyncGenerator, Dict, Any, List, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.ai.llm_engine import llm_engine
from app.ai.rag import rag_pipeline
from app.ai.prompts.templates import TRAVEL_ASSISTANT_SYSTEM
from app.ai.personality_inference import infer_travel_profile, render_profile_for_prompt
from app.models.chat import ChatSession, ChatMessage, MessageRole

logger = logging.getLogger(__name__)


def _estimate_tokens(text: str) -> int:
    """Rough token estimate: ~4 chars per token for multilingual."""
    return max(1, len(text) // 4)


class TravelChatAgent:
    """AI Travel Assistant with conversation memory and RAG."""
    
    async def chat(
        self,
        message: str,
        session_id: UUID,
        db: AsyncSession,
        destination: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Non-streaming chat with full RAG."""
        start_time = time.time()
        
        # 1. Load conversation history
        history = await self._load_history(session_id, db)

        # 1.1 Infer user's travel profile from recent user messages + current message
        profile = infer_travel_profile(
            [m["content"] for m in history if m.get("role") == "user"] + [message]
        )
        system_prompt = TRAVEL_ASSISTANT_SYSTEM + render_profile_for_prompt(profile)
        
        # 2. RAG-powered generation
        result = await rag_pipeline.generate_with_context(
            query=message,
            db=db,
            system_prompt=system_prompt,
            destination=destination,
            history=history,
        )
        
        latency_ms = int((time.time() - start_time) * 1000)
        tokens = _estimate_tokens(message) + _estimate_tokens(result["response"])
        
        # 3. Save messages to DB
        await self._save_message(session_id, db, MessageRole.USER, message,
                                 tokens_used=_estimate_tokens(message))
        await self._save_message(
            session_id, db, MessageRole.ASSISTANT, result["response"],
            model_used=llm_engine.model,
            latency_ms=latency_ms,
            rag_context=result.get("sources"),
            tokens_used=_estimate_tokens(result["response"]),
        )
        
        # Update session title if first message
        await self._maybe_update_title(session_id, db, message)
        
        return {
            "response": result["response"],
            "sources": result.get("sources", []),
            "latency_ms": latency_ms,
            "tokens_used": tokens,
        }
    
    async def chat_stream(
        self,
        message: str,
        session_id: UUID,
        db: AsyncSession,
        destination: Optional[str] = None,
    ) -> AsyncGenerator[str, None]:
        """Streaming chat with RAG. Yields tokens as they arrive."""
        start_time = time.time()
        
        # 1. Load history
        history = await self._load_history(session_id, db)

        # 1.1 Infer user's travel profile from recent user messages + current message
        profile = infer_travel_profile(
            [m["content"] for m in history if m.get("role") == "user"] + [message]
        )
        system_prompt = TRAVEL_ASSISTANT_SYSTEM + render_profile_for_prompt(profile)
        
        # 2. Save user message
        await self._save_message(session_id, db, MessageRole.USER, message,
                                 tokens_used=_estimate_tokens(message))
        
        # 3. Retrieve RAG context first (exposed for the caller)
        rag_sources = await rag_pipeline.retrieve(message, db, destination=destination)
        self._last_rag_sources = rag_sources  # Store for caller to access
        
        # 4. Stream with RAG context
        full_response = ""
        async for token in rag_pipeline.generate_stream_with_context(
            query=message,
            db=db,
            system_prompt=system_prompt,
            destination=destination,
            history=history,
            preloaded_chunks=rag_sources,
        ):
            full_response += token
            yield token
        
        # 4. Save assistant response
        latency_ms = int((time.time() - start_time) * 1000)
        await self._save_message(
            session_id, db, MessageRole.ASSISTANT, full_response,
            model_used=llm_engine.model,
            latency_ms=latency_ms,
            tokens_used=_estimate_tokens(full_response),
        )
        
        # Update session title if first message
        await self._maybe_update_title(session_id, db, message)
    
    async def _load_history(
        self,
        session_id: UUID,
        db: AsyncSession,
        max_messages: int = 10,
    ) -> List[Dict[str, str]]:
        """Load recent conversation history for context (limited for context window)."""
        result = await db.execute(
            select(ChatMessage)
            .where(ChatMessage.session_id == session_id)
            .order_by(ChatMessage.created_at.desc())
            .limit(max_messages)
        )
        messages = result.scalars().all()
        
        # Reverse to chronological order
        return [
            {"role": msg.role.value, "content": msg.content}
            for msg in reversed(messages)
        ]
    
    async def _save_message(
        self,
        session_id: UUID,
        db: AsyncSession,
        role: MessageRole,
        content: str,
        model_used: Optional[str] = None,
        latency_ms: Optional[int] = None,
        rag_context: Optional[list] = None,
        tokens_used: Optional[int] = None,
    ):
        """Save a chat message to the database."""
        msg = ChatMessage(
            session_id=session_id,
            role=role,
            content=content,
            model_used=model_used,
            latency_ms=latency_ms,
            rag_context=rag_context,
            tokens_used=tokens_used,
        )
        db.add(msg)
        await db.flush()
    
    async def _maybe_update_title(
        self,
        session_id: UUID,
        db: AsyncSession,
        message: str,
    ):
        """Update session title from first user message if it's still the default."""
        try:
            result = await db.execute(
                select(ChatSession).where(ChatSession.id == session_id)
            )
            session = result.scalar_one_or_none()
            if session and session.message_count <= 2:
                # Use first 80 chars of first message as title
                title = message[:80].strip()
                if title:
                    session.title = title
                session.message_count += 2
                await db.flush()
            elif session:
                session.message_count += 2
                await db.flush()
        except Exception as e:
            logger.warning(f"Failed to update session title: {e}")


# Singleton
chat_agent = TravelChatAgent()
