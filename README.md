# Health Tracker

Platform pelacakan kesehatan dengan fitur:
- Dashboard dengan skor kesehatan & BMI
- Tracking data kesehatan harian
- Log gejala fisik & mental
- Rekomendasi makanan, olahraga, aktivitas emosional
- Family sharing dengan approval

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Go + Gin + SQLite
- **Deploy**: Vercel (frontend) + Render (backend)

## Quick Start (Development)

### Backend
```bash
cd backend
go mod tidy
go run main.go  # http://localhost:8080
```

### Frontend
```bash
npm install
npm run dev     # http://localhost:5173
```

## Deploy to Production

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/health-tracker.git
git push -u origin main
```

### 2. Deploy Backend (Render.com)
1. Go to [render.com](https://render.com)
2. New → Web Service → Connect GitHub repo
3. Select `backend` directory
4. Environment: Docker
5. Add env vars: `FRONTEND_URL` = your Vercel URL

### 3. Deploy Frontend (Vercel)
1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repo
3. Add env var: `VITE_API_URL` = your Render backend URL + `/api`
4. Deploy!

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 8080)
- `JWT_SECRET` - Secret key for JWT
- `DATABASE_PATH` - SQLite file path
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend (.env)
- `VITE_API_URL` - Backend API URL
