"""Lightweight travel personality inference.

Goal: keep chat assistant focused on travel (not general-purpose), while providing
personalized suggestions based on the user's wording and preferences.

This is intentionally heuristic (fast, deterministic, CPU-friendly) and should
be treated as an *inference* to be confirmed by a follow-up question.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Iterable, List


ScoreLevel = str  # "low" | "medium" | "high"


@dataclass(frozen=True)
class TravelProfile:
    personality_scores: Dict[str, ScoreLevel]
    travel_styles: List[str]
    signals: List[str]


def _level(value: int) -> ScoreLevel:
    if value >= 4:
        return "high"
    if value >= 2:
        return "medium"
    return "low"


def infer_travel_profile(user_texts: Iterable[str]) -> TravelProfile:
    """Infer a travel profile from recent user messages.

    Returns scores compatible with backend recommender expectations:
    {adventure, culinary, budget, relaxation, cultural, nature}.

    Notes:
    - Uses keyword heuristics for Persian/English.
    - Does not claim certainty; caller should ask user to confirm.
    """

    text = " \n".join(t for t in user_texts if t).lower()

    raw = {
        "adventure": 0,
        "culinary": 0,
        "budget": 0,
        "relaxation": 0,
        "cultural": 0,
        "nature": 0,
    }
    signals: List[str] = []

    def bump(key: str, amount: int, reason: str) -> None:
        raw[key] += amount
        if reason not in signals:
            signals.append(reason)

    # Budget sensitivity
    if any(k in text for k in ["ارزون", "ارزان", "کم هزینه", "اقتصادی", "بودجه", "budget", "cheap", "affordable", "مقرون به صرفه", "هاستل", "hostel", "backpack"]):
        bump("budget", 3, "budget-sensitive")
    if any(k in text for k in ["لوکس", "لاکچری", "هتل ۵", "vip", "luxury", "premium", "five star", "بوتیک"]):
        raw["budget"] -= 1
        bump("relaxation", 1, "luxury-preference")

    # Relaxation / slow pace
    if any(k in text for k in ["ریلکس", "استراحت", "آرام", "ساحل", "اسپا", "relax", "chill", "spa", "beach", "pool", "استخر", "ماساژ", "wellness", "yoga"]):
        bump("relaxation", 3, "relaxation-seeking")

    # Adventure / high activity
    if any(k in text for k in ["هیجان", "ماجراج", "کوه", "کوهنورد", "اسکی", "غواصی", "hike", "adventure", "trek", "climbing", "rafting", "paragliding", "bungee", "safari", "پاراگلاید", "رفتینگ", "صخره‌نورد", "کمپینگ", "camping"]):
        bump("adventure", 3, "adventure-seeking")

    # Nature
    if any(k in text for k in ["طبیعت", "جنگل", "کوه", "دریا", "کویر", "آبشار", "پارک ملی", "nature", "wildlife", "forest", "desert", "waterfall", "lake", "دریاچه", "باغ", "garden", "eco", "اکو"]):
        bump("nature", 2, "nature-oriented")

    # Culture / history
    if any(k in text for k in ["فرهنگ", "موزه", "تاریخ", "باستان", "گالری", "architecture", "museum", "history", "heritage", "ancient", "قلعه", "castle", "مسجد", "mosque", "cathedral", "کلیسا", "بازار", "bazaar", "صنایع دستی", "handicraft"]):
        bump("cultural", 3, "culture-history")

    # Food
    if any(k in text for k in ["غذا", "رستوران", "کافه", "فود", "street food", "food", "restaurant", "cafe", "cuisine", "آشپزی", "cooking class", "بازار غذا", "food market", "سنتی", "traditional food", "دیزی", "کباب", "kebab"]):
        bump("culinary", 3, "food-focused")

    # Family / kid-friendly
    if any(k in text for k in ["خانوادگی", "بچه", "کودک", "family", "kids", "child", "stroller", "playground", "شهربازی", "amusement"]):
        bump("relaxation", 1, "family-travel")
        bump("nature", 1, "family-travel")

    # Photography / scenic
    if any(k in text for k in ["عکاسی", "photography", "photo", "instagram", "scenic", "منظره", "چشم‌انداز", "viewpoint"]):
        bump("nature", 1, "photography")
        bump("cultural", 1, "photography")

    # Nightlife / party
    if any(k in text for k in ["شبانه", "nightlife", "party", "club", "bar", "پاب", "pub"]):
        bump("adventure", 1, "nightlife")

    # Normalize (avoid negatives)
    for k in list(raw.keys()):
        raw[k] = max(0, raw[k])

    personality_scores: Dict[str, ScoreLevel] = {k: _level(v) for k, v in raw.items()}

    # Map to a small list of travel style labels used across the product.
    travel_styles: List[str] = []
    if personality_scores["cultural"] != "low":
        travel_styles.append("Cultural")
    if personality_scores["culinary"] != "low":
        travel_styles.append("Food")
    if personality_scores["adventure"] != "low":
        travel_styles.append("Adventure")
    if personality_scores["nature"] != "low":
        travel_styles.append("Nature")
    if personality_scores["relaxation"] != "low":
        travel_styles.append("Relaxation")
    if personality_scores["budget"] != "low":
        travel_styles.append("Budget")

    # Ensure stable order
    seen = set()
    travel_styles = [s for s in travel_styles if not (s in seen or seen.add(s))]

    return TravelProfile(
        personality_scores=personality_scores,
        travel_styles=travel_styles,
        signals=signals,
    )


def render_profile_for_prompt(profile: TravelProfile) -> str:
    """Render a short, model-friendly profile block."""

    return (
        "\n═══════════════════════════════════\n"
        " USER TRAVEL PROFILE (INFERRED)\n"
        "═══════════════════════════════════\n"
        f"Personality scores (low/medium/high): {profile.personality_scores}\n"
        f"Travel styles: {profile.travel_styles}\n"
        f"Signals: {profile.signals}\n"
        "Rules:\n"
        "- Treat this as a guess; do NOT state it as certain.\n"
        "- If personalization is important, ask 1 short confirmation question.\n"
    )
