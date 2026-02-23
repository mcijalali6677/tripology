"""
Web Search Module — Finds real prices from travel booking websites.
Uses httpx to query DuckDuckGo. No extra packages needed (httpx already in deps).
Includes curated database of Iranian + international booking sites.
"""
import re
import time
import logging
import urllib.parse
import asyncio
from typing import List, Dict, Any, Optional, Tuple

import httpx

logger = logging.getLogger(__name__)

# ── Simple in-memory cache with TTL ──────────────────────────────────
_cache: Dict[str, Tuple[float, Any]] = {}
CACHE_TTL = 3600  # 1 hour


def _get_cached(key: str) -> Optional[Any]:
    if key in _cache:
        ts, data = _cache[key]
        if time.time() - ts < CACHE_TTL:
            return data
        del _cache[key]
    return None


def _set_cached(key: str, data: Any):
    _cache[key] = (time.time(), data)
    # Evict old entries if cache grows too large
    if len(_cache) > 500:
        now = time.time()
        expired = [k for k, (ts, _) in _cache.items() if now - ts > CACHE_TTL]
        for k in expired:
            del _cache[k]


# ── Known Booking Sites by Category ─────────────────────────────────
BOOKING_SITES: Dict[str, Dict[str, List[Dict[str, str]]]] = {
    "hotel": {
        "domestic": [
            {"name": "اسنپ‌تریپ (Snapptrip)", "url": "https://www.snapptrip.com/hotels"},
            {"name": "علی‌بابا (Alibaba)", "url": "https://www.alibaba.ir/hotel"},
            {"name": "اقامت۲۴", "url": "https://www.eghamat24.ir"},
            {"name": "هتل‌یار", "url": "https://www.hotelyar.com"},
            {"name": "جاباما", "url": "https://www.jabama.com"},
        ],
        "international": [
            {"name": "Booking.com", "url": "https://www.booking.com"},
            {"name": "Agoda", "url": "https://www.agoda.com"},
            {"name": "Hotels.com", "url": "https://www.hotels.com"},
        ],
    },
    "flight": {
        "domestic": [
            {"name": "علی‌بابا", "url": "https://www.alibaba.ir/flights"},
            {"name": "اسنپ‌تریپ", "url": "https://www.snapptrip.com/flights"},
            {"name": "فلای‌تودی", "url": "https://www.flytotoday.ir"},
            {"name": "سفرمارکت", "url": "https://www.safarmarket.com"},
            {"name": "مسترُبلیط", "url": "https://www.mrbilit.com"},
        ],
        "international": [
            {"name": "Skyscanner", "url": "https://www.skyscanner.com"},
            {"name": "Google Flights", "url": "https://www.google.com/travel/flights"},
        ],
    },
    "bus": {
        "domestic": [
            {"name": "علی‌بابا", "url": "https://www.alibaba.ir/bus"},
            {"name": "سفر۷۲۴", "url": "https://www.safar724.com"},
            {"name": "مسترُبلیط", "url": "https://www.mrbilit.com/bus"},
        ],
    },
    "train": {
        "domestic": [
            {"name": "علی‌بابا", "url": "https://www.alibaba.ir/train"},
            {"name": "رجا", "url": "https://www.raja.ir"},
            {"name": "مسترُبلیط", "url": "https://www.mrbilit.com/train"},
        ],
    },
    "attraction": {
        "domestic": [
            {"name": "ایوند (بلیط رویداد)", "url": "https://evand.com"},
            {"name": "تیوال (بلیط فرهنگی)", "url": "https://www.tiwall.com"},
            {"name": "سایت میراث فرهنگی", "url": "https://evisit.ichto.ir"},
        ],
        "international": [
            {"name": "GetYourGuide", "url": "https://www.getyourguide.com"},
            {"name": "Viator", "url": "https://www.viator.com"},
            {"name": "Tiqets", "url": "https://www.tiqets.com"},
        ],
    },
    "restaurant": {
        "domestic": [
            {"name": "اسنپ‌فود", "url": "https://snappfood.ir"},
            {"name": "تپسی فود", "url": "https://food.tapsi.ir"},
        ],
        "international": [
            {"name": "TripAdvisor", "url": "https://www.tripadvisor.com"},
            {"name": "TheFork", "url": "https://www.thefork.com"},
        ],
    },
    "experience": {
        "domestic": [
            {"name": "ایوند", "url": "https://evand.com"},
            {"name": "علی‌بابا اکتیویتی", "url": "https://www.alibaba.ir/activity"},
        ],
        "international": [
            {"name": "Airbnb Experiences", "url": "https://www.airbnb.com/experiences"},
            {"name": "GetYourGuide", "url": "https://www.getyourguide.com"},
            {"name": "Klook", "url": "https://www.klook.com"},
        ],
    },
}

# ── Well-known Iranian attraction ticket prices (updated 1404) ───────
# These serve as fallback when web search doesn't find prices
KNOWN_IRAN_ATTRACTIONS = {
    "نقش جهان": {"price": "۵۰۰,۰۰۰ ریال (۵۰,۰۰۰ تومان)", "source": "میراث فرهنگی", "url": "https://evisit.ichto.ir"},
    "پل خواجو": {"price": "رایگان", "source": "عمومی", "url": ""},
    "سی‌و‌سه پل": {"price": "رایگان", "source": "عمومی", "url": ""},
    "مسجد جامع اصفهان": {"price": "۵۰۰,۰۰۰ ریال", "source": "میراث فرهنگی", "url": "https://evisit.ichto.ir"},
    "کاخ عالی قاپو": {"price": "۵۰۰,۰۰۰ ریال", "source": "میراث فرهنگی", "url": "https://evisit.ichto.ir"},
    "کاخ چهلستون": {"price": "۵۰۰,۰۰۰ ریال", "source": "میراث فرهنگی", "url": "https://evisit.ichto.ir"},
    "کاخ هشت بهشت": {"price": "۵۰۰,۰۰۰ ریال", "source": "میراث فرهنگی", "url": "https://evisit.ichto.ir"},
    "تخت جمشید": {"price": "۱,۵۰۰,۰۰۰ ریال", "source": "میراث فرهنگی", "url": "https://evisit.ichto.ir"},
    "نقش رستم": {"price": "۵۰۰,۰۰۰ ریال", "source": "میراث فرهنگی", "url": "https://evisit.ichto.ir"},
    "حافظیه": {"price": "۵۰۰,۰۰۰ ریال", "source": "میراث فرهنگی", "url": "https://evisit.ichto.ir"},
    "ارگ بم": {"price": "۱,۰۰۰,۰۰۰ ریال", "source": "میراث فرهنگی", "url": "https://evisit.ichto.ir"},
    "باغ ارم": {"price": "۵۰۰,۰۰۰ ریال", "source": "میراث فرهنگی", "url": "https://evisit.ichto.ir"},
    "برج آزادی": {"price": "۵۰۰,۰۰۰ ریال", "source": "میراث فرهنگی", "url": ""},
    "برج میلاد": {"price": "۸۰,۰۰۰ تومان", "source": "سایت رسمی", "url": "https://www.miladtower.ir"},
    "موزه ملی ایران": {"price": "۱,۰۰۰,۰۰۰ ریال", "source": "میراث فرهنگی", "url": "https://evisit.ichto.ir"},
    "کاخ گلستان": {"price": "۱,۰۰۰,۰۰۰ ریال", "source": "میراث فرهنگی", "url": "https://evisit.ichto.ir"},
    "باغ دولت‌آباد": {"price": "۵۰۰,۰۰۰ ریال", "source": "میراث فرهنگی", "url": "https://evisit.ichto.ir"},
    "مسجد شیخ لطف‌الله": {"price": "۵۰۰,۰۰۰ ریال", "source": "میراث فرهنگی", "url": "https://evisit.ichto.ir"},
    "بازار وکیل": {"price": "رایگان", "source": "عمومی", "url": ""},
    "بازار بزرگ تهران": {"price": "رایگان", "source": "عمومی", "url": ""},
    "حمام وکیل": {"price": "۵۰۰,۰۰۰ ریال", "source": "میراث فرهنگی", "url": "https://evisit.ichto.ir"},
}


# ── Public API ───────────────────────────────────────────────────────

async def search_prices(
    query: str,
    category: str = "general",
    max_results: int = 3,
) -> Dict[str, Any]:
    """
    Search for travel prices. Returns web results + relevant booking sites.
    Results are cached for 1 hour to avoid excessive requests.
    """
    cache_key = f"{query}:{category}"
    cached = _get_cached(cache_key)
    if cached:
        logger.info(f"Cache hit: {query}")
        return cached

    result: Dict[str, Any] = {
        "query": query,
        "category": category,
        "search_results": [],
        "booking_sites": [],
        "known_prices": [],
    }

    # 1. Booking site links for this category
    cat_sites = BOOKING_SITES.get(category, {})
    for region in ("domestic", "international"):
        for site in cat_sites.get(region, []):
            result["booking_sites"].append({
                "name": site["name"],
                "url": site["url"],
            })

    # 2. Check known attraction prices
    for name, info in KNOWN_IRAN_ATTRACTIONS.items():
        if name in query:
            result["known_prices"].append({
                "attraction": name,
                "price": info["price"],
                "source": info["source"],
                "url": info["url"],
            })

    # 3. Web search for current prices
    try:
        web_results = await _ddg_search(query, max_results)
        result["search_results"] = web_results
    except Exception as e:
        logger.warning(f"Web search failed for '{query}': {e}")

    _set_cached(cache_key, result)
    return result


async def search_prices_batch(
    queries: List[Dict[str, str]],
    max_results: int = 3,
) -> List[Dict[str, Any]]:
    """Run multiple price searches in parallel (max 6)."""
    queries = queries[:6]
    tasks = [
        search_prices(q["query"], q.get("category", "general"), max_results)
        for q in queries
    ]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    formatted = []
    for i, res in enumerate(results):
        if isinstance(res, Exception):
            logger.error(f"Search error for '{queries[i]['query']}': {res}")
            formatted.append({
                "query": queries[i]["query"],
                "category": queries[i].get("category", "general"),
                "search_results": [],
                "booking_sites": get_booking_sites(queries[i].get("category", "")),
                "error": str(res),
            })
        else:
            formatted.append(res)
    return formatted


def get_booking_sites(category: str) -> List[Dict[str, str]]:
    """Get booking site links for a category."""
    sites: List[Dict[str, str]] = []
    cat = BOOKING_SITES.get(category, {})
    for region in ("domestic", "international"):
        for site in cat.get(region, []):
            sites.append({"name": site["name"], "url": site["url"]})
    return sites


# ── DuckDuckGo HTML search ──────────────────────────────────────────

async def _ddg_search(query: str, max_results: int = 3) -> List[Dict[str, str]]:
    """
    Search DuckDuckGo HTML endpoint. No API key needed.
    Returns: [{"title": "...", "url": "...", "snippet": "..."}, ...]
    """
    try:
        async with httpx.AsyncClient(
            timeout=8.0,
            follow_redirects=True,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/121.0.0.0 Safari/537.36"
                ),
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9",
                "Accept-Language": "fa,en;q=0.9",
            },
        ) as client:
            resp = await client.post(
                "https://html.duckduckgo.com/html/",
                data={"q": query, "kl": "ir-fa"},
            )
            if resp.status_code != 200:
                logger.warning(f"DDG returned status {resp.status_code}")
                return []
            return _parse_ddg_html(resp.text, max_results)
    except httpx.TimeoutException:
        logger.warning(f"DDG search timed out for: {query}")
        return []
    except Exception as e:
        logger.error(f"DDG search error: {e}")
        return []


def _parse_ddg_html(html: str, max_results: int) -> List[Dict[str, str]]:
    """Parse DuckDuckGo HTML search results."""
    results: List[Dict[str, str]] = []

    # Extract result links and titles
    link_pattern = r'class="result__a"[^>]*href="([^"]*)"[^>]*>(.*?)</a>'
    snippet_pattern = r'class="result__snippet"[^>]*>(.*?)</a>'

    links = list(re.finditer(link_pattern, html, re.DOTALL))
    snippets = re.findall(snippet_pattern, html, re.DOTALL)

    for i, match in enumerate(links[:max_results]):
        raw_url = match.group(1)
        title = re.sub(r"<[^>]+>", "", match.group(2)).strip()

        snippet = ""
        if i < len(snippets):
            snippet = re.sub(r"<[^>]+>", "", snippets[i]).strip()

        # Resolve DDG redirect URL
        url = raw_url
        if "uddg=" in url:
            try:
                parsed_qs = urllib.parse.parse_qs(urllib.parse.urlparse(url).query)
                url = urllib.parse.unquote(parsed_qs.get("uddg", [raw_url])[0])
            except Exception:
                pass

        if title:
            results.append({
                "title": title,
                "url": url,
                "snippet": snippet[:300],  # Keep snippets concise
            })

    return results
