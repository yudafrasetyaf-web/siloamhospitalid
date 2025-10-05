# 🚀 Quick Setup Guide

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Git

## Installation Steps

### 1. Clone & Configure

```bash
git clone <repository-url>
cd siloam-hospital-system
cp .env.example .env
```

Edit `.env` and change:
- `DB_PASSWORD` (use a strong password)
- `JWT_SECRET` (use a long random string)

### 2. Start Application

```bash
docker-compose up -d
```

### 3. Access Services

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000/api/v1
- **pgAdmin**: http://localhost:5050

### 4. Create Admin User (Optional)

```bash
docker-compose exec backend npm run seed
```

## Development Mode

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

## Troubleshooting

**Port conflicts**: Change ports in `.env` and `docker-compose.yml`

**Database connection**: Ensure PostgreSQL is running and credentials are correct

**Build errors**: Clear Docker cache with `docker-compose build --no-cache`

## Default Credentials

No default users created. Register a new account at http://localhost:3000/register
