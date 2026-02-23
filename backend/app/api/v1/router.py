"""API v1 Router — aggregates all endpoint routers."""
from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.itineraries import router as itineraries_router
from app.api.v1.chat import router as chat_router
from app.api.v1.search import router as search_router
from app.api.v1.bookings import router as bookings_router
from app.api.v1.admin import router as admin_router
from app.api.v1.vendors import router as vendors_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(itineraries_router)
api_router.include_router(chat_router)
api_router.include_router(search_router)
api_router.include_router(bookings_router)
api_router.include_router(admin_router)
api_router.include_router(vendors_router)
