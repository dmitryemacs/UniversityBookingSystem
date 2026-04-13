# Railway Deployment Guide

This guide explains how to deploy the University Equipment Booking System to Railway.

## Prerequisites

- A Railway account (sign up at [railway.app](https://railway.app))
- Railway CLI installed (optional, but recommended)
- Git repository with your project

## Deployment Steps

### Option 1: Deploy via Railway Dashboard (Recommended)

1. **Go to Railway Dashboard**
   - Visit [railway.app](https://railway.app) and log in
   - Click "New Project"

2. **Connect your Git repository**
   - Select "Deploy from GitHub repo"
   - Choose your UniversityBookingSystem repository
   - Railway will automatically detect the Dockerfile

3. **Add PostgreSQL Database**
   - In your project, click "+ New"
   - Select "Database" > "PostgreSQL"
   - Railway will automatically provision a PostgreSQL database

4. **Configure Environment Variables**
   
   In the Railway dashboard, go to your service settings and add these environment variables:

   | Variable | Description | Example Value |
   |----------|-------------|---------------|
   | `JWT_SECRET` | Secret key for JWT token generation | `your-super-secret-key-change-this-in-production` |
   | `FRONTEND_URL` | URL of your frontend (for CORS) | `https://your-app.railway.app` |
   | `PORT` | Application port (Railway sets this automatically) | `8080` |

   **Note**: Railway automatically provides `DATABASE_URL`, `DATABASE_USER`, and `DATABASE_PASSWORD` when you add a PostgreSQL database. The application is configured to use these automatically.

5. **Deploy**
   - Railway will automatically build and deploy your application
   - The first deployment may take 5-10 minutes

### Option 2: Deploy via Railway CLI

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Initialize your project**
   ```bash
   railway init
   ```

4. **Add PostgreSQL database**
   ```bash
   railway add postgresql
   ```

5. **Set environment variables**
   ```bash
   railway variables set JWT_SECRET="your-super-secret-key"
   railway variables set FRONTEND_URL="https://your-app.railway.app"
   ```

6. **Deploy**
   ```bash
   railway up
   ```

## Automatic Configuration

The application is pre-configured for Railway deployment:

- **DATABASE_URL Parsing**: The application automatically parses Railway's `DATABASE_URL` format (`postgresql://user:pass@host:port/dbname`)
- **Environment Variables**: All configuration uses environment variables with sensible defaults
- **Health Checks**: Docker health check is configured for Railway's health monitoring
- **Static Files**: Frontend build is bundled with the backend JAR and served automatically

## Post-Deployment

### Access Your Application

1. In the Railway dashboard, click on your service
2. Go to the "Settings" tab
3. Find your deployed URL (e.g., `https://your-app.railway.app`)
4. Access the API at `https://your-app.railway.app`
5. Access Swagger UI at `https://your-app.railway.app/swagger-ui.html`

### Default Users

The application comes with sample users (see README.md for credentials). You can create additional users via the registration API.

### Testing Your Deployment

```bash
# Test API health
curl https://your-app.railway.app/api-docs

# Register a new user
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
  -d '{
    "username": "student1",
    "password": "password"
  }'
```

## Troubleshooting

### Application Won't Start

1. **Check logs** in Railway dashboard
2. **Verify DATABASE_URL** is set correctly
3. **Check JWT_SECRET** is configured
4. **Ensure PORT** is set to 8080 (or Railway's assigned port)

### Database Connection Issues

- Railway automatically provides `DATABASE_URL`, `DATABASE_USER`, and `DATABASE_PASSWORD`
- The application initializer (`RailwayConfig.java`) converts these to Spring Boot format
- Check logs for database migration (Flyway) errors

### CORS Issues

If you experience CORS issues:
1. Set the `FRONTEND_URL` environment variable to your frontend URL
2. The application will configure CORS to allow requests from this URL

### Port Issues

Railway automatically sets the `PORT` environment variable. The application is configured to use this variable with a default of 8080.

## Advanced Configuration

### Email Configuration (Optional)

For password reset functionality, configure email:

```bash
railway variables set MAIL_HOST="smtp.gmail.com"
railway variables set MAIL_PORT="587"
railway variables set MAIL_USERNAME="your-email@gmail.com"
railway variables set MAIL_PASSWORD="your-password"
```

### Custom Domain

1. Go to your service in Railway dashboard
2. Click "Settings" > "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Scaling

Railway handles scaling automatically. You can configure:
- **Replicas**: Number of application instances
- **Vertical scaling**: CPU and memory allocation
- **Database scaling**: Storage and compute for PostgreSQL

## Project Structure for Railway

- `railway.json`: Railway configuration
- `Dockerfile`: Multi-stage build for optimized deployment
- `docker-compose.yml`: Local development (not used in Railway)
- `src/main/java/com/univer/booking/config/RailwayConfig.java`: DATABASE_URL parser

## Updating Your Deployment

Push changes to your Git repository, and Railway will automatically rebuild and redeploy your application.

You can also trigger a manual redeployment:
```bash
railway up
```

## Security Best Practices

1. **Change JWT_SECRET**: Use a strong, random secret (at least 256 bits)
2. **Use environment variables**: Never commit secrets to Git
3. **Enable HTTPS**: Railway provides HTTPS automatically
4. **Regular updates**: Keep dependencies updated for security patches

## Support

- Railway Documentation: [docs.railway.app](https://docs.railway.app)
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
