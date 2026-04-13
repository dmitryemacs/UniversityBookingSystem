#!/bin/bash
# =============================================================
# One-command Railway deployment — Web + PostgreSQL + Deploy
# =============================================================
set -e

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'

info()  { echo -e "${GREEN}✓${NC} $1"; }
warn()  { echo -e "${YELLOW}!${NC} $1"; }
error() { echo -e "${RED}✗${NC} $1"; }

echo "================================================"
echo "  Railway One-Command Deployment"
echo "  Web + PostgreSQL + Auto-Config"
echo "================================================"
echo ""

# 1. Check Railway CLI
if ! command -v railway &> /dev/null; then
    error "Railway CLI not found."
    echo "  Install: npm install -g @railway/cli"
    exit 1
fi
info "Railway CLI found"

# 2. Login (non-interactive if already logged in)
if ! railway whoami &> /dev/null; then
    warn "Not logged in. Opening browser..."
    railway login
fi
info "Logged in as: $(railway whoami)"

# 3. Create project (skip if already linked)
PROJECT_ID=$(railway status --json 2>/dev/null | grep -o '"projectId":"[^"]*"' | head -1 | cut -d'"' -f4 || true)

if [ -z "$PROJECT_ID" ]; then
    echo ""
    info "Creating project..."
    railway init --name university-booking 2>/dev/null || true
    PROJECT_ID=$(railway status --json 2>/dev/null | grep -o '"projectId":"[^"]*"' | head -1 | cut -d'"' -f4 || true)
    if [ -z "$PROJECT_ID" ]; then
        error "Failed to create/link project. Please run: railway link"
        exit 1
    fi
else
    info "Using existing project: $PROJECT_ID"
fi

# 4. Add PostgreSQL (skip if exists)
echo ""
info "Setting up PostgreSQL..."
# Check if a linked Postgres service exists
PG_EXISTS=$(railway variables list --json 2>/dev/null | grep -o '"DATABASE_URL"' || true)

if [ -z "$PG_EXISTS" ]; then
    railway add postgresql || warn "Could not add PostgreSQL automatically."
    warn "If above failed, add it manually: + New → Database → PostgreSQL"
else
    info "PostgreSQL already linked"
fi

# 5. Verify DATABASE_URL is available
DB_URL=$(railway variables get DATABASE_URL 2>/dev/null || true)
if [ -n "$DB_URL" ]; then
    info "DATABASE_URL is set"
else
    warn "DATABASE_URL not found yet. Make sure PostgreSQL service exists."
    warn "Add it manually: railway add postgresql"
fi

# 6. Set environment variables
echo ""
info "Setting environment variables..."
JWT_SECRET=$(openssl rand -base64 48 2>/dev/null || head -c 64 /dev/urandom | base64 | head -c 48)
railway variables set JWT_SECRET="$JWT_SECRET"

# 7. Deploy
echo ""
info "Deploying..."
railway up --detach || {
    error "Deploy failed. Check logs: railway logs"
    exit 1
}

# 8. Summary
echo ""
echo "================================================"
info "DEPLOYMENT COMPLETE"
echo "================================================"
echo ""
echo "  Status:  railway status"
echo "  Logs:    railway logs"
echo "  Open:    railway open"
echo ""
echo "  Railway Dashboard: https://railway.app/project/$PROJECT_ID"
echo ""
echo "  DATABASE_* vars are auto-set by Railway."
echo "  The app reads DATABASE_URL on startup."
echo ""
