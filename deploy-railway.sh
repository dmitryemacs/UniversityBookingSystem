#!/bin/bash

# Railway Deployment Helper Script
# This script helps you deploy to Railway

set -e

echo "🚀 University Booking System - Railway Deployment Helper"
echo "========================================================"
echo ""

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI is not installed."
    echo ""
    echo "Install it with:"
    echo "  npm install -g @railway/cli"
    echo ""
    echo "Or deploy via the Railway Dashboard:"
    echo "  1. Go to railway.app"
    echo "  2. Create a new project"
    echo "  3. Connect your GitHub repository"
    echo "  4. Add a PostgreSQL database"
    echo "  5. Set environment variables"
    echo ""
    exit 1
fi

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway..."
    railway login
fi

echo "✅ Railway CLI is installed and you're logged in."
echo ""

# Check if project is initialized
if [ ! -f ".railway" ]; then
    echo "📦 Initializing Railway project..."
    railway init
fi

echo "🗄️  Adding PostgreSQL database..."
railway add postgresql 2>/dev/null || echo "Database already exists or linking..."

echo ""
echo "⚙️  Setting environment variables..."

# Prompt for JWT secret
read -p "Enter JWT_SECRET (or press Enter to use default): " jwt_secret
if [ -z "$jwt_secret" ]; then
    jwt_secret="mySecretKeyForJWTTokenGenerationMustBeLongEnough"
    echo "⚠️  Using default JWT secret - NOT RECOMMENDED FOR PRODUCTION!"
fi

railway variables set JWT_SECRET="$jwt_secret"

# Get the project URL
read -p "Enter your Railway app URL (e.g., https://your-app.railway.app): " frontend_url
if [ -n "$frontend_url" ]; then
    railway variables set FRONTEND_URL="$frontend_url"
else
    echo "⚠️  FRONTEND_URL not set - you can set it later in Railway dashboard"
fi

echo ""
echo "🚀 Deploying to Railway..."
railway up

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Check your deployment logs: railway logs"
echo "  2. Visit your deployed application"
echo "  3. Test the API at: https://your-app.railway.app/api-docs"
echo "  4. Access Swagger UI at: https://your-app.railway.app/swagger-ui.html"
echo ""
echo "📖 For more information, see RAILWAY_DEPLOYMENT.md"
