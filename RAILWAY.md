# Deploy to Railway

## Important: Railway Limitation

Railway's GitHub integration **only creates a web service**. PostgreSQL must be added separately.

There is **no way** to auto-create both services from a GitHub push alone — this is a Railway platform limitation.

---

## Option A: One Command (Recommended)

```bash
./setup-railway.sh
```

Creates: Project + PostgreSQL + Deploy — all automatic.

## Option B: Via Railway Dashboard

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. **Manual step**: Click `+ New` → `Database` → `Add PostgreSQL`
3. Railway auto-links DB to web service via `DATABASE_URL`

## What Variables Are Available

Railway auto-sets these when PostgreSQL is added:

| Variable | Example |
|---|---|
| `DATABASE_URL` | `postgresql://user:pass@internal-host:5432/dbname` |
| `DATABASE_USER` | `postgres` |
| `DATABASE_PASSWORD` | `abc123...` |
| `DATABASE_HOST` | `internal.railway.host` |
| `DATABASE_PORT` | `5432` |
| `DATABASE_NAME` | `railway` |

The app reads all of these automatically via `RailwayConfig.java`.
