"""
Travel Chat Agent — Handles conversation with RAG-powered context.
"""
import json
import time
import logging
from typing import AsyncGenerator, Dict, Any, List, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.llm_engine import llm_engine
from app.ai.rag import rag_pipeline
from app.ai.prompts.templates import TRAVEL_ASSISTANT_SYSTEM
from app.models.chat import ChatSession, ChatMessage, MessageRole

logger = logging.getLogger(__name__)


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
        
        # 2. RAG-powered generation
        result = await rag_pipeline.generate_with_context(
            query=message,
            db=db,
            system_prompt=TRAVEL_ASSISTANT_SYSTEM,
            destination=destination,
            history=history,
        )
        
        latency_ms = int((time.time() - start_time) * 1000)
        
        # 3. Save messages to DB
        await self._save_message(session_id, db, MessageRole.USER, message)
        await self._save_message(
            session_id, db, MessageRole.ASSISTANT, result["response"],
            model_used=llm_engine.model,
            latency_ms=latency_ms,
            rag_context=result.get("sources"),
        )
        
        return {
            "response": result["response"],
            "sources": result.get("sources", []),
            "latency_ms": latency_ms,
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
        
        # 2. Save user message
        await self._save_message(session_id, db, MessageRole.USER, message)
        
        # 3. Stream with RAG context
        full_response = ""
        async for token in rag_pipeline.generate_stream_with_context(
            query=message,
            db=db,
            system_prompt=TRAVEL_ASSISTANT_SYSTEM,
            destination=destination,
            history=history,
        ):
            full_response += token
            yield token
        
        # 4. Save assistant response
        latency_ms = int((time.time() - start_time) * 1000)
        await self._save_message(
            session_id, db, MessageRole.ASSISTANT, full_response,
            model_used=llm_engine.model,
            latency_ms=latency_ms,
        )
    
    async def _load_history(
        self,
        session_id: UUID,
        db: AsyncSession,
        max_messages: int = 20,
    ) -> List[Dict[str, str]]:
        """Load recent conversation history for context."""
        from sqlalchemy import select
        
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
    ):
        """Save a chat message to the database."""
        msg = ChatMessage(
            session_id=session_id,
            role=role,
            content=content,
            model_used=model_used,
            latency_ms=latency_ms,
            rag_context=rag_context,
        )
        db.add(msg)
        await db.flush()


# Singleton
chat_agent = TravelChatAgent()
