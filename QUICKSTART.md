# MoodPop Quick Start Guide 🚀

Get MoodPop running in 5 minutes!

## Option 1: Docker (Easiest) 🐳

**Requirements:** Docker & Docker Compose

```bash
# 1. Clone the repository
git clone <repository-url>
cd moodpop

# 2. Start everything
docker-compose up

# 3. Open your browser
# Visit: http://localhost:3000
```

That's it! MongoDB, backend, and frontend are all running.

## Option 2: Local Development 💻

**Requirements:** Node.js 18+, MongoDB

### Step 1: Install Dependencies
```bash
npm run install:all
```

### Step 2: Start MongoDB
```bash
# macOS
brew services start mongodb-community

# Ubuntu
sudo systemctl start mongod

# Or use MongoDB Atlas (free cloud database)
# https://www.mongodb.com/cloud/atlas
```

### Step 3: Configure Environment
```bash
cd server
cp .env.example .env
# Edit .env if needed (default works for local MongoDB)
```

### Step 4: Start Development Servers
```bash
# From root directory
npm run dev
```

This starts:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## First Time Usage

1. **Open the app** at http://localhost:3000
2. **Tap a mood** from the bottom buttons
3. **Watch the globe** update in real-time
4. **See your impact** in the bottom-left corner
5. **Check messages** by clicking the "💬 Messages" button

## Troubleshooting

### "MongoDB connection failed"
- Make sure MongoDB is running: `mongod --version`
- Check your connection string in `server/.env`
- Or use MongoDB Atlas (cloud database)

### "Socket not connecting"
- Make sure backend is running on port 5000
- Check browser console for errors
- Verify firewall settings

### "Globe not rendering"
- Check if your browser supports WebGL
- Try a different browser (Chrome recommended)
- Check browser console for errors

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill

# Kill process on port 5000
lsof -ti:5000 | xargs kill
```

## What's Running?

- **Frontend (Port 3000):** React app with 3D globe
- **Backend (Port 5000):** Express + Socket.io server
- **Database (Port 27017):** MongoDB instance

## Next Steps

- Read [DEVELOPMENT.md](DEVELOPMENT.md) for detailed development guide
- Read [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Check [README.md](README.md) for features and architecture

## Quick Commands

```bash
# Install dependencies
npm run install:all

# Start development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Docker
docker-compose up          # Start
docker-compose down        # Stop
docker-compose logs -f     # View logs
```

## Support

Having issues? Check:
1. Are all dependencies installed?
2. Is MongoDB running?
3. Are ports 3000 and 5000 available?
4. Check console for error messages

For more help, open an issue on GitHub.

---

**Enjoy building with MoodPop! 🌍💙**
