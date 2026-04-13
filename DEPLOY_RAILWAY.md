# 🚀 Deploy to Railway - Quick Start Guide

## What You Get

✅ Fully deployed application with HTTPS  
✅ PostgreSQL database (managed)  
✅ Swagger UI for API documentation  
✅ Automatic health checks  
✅ Zero configuration needed  

## Option 1: One-Click Deploy (Easiest)

1. **Go to Railway**: https://railway.app
2. **Login** or create an account
3. **New Project** → **Deploy from GitHub repo**
4. **Select your repository**: `UniversityBookingSystem`
5. **Add PostgreSQL**:
   - Click "+ New" → "Database" → "PostgreSQL"
   - Railway auto-provisions the database
6. **Set Environment Variables**:
   - Go to your service → Variables
   - Add `JWT_SECRET`: any long random string (e.g., `my-super-secret-key-for-production-12345`)
   - Add `FRONTEND_URL`: your app URL (e.g., `https://your-app.railway.app`)
7. **Wait for deployment** (5-10 minutes first time)
8. **Done!** Visit your app at the Railway-provided URL

## Option 2: Deploy with CLI

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Deploy (interactive - guides you through setup)
./deploy-railway.sh
```

## Option 3: Manual CLI Deploy

```bash
# Initialize project
railway init

# Add database
railway add postgresql

# Set variables
railway variables set JWT_SECRET="your-secret-key-here"
railway variables set FRONTEND_URL="https://your-app.railway.app"

# Deploy
railway up
```

## After Deployment

### Access Your Application

- **API**: `https://your-app.railway.app/api-docs`
- **Swagger UI**: `https://your-app.railway.app/swagger-ui.html`

### Test Your API

```bash
# Register a user
curl -X POST https://your-app.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "department": "Computer Science"
  }'

# Login
curl -X POST https://your-app.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "student1", "password": "password"}'
```

### Default Users

| Username   | Password | Role      |
|------------|----------|-----------|
| student1   | password | STUDENT   |
| professor1 | password | PROFESSOR |
| admin      | password | ADMIN     |

## Troubleshooting

**App won't start?**
- Check logs in Railway dashboard
- Verify `JWT_SECRET` is set
- Ensure PostgreSQL database is provisioned

**Database errors?**
- Railway automatically provides `DATABASE_URL`
- The app auto-parses this variable
- Check Flyway migration logs

**Need help?**
- See `RAILWAY_DEPLOYMENT.md` for detailed guide
- Railway Docs: https://docs.railway.app

## What's Configured Automatically

✅ Docker multi-stage build (frontend + backend)  
✅ DATABASE_URL parsing from Railway  
✅ Environment variable configuration  
✅ Health checks for monitoring  
✅ CORS for your frontend URL  
✅ Flyway database migrations  

## Security Checklist

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Set `FRONTEND_URL` to your actual deployed URL
- [ ] Don't commit `.env` files to Git
- [ ] Enable two-factor auth on Railway account

---

**That's it!** Your application is now live on Railway 🎉
