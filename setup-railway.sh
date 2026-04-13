#!/bin/bash
# Fully automated Railway setup — creates project, PostgreSQL, and deploys
set -e

echo "🚀 Railway Automated Setup"
echo "=========================="

if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not installed."
    echo "   Install: npm install -g @railway/cli"
    exit 1
fi

if ! railway whoami &> /dev/null; then
    echo "🔐 Logging in..."
    railway login
fi

echo ""
echo "📦 Creating project..."
railway init --name university-booking 2>/dev/null || echo "  (project may already exist)"

echo ""
echo "🗄️  Adding PostgreSQL..."
railway add postgresql || true

echo ""
echo "🔑 Generating JWT secret..."
JWT_SECRET=$(openssl rand -base64 48 2>/dev/null || head -c 64 /dev/urandom | base64 | head -c 48)
railway variables set JWT_SECRET="$JWT_SECRET"

echo ""
echo "📋 Railway DATABASE_* variables (auto-provided by Railway):"
echo "   DATABASE_URL           - internal postgresql://..."
echo "   DATABASE_PUBLIC_URL    - external postgresql://..."
echo "   DATABASE_USER          - username"
echo "   DATABASE_PASSWORD      - password"
echo "   DATABASE_HOST          - internal host"
echo "   DATABASE_PUBLIC_HOST   - public host"
echo "   DATABASE_PORT          - port (5432)"
echo "   DATABASE_NAME          - database name"
echo "   Application uses DATABASE_URL first, then falls back to individual vars."

echo ""
echo "🚀 Deploying..."
railway up --detach

echo ""
echo "✅ All done!"
echo "   Check status: railway status"
echo "   View logs:    railway logs"
echo "   Open app:     railway open"
