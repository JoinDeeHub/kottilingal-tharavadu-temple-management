# 🛕 Kottilingal Temple — Setup Guide

## Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local dev)
- Python 3.11+ (for local dev)

## Quick Start (Docker)

```bash
# 1. Clone
git clone https://github.com/JoinDeeHub/kottilingal-tharavadu-temple-management.git
cd kottilingal-tharavadu-temple-management

# 2. Environment setup
cp .env.example .env
# Edit .env with your values

# 3. Launch everything
docker-compose up --build
```

- 🌐 Website: http://localhost:3000
- 🔧 API: http://localhost:8000
- 📖 API Docs: http://localhost:8000/docs

## Create First Admin
```bash
curl -X POST http://localhost:8000/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","email":"admin@temple.com","password":"your_strong_password"}'
```

Then update the user role to admin directly in PostgreSQL:
```sql
UPDATE users SET role='admin' WHERE username='admin';
```

## Add Temple Photos
Place your temple images in `frontend/public/gallery/`:
```
frontend/public/
├── temple-hero.jpg          ← Main hero image
├── favicon.svg
└── gallery/
    ├── temple-1.jpg         ← Night view
    ├── temple-2.jpg         ← Inner sanctum
    ├── temple-3.jpg         ← Festival
    ├── temple-4.jpg         ← Dusk
    ├── temple-5.jpg         ← Overview
    └── temple-6.jpg         ← Family
```

## GitHub Actions Secrets (for CI/CD)
Add these in Settings → Secrets → Actions:
| Secret | Value |
|--------|-------|
| `VPS_HOST` | Your server IP |
| `VPS_USER` | SSH username |
| `VPS_SSH_KEY` | Private SSH key |
| `API_URL` | https://your-domain.com |
| `ADMIN_API_TOKEN` | Admin JWT token |

## VPS Deployment
```bash
# On your VPS:
mkdir -p /opt/kottilingal-temple
cd /opt/kottilingal-temple
git clone https://github.com/JoinDeeHub/kottilingal-tharavadu-temple-management.git .
cp .env.example .env && nano .env
docker-compose up -d
```
