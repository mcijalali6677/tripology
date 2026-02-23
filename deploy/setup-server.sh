#!/bin/bash
# ==========================================
# Tripology — Full Server Setup Script
# Ubuntu 22.04 LTS | 4GB RAM | 2 CPU
# ==========================================
set -e

DOMAIN="tripology7.shop"
APP_DIR="/opt/tripology"

echo "============================================"
echo "  🚀 Tripology Server Setup — $DOMAIN"
echo "============================================"
echo ""

# ===== 1. System Update =====
echo "📦 [1/10] Updating system packages..."
apt update && apt upgrade -y
apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release build-essential libpq-dev

# ===== 2. Swap (critical for 4GB RAM) =====
echo "💾 [2/10] Setting up 4GB swap..."
if [ ! -f /swapfile ]; then
    fallocate -l 4G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    # Optimize swap usage
    echo 'vm.swappiness=10' >> /etc/sysctl.conf
    sysctl -p
    echo "   ✅ Swap created (4GB)"
else
    echo "   ✅ Swap already exists"
fi
free -h

# ===== 3. Docker =====
echo "🐳 [3/10] Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    echo "   ✅ Docker installed"
else
    echo "   ✅ Docker already installed"
fi
docker --version

# ===== 4. Node.js 20 + pnpm =====
echo "🟢 [4/10] Installing Node.js 20 + pnpm..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
    echo "   ✅ Node.js installed"
else
    echo "   ✅ Node.js already installed"
fi
if ! command -v pnpm &> /dev/null; then
    npm install -g pnpm
    echo "   ✅ pnpm installed"
else
    echo "   ✅ pnpm already installed"
fi
node -v && pnpm -v

# ===== 5. Python 3.12 =====
echo "🐍 [5/10] Installing Python 3.12..."
if ! command -v python3.12 &> /dev/null; then
    add-apt-repository -y ppa:deadsnakes/ppa
    apt update
    apt install -y python3.12 python3.12-venv python3.12-dev
    echo "   ✅ Python 3.12 installed"
else
    echo "   ✅ Python 3.12 already installed"
fi
python3.12 --version

# ===== 6. Nginx + Certbot =====
echo "🌐 [6/10] Installing Nginx + Certbot..."
apt install -y nginx certbot python3-certbot-nginx
systemctl enable nginx
echo "   ✅ Nginx installed"

# ===== 7. Firewall =====
echo "🔒 [7/10] Configuring firewall..."
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable
echo "   ✅ Firewall configured (SSH + HTTP + HTTPS)"

# ===== 8. Create app directory =====
echo "📁 [8/10] Creating app directory..."
mkdir -p $APP_DIR
echo "   ✅ $APP_DIR ready"

# ===== 9. Docker Compose for DB + Redis =====
echo "🗄️ [9/10] Setting up PostgreSQL + Redis..."
cat > $APP_DIR/docker-compose.prod.yml << 'DCEOF'
services:
  db:
    image: pgvector/pgvector:pg16
    container_name: tripology-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: tripology_db
      POSTGRES_USER: tripology
      POSTGRES_PASSWORD: tripology_pass
    ports:
      - "127.0.0.1:5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U tripology -d tripology_db"]
      interval: 10s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          memory: 512M

  redis:
    image: redis:7-alpine
    container_name: tripology-redis
    restart: unless-stopped
    ports:
      - "127.0.0.1:6379:6379"
    volumes:
      - redisdata:/data
    deploy:
      resources:
        limits:
          memory: 128M

volumes:
  pgdata:
  redisdata:
DCEOF

cd $APP_DIR
docker compose -f docker-compose.prod.yml up -d

echo "   ⏳ Waiting for PostgreSQL to be ready..."
sleep 10
docker ps
echo "   ✅ PostgreSQL + Redis running"

# ===== 10. Generate secrets =====
echo "🔑 [10/10] Generating secure keys..."
SECRET_KEY=$(openssl rand -hex 32)
JWT_SECRET_KEY=$(openssl rand -hex 32)

echo ""
echo "============================================"
echo "  ✅ SERVER SETUP COMPLETE!"
echo "============================================"
echo ""
echo "  OS:       Ubuntu 22.04"
echo "  Swap:     4GB"
echo "  Docker:   $(docker --version)"
echo "  Node.js:  $(node -v)"
echo "  pnpm:     $(pnpm -v)"
echo "  Python:   $(python3.12 --version 2>&1)"
echo "  Nginx:    $(nginx -v 2>&1)"
echo ""
echo "  PostgreSQL: Running (localhost:5432)"
echo "  Redis:      Running (localhost:6379)"
echo ""
echo "  🔑 SECRET_KEY:     $SECRET_KEY"
echo "  🔑 JWT_SECRET_KEY: $JWT_SECRET_KEY"
echo ""
echo "  📋 SAVE THESE KEYS! You'll need them next."
echo ""
echo "============================================"
echo "  NEXT: Run deploy-app.sh to deploy the app"
echo "============================================"
