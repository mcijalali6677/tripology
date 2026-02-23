import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, DateTime, Text, Integer,
    ForeignKey, JSON, Enum as SQLEnum, Index
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from app.database import Base
import enum


class ChatSession(Base):
    """A conversation session between user and AI travel assistant."""
    __tablename__ = "chat_sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    
    title = Column(String(300), default="New Chat")
    context = Column(JSON, nullable=True)  # {destination, budget, style, ...}
    
    message_count = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan", order_by="ChatMessage.created_at", lazy="selectin")
    
    __table_args__ = (
        Index("idx_chat_sessions_user", "user_id"),
    )


class MessageRole(str, enum.Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("chat_sessions.id", ondelete="CASCADE"), nullable=False)
    
    role = Column(SQLEnum(MessageRole), nullable=False)
    content = Column(Text, nullable=False)
    
    # AI metadata
    model_used = Column(String(100), nullable=True)
    tokens_used = Column(Integer, nullable=True)
    latency_ms = Column(Integer, nullable=True)
    
    # RAG context used
    rag_context = Column(JSON, nullable=True)  # [{source, chunk, score}]
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    session = relationship("ChatSession", back_populates="messages")


class KnowledgeBase(Base):
    """Travel knowledge chunks for RAG pipeline."""
    __tablename__ = "knowledge_base"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Content
    title = Column(String(300), nullable=False)
    content = Column(Text, nullable=False)
    source = Column(String(255))  # "itinerary:uuid", "manual", "scraped"
    category = Column(String(100))  # destination, tip, activity, restaurant
    
    # Metadata
    destination = Column(String(255), index=True)
    country = Column(String(100), index=True)
    tags = Column(JSON, default=[])
    
    # Vector embedding (384-dim for MiniLM / 768 for nomic-embed-text)
    embedding = Column(Vector(768), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (
        Index("idx_kb_destination", "destination"),
        Index("idx_kb_category", "category"),
    )
