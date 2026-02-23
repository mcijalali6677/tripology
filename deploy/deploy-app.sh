#!/bin/bash
# ==========================================
# Tripology — Deploy App Script
# Run AFTER setup-server.sh
# ==========================================
set -e

DOMAIN="tripology7.shop"
APP_DIR="/opt/tripology"

# ===== Check if project files exist =====
if [ ! -f "$APP_DIR/package.json" ]; then
    echo "❌ Project files not found in $APP_DIR"
    echo "   First copy your project to the server:"
    echo ""
    echo "   FROM YOUR WINDOWS PC, run:"
    echo "   scp -r E:\\summarize-website\\* root@YOUR_SERVER_IP:/opt/tripology/"
    echo ""
    echo "   Or if using Git:"
    echo "   cd /opt/tripology && git clone YOUR_REPO_URL ."
    echo ""
    exit 1
fi

echo "============================================"
echo "  🚀 Deploying Tripology — $DOMAIN"
echo "============================================"

# ===== Ask for keys =====
if [ -z "$SECRET_KEY" ]; then
    read -p "🔑 Enter SECRET_KEY (from setup output): " SECRET_KEY
fi
if [ -z "$JWT_SECRET_KEY" ]; then
    read -p "🔑 Enter JWT_SECRET_KEY (from setup output): " JWT_SECRET_KEY
fi

# ===== 1. Backend Setup =====
echo ""
echo "🐍 [1/5] Setting up Backend (FastAPI)..."
cd $APP_DIR/backend

# Create .env
cat > .env << EOF
APP_NAME=Tripology
DEBUG=false
SECRET_KEY=$SECRET_KEY
ALLOWED_ORIGINS=https://$DOMAIN,http://$DOMAIN

DATABASE_URL=postgresql+asyncpg://tripology:tripology_pass@localhost:5432/tripology_db
REDIS_URL=redis://localhost:6379/0

JWT_SECRET_KEY=$JWT_SECRET_KEY
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral:7b-instruct-v0.3-q4_K_M
OLLAMA_EMBED_MODEL=nomic-embed-text

AI_MAX_TOKENS=2048
AI_TEMPERATURE=0.7
AI_TOP_P=0.9
RAG_TOP_K=5
RAG_SIMILARITY_THRESHOLD=0.7

UPLOAD_DIR=./uploads
MAX_FILE_SIZE_MB=10
EOF

# Create venv and install
python3.12 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Run migrations
mkdir -p uploads
alembic upgrade head 2>/dev/null || echo "   ⚠️ Alembic migration skipped (may need manual setup)"

deactivate
echo "   ✅ Backend ready"

# ===== 2. Frontend Setup =====
echo ""
echo "🌐 [2/5] Building Frontend (Next.js)..."
cd $APP_DIR

# Create frontend env
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=https://$DOMAIN/api/v1
NEXT_PUBLIC_SITE_URL=https://$DOMAIN
EOF

pnpm install
pnpm build
echo "   ✅ Frontend built"

# ===== 3. Systemd Services =====
echo ""
echo "⚙️ [3/5] Creating systemd services..."

# Backend service
cat > /etc/systemd/system/tripology-api.service << EOF
[Unit]
Description=Tripology FastAPI Backend
After=network.target docker.service
Wants=docker.service

[Service]
Type=simple
User=root
WorkingDirectory=$APP_DIR/backend
Environment=PATH=$APP_DIR/backend/venv/bin:/usr/bin:/bin
ExecStart=$APP_DIR/backend/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000 --workers 2
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Frontend service
cat > /etc/systemd/system/tripology-web.service << EOF
[Unit]
Description=Tripology Next.js Frontend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$APP_DIR
Environment=NODE_ENV=production
Environment=NEXT_PUBLIC_API_URL=https://$DOMAIN/api/v1
Environment=NEXT_PUBLIC_SITE_URL=https://$DOMAIN
ExecStart=$(which npx) next start -p 3000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable tripology-api tripology-web
systemctl start tripology-api
systemctl start tripology-web
echo "   ✅ Services created and started"

# ===== 4. Nginx Config =====
echo ""
echo "🌍 [4/5] Configuring Nginx for $DOMAIN..."

cat > /etc/nginx/sites-available/tripology << NGINXEOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Max upload size
    client_max_body_size 10M;

    # Frontend (Next.js)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 120s;
    }

    # Backend API (FastAPI)
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 120s;
    }

    # Backend docs (Swagger)
    location /docs {
        proxy_pass http://127.0.0.1:8000/docs;
        proxy_set_header Host \$host;
    }
    location /openapi.json {
        proxy_pass http://127.0.0.1:8000/openapi.json;
        proxy_set_header Host \$host;
    }
    location /redoc {
        proxy_pass http://127.0.0.1:8000/redoc;
        proxy_set_header Host \$host;
    }
}
NGINXEOF

# Enable site
ln -sf /etc/nginx/sites-available/tripology /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart
nginx -t
systemctl restart nginx
echo "   ✅ Nginx configured"

# ===== 5. SSL Certificate =====
echo ""
echo "🔐 [5/5] Setting up SSL certificate..."
echo "   Make sure DNS A record for $DOMAIN points to this server's IP!"
echo ""
read -p "   Is DNS configured? (y/n): " dns_ready

if [ "$dns_ready" = "y" ] || [ "$dns_ready" = "Y" ]; then
    certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN || {
        echo "   ⚠️ SSL failed. You can retry later with:"
        echo "   certbot --nginx -d $DOMAIN -d www.$DOMAIN"
    }
else
    echo "   ⏭️ Skipping SSL. Run this later after DNS is ready:"
    echo "   certbot --nginx -d $DOMAIN -d www.$DOMAIN"
fi

echo ""
echo "============================================"
echo "  ✅ DEPLOYMENT COMPLETE!"
echo "============================================"
echo ""
echo "  🌍 Website:  https://$DOMAIN"
echo "  📡 API:      https://$DOMAIN/api/v1"
echo "  📚 API Docs: https://$DOMAIN/docs"
echo ""
echo "  📋 Check status:"
echo "     systemctl status tripology-api"
echo "     systemctl status tripology-web"
echo "     docker ps"
echo ""
echo "  📋 View logs:"
echo "     journalctl -u tripology-api -f"
echo "     journalctl -u tripology-web -f"
echo ""
echo "  ⚠️ Note: AI features (Ollama) are disabled"
echo "     due to RAM limits. See README for Groq API setup."
echo "============================================"
