# ⚡ Quick Start Guide

Get the Siloam Hospital System running in 5 minutes!

## One-Command Setup (Docker)

```bash
# 1. Navigate to project
cd C:\Users\TOSHIBA\CascadeProjects\siloam-hospital-system

# 2. Copy environment file
copy .env.example .env

# 3. Start everything
docker-compose up -d
```

## Access Your Application

After 30 seconds, open your browser:

- 🌐 **Website**: http://localhost:3000
- 🔧 **API**: http://localhost:4000/api/v1
- 📊 **Database Admin**: http://localhost:5050

## First Steps

### 1. Create an Account
- Go to http://localhost:3000/register
- Fill in your details
- Click "Create Account"

### 2. Explore Features
- Browse doctors at http://localhost:3000/doctors
- View specializations
- Book appointments (after login)

### 3. API Testing

Test the API directly:

```bash
# Health check
curl http://localhost:4000/health

# Register user
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

## Stop the Application

```bash
docker-compose down
```

## Troubleshooting

**Containers won't start?**
- Make sure Docker Desktop is running
- Check ports 3000, 4000, 5432 are not in use

**Can't connect to database?**
- Wait 30 seconds for PostgreSQL to initialize
- Check `docker-compose logs db`

**Frontend won't load?**
- Check `docker-compose logs frontend`
- Ensure backend is running first

## Development Mode

Want to modify the code?

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

## Next Steps

- Read the full [README.md](README.md)
- Check [API documentation](http://localhost:4000/api/v1)
- Explore the codebase
- Customize for your needs

---

**Need help?** Check the [SETUP.md](SETUP.md) or create an issue.
