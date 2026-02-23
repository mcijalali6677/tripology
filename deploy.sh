#!/bin/bash
set -e

APP_DIR=/opt/tripology
LOG=/var/log/tripology-deploy.log

echo "========================================" >> $LOG
echo "Deploy started: $(date)" >> $LOG

cd $APP_DIR

# 1. Pull latest from GitHub
echo "[1/6] Pulling from GitHub..." >> $LOG
git fetch origin master >> $LOG 2>&1
git reset --hard origin/master >> $LOG 2>&1
echo "  Commit: $(git log -1 --oneline)" >> $LOG

# 2. Install frontend dependencies (if package.json changed)
echo "[2/6] Installing frontend deps..." >> $LOG
pnpm install --frozen-lockfile >> $LOG 2>&1 || pnpm install >> $LOG 2>&1

# 3. Build Next.js
echo "[3/6] Building Next.js..." >> $LOG
pnpm build >> $LOG 2>&1

# 4. Install backend deps (if requirements.txt changed)
echo "[4/6] Installing backend deps..." >> $LOG
cd $APP_DIR/backend
source /opt/tripology/backend/venv/bin/activate
pip install -r requirements.txt --quiet >> $LOG 2>&1

# 5. Run migrations
echo "[5/6] Running DB migrations..." >> $LOG
cd $APP_DIR/backend
alembic upgrade head >> $LOG 2>&1 || echo "  Migrations skipped" >> $LOG

# 6. Restart services
echo "[6/6] Restarting services..." >> $LOG
systemctl restart tripology-api >> $LOG 2>&1
systemctl restart tripology-web >> $LOG 2>&1

echo "Deploy finished: $(date)" >> $LOG
echo "========================================" >> $LOG
echo "Deploy complete!"
