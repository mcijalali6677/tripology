"""
AI Itinerary Generator — Creates custom day-by-day trip plans.
Uses self-hosted LLM to generate structured itineraries from user's basket.
"""
import json
import logging
from typing import Dict, Any, List, Optional
from app.ai.llm_engine import llm_engine
from app.ai.prompts.templates import ITINERARY_GENERATOR_SYSTEM

logger = logging.getLogger(__name__)


class ItineraryGenerator:
    """Generate structured travel itineraries using self-hosted AI."""
    
    async def generate(
        self,
        basket: List[Dict[str, Any]],
        trip_days: int,
        travelers: int,
        destination: str = "Paris, France",
        start_date: str = "2026-03-14",
        budget_level: str = "mid",
    ) -> Dict[str, Any]:
        """
        Generate a complete day-by-day itinerary from user's activity basket.
        Returns structured JSON.
        """
        # Build basket summary
        basket_summary = "\n".join([
            f"- {item['title']} ({item.get('category', 'activity')}): "
            f"{item.get('description', '')}. "
            f"Duration: {item.get('duration', 'N/A')}, "
            f"Cost: ${item.get('cost', 0)}"
            + (f", Date: {item['date']}" if item.get('date') else "")
            for item in basket
        ])
        
        prompt = f"""Create a detailed day-by-day itinerary for {destination}.

Trip Details:
- Duration: {trip_days} days
- Travelers: {travelers} people
- Start Date: {start_date}
- Budget Level: {budget_level}

Selected Activities:
{basket_summary}

Create an optimized itinerary that:
1. Spreads activities logically across all {trip_days} days
2. Groups nearby activities together
3. Includes meal times (breakfast, lunch, dinner)
4. Leaves free time for spontaneous exploration
5. Considers best times to visit each place
6. Places events on their specific dates if provided
7. Includes transport suggestions between locations

Return ONLY valid JSON with this exact structure:
{{
    "title": "string",
    "summary": "string",
    "totalDays": number,
    "estimatedTotalCost": number,
    "days": [
        {{
            "dayNumber": number,
            "date": "YYYY-MM-DD",
            "theme": "string",
            "activities": [
                {{
                    "timePeriod": "early_morning|morning|midday|afternoon|evening",
                    "title": "string",
                    "description": "string",
                    "location": "string",
                    "duration": "string",
                    "type": "activity|restaurant|cafe|transport|experience",
                    "estimatedCost": number,
                    "tips": "string"
                }}
            ]
        }}
    ],
    "packingTips": ["string"],
    "localTips": ["string"],
    "checklist": [
        {{
            "id": "string",
            "category": "book|buy|register|prepare|pack",
            "title": "string",
            "description": "string",
            "completed": false
        }}
    ]
}}"""
        
        try:
            response = await llm_engine.generate_structured(
                prompt=prompt,
                system=ITINERARY_GENERATOR_SYSTEM,
                temperature=0.5,
            )
            
            # Parse JSON response
            itinerary = json.loads(response)
            return itinerary
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse itinerary JSON: {e}")
            # Try to extract JSON from response
            return await self._extract_json(response)
        except Exception as e:
            logger.error(f"Itinerary generation failed: {e}")
            raise
    
    async def swap_activity(
        self,
        current_activity: Dict[str, Any],
        day_theme: str,
        destination: str,
        travel_style: str = "general",
    ) -> List[Dict[str, Any]]:
        """Suggest 3 alternative activities to swap with current one."""
        from app.ai.prompts.templates import ACTIVITY_SWAP_SYSTEM
        
        prompt = f"""The user is in {destination} and wants to replace this activity:

Current Activity: "{current_activity.get('title', '')}"
Description: "{current_activity.get('description', '')}"
Location: "{current_activity.get('location', '')}"
Day Theme: "{day_theme}"
Travel Style: {travel_style}

Suggest 3 alternative activities as a JSON array.
Each must have: title, description, location, type, cost (number), duration."""
        
        try:
            response = await llm_engine.generate_structured(
                prompt=prompt,
                system=ACTIVITY_SWAP_SYSTEM,
                temperature=0.7,
            )
            alternatives = json.loads(response)
            if isinstance(alternatives, list):
                return alternatives[:3]
            return alternatives.get("alternatives", [])[:3]
        except Exception as e:
            logger.error(f"Activity swap failed: {e}")
            raise
    
    async def _extract_json(self, text: str) -> Dict:
        """Try to extract JSON from a text response."""
        # Look for JSON block
        start = text.find("{")
        end = text.rfind("}") + 1
        if start >= 0 and end > start:
            try:
                return json.loads(text[start:end])
            except json.JSONDecodeError:
                pass
        raise ValueError("Could not extract valid JSON from AI response")


# Singleton
itinerary_generator = ItineraryGenerator()
