# 🚀 Deployment Guide - Live Polling System

## Quick Start (Development)

### 1. Install Dependencies

```bash
# Install all dependencies for root, server, and client
npm run install:all
```

### 2. Environment Setup

Create `.env` file in `/server` directory:

```env
PORT=5000
VITE_API_URL=http://localhost:5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

Create `.env` file in `/client` directory:

```env
VITE_API_URL=http://localhost:5000
```

### 3. Start Development Servers

```bash
# Starts both client and server concurrently
npm run dev
```

This will start:

- **Client**: http://localhost:5173 (Vite dev server)
- **Server**: http://localhost:5000 (Express server)

## 🌐 Production Deployment

### Option 1: Vercel + Railway (Recommended)

#### Deploy Backend (Railway)

1. Create account at [Railway](https://railway.app)
2. Connect your GitHub repository
3. Deploy the `/server` folder
4. Set environment variables in Railway dashboard:
   - `PORT` (Railway sets this automatically)
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
5. Note your Railway backend URL (e.g., `https://your-app.railway.app`)

#### Deploy Frontend (Vercel)

1. Create account at [Vercel](https://vercel.com)
2. Connect your GitHub repository
3. Set root directory to `/client`
4. Set environment variable:
   - `VITE_API_URL=https://your-railway-backend-url`
5. Deploy

### Option 2: Heroku (Full Stack)

#### Backend Deployment

```bash
# In /server directory
heroku create your-app-name-backend
heroku config:set SUPABASE_URL=your_url
heroku config:set SUPABASE_ANON_KEY=your_key
git subtree push --prefix server heroku main
```

#### Frontend Deployment

```bash
# In /client directory
heroku create your-app-name-frontend
heroku config:set VITE_API_URL=https://your-backend-url.herokuapp.com
heroku buildpacks:set https://github.com/heroku/heroku-buildpack-nodejs
git subtree push --prefix client heroku main
```

### Option 3: Netlify + Railway

#### Backend: Railway (same as Option 1)

#### Frontend: Netlify

1. Create account at [Netlify](https://netlify.com)
2. Connect GitHub repository
3. Set publish directory to `/client/dist`
4. Set build command: `cd client && npm run build`
5. Set environment variable:
   - `VITE_API_URL=https://your-railway-backend-url`

## 🛠 Environment Variables

### Server (.env)

```env
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
CORS_ORIGIN=https://your-frontend-domain.com
```

### Client (.env)

```env
VITE_API_URL=https://your-backend-domain.com
```

## 📊 Database Setup (Supabase)

### 1. Create Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Create new project
3. Get your project URL and anon key

### 2. Create Tables

Run these SQL commands in Supabase SQL editor:

```sql
-- Sessions table
CREATE TABLE sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id TEXT NOT NULL,
  join_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Polls table
CREATE TABLE polls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id),
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  duration INTEGER DEFAULT 60,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Poll answers table
CREATE TABLE poll_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id),
  student_id TEXT NOT NULL,
  option TEXT NOT NULL,
  answered_at TIMESTAMP DEFAULT NOW()
);
```

## 🔧 Build Commands

### Development

```bash
npm run dev          # Start both client and server
npm run client:dev   # Start only client
npm run server:dev   # Start only server
```

### Production

```bash
npm run build        # Build client for production
npm run server:start # Start production server
```

## 🌍 CORS Configuration

For production, update CORS settings in `/server/src/index.ts`:

```typescript
const corsOptions = {
  origin: ["http://localhost:5173", "https://your-frontend-domain.com"],
  credentials: true,
};
```

## 🔍 Testing Deployment

### 1. Test Routes

- **Landing Page**: `https://your-domain.com/`
- **Student App**: `https://your-domain.com/student`
- **Teacher App**: `https://your-domain.com/teacher`

### 2. Test Features

1. Create teacher session
2. Join as student with join code
3. Create and start poll
4. Submit answers
5. View live results
6. Test chat functionality
7. Test kick student feature

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**: Update CORS origins in server configuration
2. **Socket.io Connection**: Ensure backend URL is correct in client env
3. **Build Errors**: Check all dependencies are installed
4. **Database Errors**: Verify Supabase credentials and table setup

### Debug Mode

Set `DEBUG=*` environment variable for detailed logging.

## 🎉 Success!

Your Live Polling System is now deployed and ready for use!

**Student Flow**: Landing → Role Selection → Join Session → Answer Polls → View Results
**Teacher Flow**: Landing → Role Selection → Create Session → Manage Polls → View Analytics

Enjoy your fully functional real-time polling system! 🚀
