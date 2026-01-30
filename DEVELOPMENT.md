# MoodPop Development Guide

## Development Setup

### Quick Start (Recommended)

Using Docker Compose:
```bash
docker-compose up
```

Access the app at http://localhost:3000

### Manual Setup

#### 1. Install Dependencies
```bash
# Install all dependencies
npm run install:all

# Or install individually
npm install           # Root dependencies
cd client && npm install
cd ../server && npm install
```

#### 2. Setup MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB
# macOS: brew install mongodb-community
# Ubuntu: sudo apt-get install mongodb

# Start MongoDB
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update server/.env

#### 3. Configure Environment
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI
```

#### 4. Start Development Servers
```bash
# From root directory
npm run dev
```

This starts:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Scripts

### Root Level
- `npm run dev` - Start both client and server in development mode
- `npm run build` - Build both client and server for production
- `npm start` - Start production server
- `npm run install:all` - Install all dependencies

### Client (Frontend)
```bash
cd client
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Server (Backend)
```bash
cd server
npm run dev      # Start with hot reload (tsx watch)
npm run build    # Compile TypeScript
npm start        # Run compiled JavaScript
```

## Architecture Overview

### Frontend Stack
- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Three.js**: 3D graphics
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Three.js helpers
- **Framer Motion**: Animation library
- **Zustand**: State management
- **Socket.io Client**: Real-time communication

### Backend Stack
- **Node.js**: Runtime
- **Express**: Web framework
- **Socket.io**: WebSocket server
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **TypeScript**: Type safety

## Code Structure

### Frontend Components

```
client/src/components/
├── Globe.tsx              # 3D globe visualization
├── MoodButtons.tsx        # Mood selection buttons
├── MoodButtons.css
├── WorldMoodIndex.tsx     # Global mood score display
├── WorldMoodIndex.css
├── UserStats.tsx          # User impact statistics
├── UserStats.css
├── MessageFeed.tsx        # Live message feed
└── MessageFeed.css
```

### Backend Services

```
server/src/
├── models/
│   └── MoodTap.ts        # Mongoose model
├── services/
│   └── moodEngine.ts     # Core mood calculation logic
├── database.ts           # MongoDB connection
├── types.ts              # TypeScript interfaces
└── index.ts              # Server entry point
```

## Key Features Implementation

### 1. Mood Tap Flow
```
User clicks mood button
  ↓
Get user location (IP-based)
  ↓
Optional message input
  ↓
Socket.io emit 'mood_tap'
  ↓
Server saves to MongoDB
  ↓
Server recalculates stats
  ↓
Server broadcasts 'stats_update'
  ↓
All clients update in real-time
```

### 2. World Mood Index Calculation
```typescript
// Each mood has a weight
const MOOD_WEIGHTS = {
  happy: 1,
  sad: -0.8,
  angry: -1,
  tired: -0.3,
  emotional: -0.5,
  chaotic: -0.6,
};

// Calculate average weight
avgWeight = sum(weights) / tapCount

// Normalize to 0-10 scale
worldMoodIndex = ((avgWeight + 1) / 2) * 10
```

### 3. Real-Time Updates
- Socket.io connection established on app load
- Server sends stats every 10 seconds
- Immediate broadcast on new mood tap
- Client-side state managed with Zustand
- Local storage for user stats persistence

## Database Schema

### MoodTap Collection
```typescript
{
  mood: String,          // 'happy' | 'sad' | 'angry' | 'tired' | 'emotional' | 'chaotic'
  timestamp: Number,     // Unix timestamp
  country: String,       // 'United States'
  city: String,          // 'New York'
  message?: String       // Optional, max 80 chars
}
```

### Indexes
- `timestamp: -1` - For time-based queries
- `country: 1` - For country aggregation
- `city: 1` - For city aggregation

## State Management

### Zustand Store
```typescript
interface AppState {
  globalStats: GlobalStats | null;
  userStats: UserStats;
  history: HistorySnapshot[];
  selectedCountry: string | null;
  selectedCity: string | null;
  showHistory: boolean;
  showMessages: boolean;
  connected: boolean;
}
```

### Local Storage
- User tap count
- Happiness contribution
- Persists across sessions

## API Integration

### Location Detection
Uses `ipapi.co` for IP-based geolocation:
```typescript
const response = await fetch('https://ipapi.co/json/');
const data = await response.json();
// Returns: country_name, city
```

## Performance Optimization

### Frontend
- Three.js renders at 60 FPS
- Component-level memoization
- Lazy loading for large data sets
- Optimized re-renders with Zustand

### Backend
- MongoDB indexes for fast queries
- Data aggregation in memory
- Socket.io rooms for scaling
- 24-hour data window for calculations

## Styling Guidelines

### Color Palette
```css
Background: #000000
Mood Colors:
  - Happy: #FFD700 (Gold)
  - Sad: #4169E1 (Royal Blue)
  - Angry: #FF4444 (Red)
  - Tired: #9370DB (Purple)
  - Emotional: #FF69B4 (Hot Pink)
  - Chaotic: #FF6347 (Tomato)

UI Elements:
  - Cards: rgba(20, 20, 20, 0.8)
  - Borders: rgba(255, 255, 255, 0.1-0.3)
  - Text: #FFFFFF
  - Text Secondary: rgba(255, 255, 255, 0.6)
```

### Animation Principles
- Smooth transitions (0.3s ease)
- Pulse animations for live elements
- Scale effects on hover (1.05-1.1)
- Framer Motion for complex animations

## Testing

### Manual Testing Checklist
- [ ] Mood buttons responsive
- [ ] Globe renders and rotates
- [ ] Socket connection established
- [ ] Real-time updates work
- [ ] Message submission works
- [ ] User stats persist
- [ ] Mobile responsive
- [ ] Cross-browser compatible

## Debugging

### Common Issues

**Socket not connecting:**
```bash
# Check server is running
curl http://localhost:5000/api/health

# Check MongoDB is running
mongosh
```

**Globe not rendering:**
- Check browser WebGL support
- Open browser console for errors
- Ensure Three.js dependencies loaded

**Real-time updates not working:**
- Check Socket.io connection status
- Verify MongoDB queries in server logs
- Check network tab for WebSocket

### Development Tools
- React DevTools
- Redux DevTools (for Zustand)
- MongoDB Compass
- Chrome DevTools

## Deployment

### Environment Variables (Production)
```bash
# Server
PORT=5000
MONGODB_URI=mongodb+srv://...
NODE_ENV=production

# Client (build time)
VITE_API_URL=https://api.moodpop.app
```

### Build Process
```bash
npm run build
cd server && npm start
```

### Docker Deployment
```bash
docker-compose up -d
```

## Contributing

### Code Style
- TypeScript strict mode
- ESLint for linting
- Prettier for formatting
- Component-first architecture

### Git Workflow
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

### Commit Messages
- Use conventional commits
- Examples:
  - `feat: add mood history view`
  - `fix: socket reconnection issue`
  - `docs: update setup guide`

## Resources

- [Three.js Docs](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Socket.io Docs](https://socket.io/docs/v4/)
- [MongoDB Docs](https://www.mongodb.com/docs/)
- [Framer Motion](https://www.framer.com/motion/)

## Support

For issues, questions, or contributions:
- Open a GitHub issue
- Check existing documentation
- Review code comments

---

Happy coding! Let's build something emotional. 💙🌍
