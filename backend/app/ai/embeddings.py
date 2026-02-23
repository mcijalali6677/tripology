"""
Embedding Engine — Self-hosted vector embeddings via Ollama.
Uses nomic-embed-text model for generating embeddings locally.
"""
import logging
from typing import List
import numpy as np
from ollama import AsyncClient
from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class EmbeddingEngine:
    """Generate vector embeddings using self-hosted model via Ollama."""
    
    def __init__(self):
        self.client = AsyncClient(host=settings.OLLAMA_BASE_URL)
        self.model = settings.OLLAMA_EMBED_MODEL
    
    async def embed_text(self, text: str) -> List[float]:
        """Generate embedding for a single text."""
        try:
            response = await self.client.embed(
                model=self.model,
                input=text,
            )
            # Ollama returns embeddings list
            return response["embeddings"][0]
        except Exception as e:
            logger.error(f"Embedding error: {e}")
            raise
    
    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts."""
        try:
            response = await self.client.embed(
                model=self.model,
                input=texts,
            )
            return response["embeddings"]
        except Exception as e:
            logger.error(f"Batch embedding error: {e}")
            raise
    
    @staticmethod
    def cosine_similarity(a: List[float], b: List[float]) -> float:
        """Calculate cosine similarity between two vectors."""
        a_arr = np.array(a)
        b_arr = np.array(b)
        return float(np.dot(a_arr, b_arr) / (np.linalg.norm(a_arr) * np.linalg.norm(b_arr)))
    
    async def health_check(self) -> dict:
        """Check embedding model availability."""
        try:
            test = await self.embed_text("test")
            return {
                "status": "healthy",
                "model": self.model,
                "dimensions": len(test),
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e),
            }


# Singleton
embedding_engine = EmbeddingEngine()
