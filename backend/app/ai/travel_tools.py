"""
Travel Tools — Function calling definitions for AI price search.
Defines tools that the AI can call via Groq/OpenAI function calling
to search the web for real, current travel prices.
"""
import json
import logging
from typing import Dict, Any, List

from app.ai.web_search import search_prices_batch, get_booking_sites

logger = logging.getLogger(__name__)


# ── Tool Definitions (OpenAI-compatible function calling format) ─────
TRAVEL_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "search_travel_prices",
            "description": (
                "Search the internet for REAL, current travel prices. "
                "Use for hotels, flights, buses, trains, museum/attraction tickets, "
                "restaurant prices, and experience costs. "
                "ALWAYS call this before creating [BASKET_ITEM] blocks to get accurate, "
                "up-to-date pricing with booking website links. "
                "Search multiple items at once for efficiency."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "queries": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "query": {
                                    "type": "string",
                                    "description": (
                                        "Specific search query for prices. Use the user's language. "
                                        "Examples: "
                                        "'قیمت هتل ۳ ستاره اصفهان ۱۴۰۴', "
                                        "'بلیط اتوبوس VIP تهران اصفهان قیمت', "
                                        "'قیمت بلیط ورودی نقش جهان ۱۴۰۴', "
                                        "'Isfahan boutique hotel price per night', "
                                        "'restaurant average cost Isfahan'"
                                    ),
                                },
                                "category": {
                                    "type": "string",
                                    "enum": [
                                        "hotel", "flight", "bus", "train",
                                        "attraction", "restaurant", "experience",
                                    ],
                                    "description": "Category of price search",
                                },
                            },
                            "required": ["query", "category"],
                        },
                        "description": "List of price searches (executed in parallel, max 6)",
                    },
                },
                "required": ["queries"],
            },
        },
    },
]


async def execute_tool_call(tool_call: Dict[str, Any]) -> str:
    """
    Execute a tool call from the AI and return the result as a JSON string.
    The result is fed back to the AI as context for generating basket items.
    """
    func_name = tool_call.get("function", {}).get("name", "")
    args_str = tool_call.get("function", {}).get("arguments", "{}")

    try:
        args = json.loads(args_str)
    except json.JSONDecodeError as e:
        logger.error(f"Invalid tool arguments: {e}")
        return json.dumps({"error": f"Invalid arguments: {e}"}, ensure_ascii=False)

    if func_name == "search_travel_prices":
        return await _handle_price_search(args)

    return json.dumps({"error": f"Unknown tool: {func_name}"}, ensure_ascii=False)


async def _handle_price_search(args: Dict) -> str:
    """Handle the search_travel_prices tool call."""
    queries = args.get("queries", [])
    if not queries:
        return json.dumps({"error": "No queries provided"}, ensure_ascii=False)

    logger.info(f"Executing {len(queries)} price searches: {[q['query'] for q in queries]}")

    results = await search_prices_batch(queries, max_results=3)

    # Build a concise summary for the AI
    summary_parts = []
    for r in results:
        part = {
            "query": r.get("query", ""),
            "category": r.get("category", ""),
        }
        # Include search results (title + snippet + url)
        if r.get("search_results"):
            part["web_results"] = [
                {
                    "title": sr["title"],
                    "url": sr["url"],
                    "info": sr["snippet"],
                }
                for sr in r["search_results"]
            ]
        # Include known attraction prices
        if r.get("known_prices"):
            part["verified_prices"] = r["known_prices"]
        # Include booking sites
        if r.get("booking_sites"):
            part["where_to_buy"] = r["booking_sites"]
        if r.get("error"):
            part["search_error"] = r["error"]

        summary_parts.append(part)

    return json.dumps(summary_parts, ensure_ascii=False)


def should_use_tools(message: str, history: List[Dict[str, str]]) -> bool:
    """
    Heuristic to decide if web search tools should be activated for this message.
    Only activates tools when price/basket generation is likely needed,
    to avoid unnecessary latency on casual conversation messages.
    """
    text = message.lower()

    # Direct price/basket triggers
    PRICE_KEYWORDS = {
        # Persian
        "سبد", "خرید", "قیمت", "بلیط", "رزرو", "هزینه", "بودجه",
        "ارزان", "گران", "بساز", "پیشنهاد بده", "چقدر",
        # English
        "basket", "price", "cost", "buy", "book", "ticket",
        "reserve", "budget", "cheap", "expensive", "how much",
    }

    # Check for price-related keywords in current message
    if any(kw in text for kw in PRICE_KEYWORDS):
        return True

    # If conversation is mature (Phase 3-4), enable tools automatically
    user_messages = [m for m in (history or []) if m.get("role") == "user"]
    if len(user_messages) >= 3:
        # At Phase 3-4, travel categories mentioned = enable tools
        TRAVEL_CATS = {"هتل", "hotel", "رستوران", "restaurant", "پرواز", "flight",
                       "اتوبوس", "bus", "قطار", "train", "موزه", "museum"}
        all_text = text + " " + " ".join(m.get("content", "").lower() for m in history[-4:])
        if any(cat in all_text for cat in TRAVEL_CATS):
            return True

    return False
