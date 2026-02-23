"""
AI Recommendation Engine — Personality-based itinerary matching.
Uses embeddings + scoring to find best-fit itineraries for users.
"""
import logging
from typing import Dict, Any, List, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text

from app.ai.embeddings import embedding_engine
from app.ai.llm_engine import llm_engine
from app.models.itinerary import Itinerary

logger = logging.getLogger(__name__)


class RecommendationEngine:
    """Match users to itineraries based on personality and preferences."""
    
    # Weights for different scoring factors
    WEIGHTS = {
        "personality_match": 0.35,
        "style_match": 0.25,
        "budget_match": 0.20,
        "semantic_match": 0.20,
    }
    
    async def get_recommendations(
        self,
        db: AsyncSession,
        user_preferences: Dict[str, Any],
        limit: int = 6,
    ) -> List[Dict[str, Any]]:
        """
        Get personalized itinerary recommendations.
        
        user_preferences should include:
        - personality_scores: {adventure, culinary, budget, relaxation, cultural, nature}
        - travel_styles: ["Romantic", "Cultural", ...]
        - budget_range: {min, max}
        - preferred_duration: int (days)
        - query: str (optional natural language preference)
        """
        # 1. Get all published itineraries
        result = await db.execute(
            select(Itinerary).where(Itinerary.is_published == True)
        )
        itineraries = result.scalars().all()
        
        if not itineraries:
            return []
        
        # 2. Score each itinerary
        scored = []
        for itin in itineraries:
            score = self._calculate_match_score(itin, user_preferences)
            scored.append({
                "itinerary_id": str(itin.id),
                "title": itin.title,
                "destination": itin.destination,
                "match_score": round(score, 2),
                "reasons": self._get_match_reasons(itin, user_preferences),
            })
        
        # 3. If user provided a query, boost by semantic similarity
        query = user_preferences.get("query")
        if query:
            query_embedding = await embedding_engine.embed_text(query)
            for item in scored:
                itin = next((i for i in itineraries if str(i.id) == item["itinerary_id"]), None)
                if itin and itin.embedding:
                    similarity = embedding_engine.cosine_similarity(
                        query_embedding, list(itin.embedding)
                    )
                    item["match_score"] += similarity * self.WEIGHTS["semantic_match"]
        
        # 4. Sort and return top N
        scored.sort(key=lambda x: x["match_score"], reverse=True)
        return scored[:limit]
    
    def _calculate_match_score(
        self,
        itinerary: Itinerary,
        preferences: Dict[str, Any],
    ) -> float:
        """Calculate how well an itinerary matches user preferences."""
        score = 0.0
        
        # Personality match
        user_scores = preferences.get("personality_scores", {})
        itin_scores = itinerary.personality_scores or {}
        if user_scores and itin_scores:
            personality_score = self._personality_match(user_scores, itin_scores)
            score += personality_score * self.WEIGHTS["personality_match"]
        
        # Travel style overlap
        user_styles = set(s.lower() for s in preferences.get("travel_styles", []))
        itin_styles = set(s.lower() for s in (itinerary.travel_styles or []))
        if user_styles and itin_styles:
            overlap = len(user_styles & itin_styles) / max(len(user_styles), 1)
            score += overlap * self.WEIGHTS["style_match"]
        
        # Budget match
        budget = preferences.get("budget_range", {})
        if budget and itinerary.budget_min and itinerary.budget_max:
            budget_score = self._budget_match(
                budget.get("min", 0),
                budget.get("max", 10000),
                itinerary.budget_min,
                itinerary.budget_max,
            )
            score += budget_score * self.WEIGHTS["budget_match"]
        
        return min(score, 1.0)
    
    @staticmethod
    def _personality_match(user: Dict, itinerary: Dict) -> float:
        """Match personality scores (high=3, medium=2, low=1)."""
        level_map = {"high": 3, "medium": 2, "low": 1}
        
        total_diff = 0
        count = 0
        for key in ["adventure", "culinary", "budget", "relaxation", "cultural", "nature"]:
            if key in user and key in itinerary:
                u_val = level_map.get(user[key], 2)
                i_val = level_map.get(itinerary[key], 2)
                total_diff += abs(u_val - i_val)
                count += 1
        
        if count == 0:
            return 0.5
        
        # Max possible diff = 2 per category
        max_diff = count * 2
        return 1.0 - (total_diff / max_diff)
    
    @staticmethod
    def _budget_match(user_min: float, user_max: float, itin_min: float, itin_max: float) -> float:
        """How well budgets overlap (0-1)."""
        overlap_start = max(user_min, itin_min)
        overlap_end = min(user_max, itin_max)
        
        if overlap_start >= overlap_end:
            # No overlap — penalize based on distance
            gap = overlap_start - overlap_end
            max_range = max(user_max - user_min, itin_max - itin_min, 1)
            return max(0, 1.0 - (gap / max_range))
        
        overlap = overlap_end - overlap_start
        total_range = max(user_max - user_min, 1)
        return min(overlap / total_range, 1.0)
    
    @staticmethod
    def _get_match_reasons(itinerary: Itinerary, preferences: Dict) -> List[str]:
        """Generate human-readable reasons for the match."""
        reasons = []
        
        # Style matches
        user_styles = set(s.lower() for s in preferences.get("travel_styles", []))
        itin_styles = set(s.lower() for s in (itinerary.travel_styles or []))
        common = user_styles & itin_styles
        if common:
            reasons.append(f"Matches your {', '.join(common)} style")
        
        # Budget
        budget = preferences.get("budget_range", {})
        if budget and itinerary.budget_min:
            if budget.get("min", 0) <= itinerary.budget_max and budget.get("max", 99999) >= itinerary.budget_min:
                reasons.append("Within your budget range")
        
        # Rating
        if itinerary.rating and itinerary.rating >= 4.7:
            reasons.append(f"Highly rated ({itinerary.rating}★)")
        
        # Verified
        if itinerary.is_verified:
            reasons.append("Verified itinerary")
        
        return reasons[:4]


# Singleton
recommendation_engine = RecommendationEngine()
