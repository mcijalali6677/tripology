"""
RAG Pipeline — Retrieval Augmented Generation for travel knowledge.
Combines vector search (pgvector) with LLM generation.
"""
import logging
from typing import List, Optional, Dict, Any
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text

from app.ai.embeddings import embedding_engine
from app.ai.llm_engine import llm_engine
from app.models.chat import KnowledgeBase

logger = logging.getLogger(__name__)


class RAGPipeline:
    """
    Retrieval Augmented Generation for travel-specific queries.
    
    Flow:
    1. User asks a question
    2. Question is embedded → vector
    3. Vector search against knowledge_base (pgvector)
    4. Top-K relevant chunks retrieved
    5. Chunks + question sent to LLM
    6. LLM generates context-aware answer
    """
    
    def __init__(self, top_k: int = 3, similarity_threshold: float = 0.5):
        self.top_k = top_k
        self.similarity_threshold = similarity_threshold
        self._tool_max_tokens = 3072  # Larger limit for tool-augmented responses
    
    async def retrieve(
        self,
        query: str,
        db: AsyncSession,
        destination: Optional[str] = None,
        category: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Retrieve relevant knowledge chunks using vector similarity search."""
        try:
            # 1. Embed the query
            query_embedding = await embedding_engine.embed_text(query)
            
            # 2. Build pgvector search query
            # Use CAST instead of :: to avoid asyncpg parameter parsing issues
            filters = []
            params = {"embedding": str(query_embedding), "limit": self.top_k}
            
            if destination:
                filters.append("destination = :destination")
                params["destination"] = destination
            if category:
                filters.append("category = :category")
                params["category"] = category
            
            where_clause = ""
            if filters:
                where_clause = "WHERE " + " AND ".join(filters)
            
            sql = text(f"""
                SELECT 
                    id, title, content, source, category, destination, tags,
                    1 - (embedding <=> CAST(:embedding AS vector)) as similarity
                FROM knowledge_base
                {where_clause}
                ORDER BY embedding <=> CAST(:embedding AS vector)
                LIMIT :limit
            """)
            
            result = await db.execute(sql, params)
            rows = result.fetchall()
            
            # 3. Filter by similarity threshold
            chunks = []
            for row in rows:
                similarity = float(row.similarity) if row.similarity else 0
                if similarity >= self.similarity_threshold:
                    chunks.append({
                        "id": str(row.id),
                        "title": row.title,
                        "content": row.content,
                        "source": row.source,
                        "category": row.category,
                        "destination": row.destination,
                        "similarity": round(similarity, 4),
                    })
            
            return chunks
        except Exception as e:
            logger.warning(f"RAG retrieval failed (using LLM without context): {e}")
            return []
    
    async def generate_with_context(
        self,
        query: str,
        db: AsyncSession,
        system_prompt: str,
        destination: Optional[str] = None,
        history: Optional[List[Dict[str, str]]] = None,
    ) -> Dict[str, Any]:
        """Full RAG: retrieve context then generate answer."""
        # 1. Retrieve relevant knowledge
        chunks = await self.retrieve(query, db, destination=destination)
        
        # 2. Build context from retrieved chunks
        if chunks:
            context_text = "\n\n".join([
                f"[{c['category']}] {c['title']}:\n{c['content']}"
                for c in chunks
            ])
            augmented_prompt = f"""Use the following travel knowledge to help answer the user's question.
If the knowledge doesn't contain relevant info, use your general knowledge but mention that.

=== TRAVEL KNOWLEDGE ===
{context_text}
=== END KNOWLEDGE ===

User's question: {query}"""
        else:
            augmented_prompt = query
        
        # 3. Generate response with LLM
        response = ""
        async for token in llm_engine.generate_stream(
            prompt=augmented_prompt,
            system=system_prompt,
            history=history,
        ):
            response += token
        
        return {
            "response": response,
            "sources": chunks,
            "has_context": len(chunks) > 0,
        }
    
    async def generate_stream_with_context(
        self,
        query: str,
        db: AsyncSession,
        system_prompt: str,
        destination: Optional[str] = None,
        history: Optional[List[Dict[str, str]]] = None,
        preloaded_chunks: Optional[List[Dict[str, Any]]] = None,
        use_tools: bool = False,
    ):
        """Streaming RAG: retrieve context then stream answer.
        When use_tools=True, enables AI function calling for web price search.
        """
        # 1. Use preloaded chunks or retrieve fresh
        chunks = preloaded_chunks if preloaded_chunks is not None else await self.retrieve(query, db, destination=destination)
        
        # 2. Build augmented prompt
        if chunks:
            context_text = "\n\n".join([
                f"[{c['category']}] {c['title']}:\n{c['content']}"
                for c in chunks
            ])
            augmented_prompt = f"""Use the following travel knowledge to help answer the user's question.

=== TRAVEL KNOWLEDGE ===
{context_text}
=== END KNOWLEDGE ===

User's question: {query}"""
        else:
            augmented_prompt = query

        # 3. Try tool-augmented generation (price search)
        if use_tools:
            try:
                from app.ai.travel_tools import TRAVEL_TOOLS, execute_tool_call

                # Build full messages list
                messages: List[Dict[str, Any]] = [
                    {"role": "system", "content": system_prompt},
                ]
                if history:
                    messages.extend(history)
                messages.append({"role": "user", "content": augmented_prompt})

                # First pass: non-streaming to check if AI wants to call tools
                tool_result = await llm_engine.generate_with_tools(
                    messages=messages,
                    tools=TRAVEL_TOOLS,
                )

                if tool_result.get("tool_calls"):
                    logger.info(f"AI requested {len(tool_result['tool_calls'])} tool call(s)")

                    # Add assistant message with tool calls
                    assistant_msg: Dict[str, Any] = {
                        "role": "assistant",
                        "tool_calls": tool_result["tool_calls"],
                    }
                    if tool_result.get("content"):
                        assistant_msg["content"] = tool_result["content"]
                    messages.append(assistant_msg)

                    # Execute each tool call and add results
                    for tc in tool_result["tool_calls"]:
                        result_str = await execute_tool_call(tc)
                        messages.append({
                            "role": "tool",
                            "tool_call_id": tc["id"],
                            "content": result_str,
                        })

                    # Stream final response with enriched tool data
                    async for token in llm_engine.generate_stream_from_messages(
                        messages=messages,
                        max_tokens=self._tool_max_tokens,
                    ):
                        yield token
                    return

            except Exception as e:
                logger.warning(f"Tool-augmented generation failed, falling back: {e}")
                # Fall through to normal generation

        # 4. Normal stream (no tools or tools failed)
        async for token in llm_engine.generate_stream(
            prompt=augmented_prompt,
            system=system_prompt,
            history=history,
        ):
            yield token
    
    async def index_itinerary(
        self,
        db: AsyncSession,
        itinerary_id: str,
        title: str,
        description: str,
        destination: str,
        country: str,
        days_data: List[Dict],
    ):
        """Index an itinerary into the knowledge base for RAG retrieval."""
        chunks_to_add = []
        
        # Index the itinerary overview
        overview_text = f"{title}. {description}"
        overview_embedding = await embedding_engine.embed_text(overview_text)
        chunks_to_add.append(KnowledgeBase(
            title=title,
            content=overview_text,
            source=f"itinerary:{itinerary_id}",
            category="itinerary",
            destination=destination,
            country=country,
            tags=["overview"],
            embedding=overview_embedding,
        ))
        
        # Index each day and its activities
        for day in days_data:
            day_text = f"Day {day.get('day_number', '')}: {day.get('title', '')}. {day.get('description', '')}"
            
            activities = day.get("activities", [])
            for activity in activities:
                activity_text = (
                    f"{activity.get('title', '')} at {activity.get('location', '')}. "
                    f"{activity.get('description', '')}. "
                    f"Tips: {activity.get('tips', 'N/A')}. "
                    f"Cost: ${activity.get('cost', 0)}. Duration: {activity.get('duration', 'N/A')}."
                )
                activity_embedding = await embedding_engine.embed_text(activity_text)
                chunks_to_add.append(KnowledgeBase(
                    title=activity.get("title", ""),
                    content=activity_text,
                    source=f"itinerary:{itinerary_id}",
                    category="activity",
                    destination=destination,
                    country=country,
                    tags=[activity.get("type", "activity")],
                    embedding=activity_embedding,
                ))
        
        # Batch insert
        db.add_all(chunks_to_add)
        await db.flush()
        
        logger.info(f"Indexed {len(chunks_to_add)} chunks for itinerary {itinerary_id}")
        return len(chunks_to_add)


# Singleton
rag_pipeline = RAGPipeline()
