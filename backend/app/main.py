"""
Tripology Backend — FastAPI Application Entry Point.
Self-hosted AI travel marketplace API.
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from app.config import get_settings
from app.database import init_db
from app.api.v1.router import api_router

settings = get_settings()

# Configure logging
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Startup
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    
    # Initialize database tables
    await init_db()
    logger.info("Database initialized")
    
    # Check AI services
    from app.ai.llm_engine import llm_engine
    health = await llm_engine.health_check()
    if health["status"] == "healthy":
        logger.info(f"AI Engine ready: {health['model']}")
    else:
        logger.warning(f"AI Engine not ready: {health.get('error', 'unknown')}")
        logger.warning("Start Ollama with: ollama serve && ollama pull mistral:7b-instruct-v0.3-q4_K_M")
    
    yield
    
    # Shutdown
    logger.info("Shutting down...")


app = FastAPI(
    title=settings.APP_NAME,
    description="Self-hosted AI Travel Itinerary Marketplace API",
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ===== Middleware =====

# CORS — Allow frontend & mobile apps
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gzip compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# ===== Routes =====

app.include_router(api_router)


@app.get("/")
async def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "status": "running",
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}
