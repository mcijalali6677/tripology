#!/bin/bash
# ==========================================
# Tripology Backend Setup Script
# ==========================================
set -e

echo "🚀 Setting up Tripology Backend..."

# 1. Start Docker services
echo "📦 Starting Docker services (DB, Redis, Ollama)..."
docker-compose up -d db redis ollama

# 2. Wait for services to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# 3. Pull AI models via Ollama
echo "🤖 Pulling AI models (this may take a while on first run)..."
echo "   - mistral:7b-instruct (LLM for chat & generation)"
echo "   - nomic-embed-text (Embeddings for RAG & search)"
docker exec tripology-ollama ollama pull mistral:7b-instruct-v0.3-q4_K_M
docker exec tripology-ollama ollama pull nomic-embed-text

# 4. Copy env file
if [ ! -f .env ]; then
    echo "📋 Creating .env from .env.example..."
    cp .env.example .env
fi

# 5. Start API
echo "🔧 Building and starting API..."
docker-compose up -d api

echo ""
echo "✅ Tripology Backend is ready!"
echo ""
echo "📍 API:     http://localhost:8000"
echo "📍 Docs:    http://localhost:8000/docs"
echo "📍 ReDoc:   http://localhost:8000/redoc"
echo "📍 Ollama:  http://localhost:11434"
echo "📍 DB:      localhost:5432 (tripology/tripology_pass)"
echo ""
echo "🔑 Next steps:"
echo "   1. Update .env with secure SECRET_KEY and JWT_SECRET_KEY"
echo "   2. Run: curl http://localhost:8000/api/v1/ai/health"
echo "   3. Connect your frontend to http://localhost:8000/api/v1"
