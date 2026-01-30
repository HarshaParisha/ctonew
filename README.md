# MoodPop 🌍✨

**A real-time global emotion map where users tap their current mood and see how the world feels live on a 3D globe.**

MoodPop is an emotionally addictive, visually stunning app that shows the real-time emotional state of humanity. This is not a social network. This is a living planet of human feelings.

## Features

### 🎭 Six Core Moods
- 😄 Happy
- 😭 Sad
- 😡 Angry
- 😴 Tired
- 🥲 Emotional
- 😈 Chaotic

### 🌐 Global Mood Engine
- Real-time mood aggregation by country and city
- Dominant mood calculation per region
- Percentage-based mood distribution

### 🌍 Live 3D Globe
- Rotating Earth visualization using Three.js
- Countries colored by dominant mood
- Glow intensity reflects activity level
- Pulse animations on new taps

### 📊 World Mood Index
- Single global score from 0-10
- Calculated using positive vs negative moods
- Real-time updates based on global activity

### 💬 Mood Messages
- Optional short messages (max 80 characters)
- Anonymous global live feed: "What the World is Saying"
- Real-time message updates

### 👤 User Impact Tracking
- Device-based tap counter
- Happiness contribution metric
- No login required

### 🎨 Futuristic UI/UX
- Dark mode only with black background
- Neon glowing globe with soft animations
- Cinematic, calm, and emotionally engaging
- Mobile-first responsive design

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Three.js** + React Three Fiber for 3D globe
- **Framer Motion** for smooth animations
- **Zustand** for state management
- **Socket.io Client** for real-time updates

### Backend
- **Node.js** with Express
- **Socket.io** for WebSocket connections
- **MongoDB** with Mongoose for data persistence
- **TypeScript** for type safety

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or remote instance)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd moodpop
```

2. Install dependencies:
```bash
npm run install:all
```

3. Configure environment variables:
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI
```

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Start the development servers:
```bash
# From the root directory
npm run dev
```

This will start:
- Client on http://localhost:3000
- Server on http://localhost:5000

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
moodpop/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API and Socket services
│   │   ├── types.ts        # TypeScript types
│   │   ├── constants.ts    # App constants
│   │   ├── store.ts        # Zustand state management
│   │   └── App.tsx         # Main app component
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── models/         # Mongoose models
│   │   ├── services/       # Business logic
│   │   ├── database.ts     # MongoDB connection
│   │   ├── types.ts        # TypeScript types
│   │   └── index.ts        # Server entry point
│   └── package.json
└── package.json            # Root package.json
```

## Architecture

### Real-Time Data Flow
1. User taps a mood on the frontend
2. Location is automatically detected via IP geolocation
3. Socket.io sends mood tap to server
4. Server saves to MongoDB
5. Server recalculates global statistics
6. Server broadcasts updated stats to all connected clients
7. Globe and UI update in real-time

### Mood Engine Algorithm
- Each mood has a weight (-1 to 1)
- World Mood Index calculated from average mood weight
- Normalized to 0-10 scale
- Updated every 10 seconds and on each new tap

### Data Aggregation
- Taps grouped by country and city
- Dominant mood calculated per region
- Last 24 hours of data used for calculations
- Recent messages (last 50) displayed in feed

## API Endpoints

### REST API
- `GET /api/health` - Health check

### Socket.io Events
- **Client → Server**
  - `request_stats` - Request current global statistics
  - `mood_tap` - Submit a new mood tap
  
- **Server → Client**
  - `stats_update` - Receive updated global statistics

## Environment Variables

### Server (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/moodpop
NODE_ENV=development
```

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Considerations
- Globe renders at 60 FPS using WebGL
- Socket.io uses WebSocket for low latency
- MongoDB indexes on timestamp, country, and city
- Data aggregation optimized for real-time performance

## Future Enhancements
- Historical mood trends visualization
- Country/city drill-down functionality
- Mood heatmap overlays
- Custom mood themes
- Social sharing capabilities
- Push notifications for global mood changes

## License
MIT

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

---

**Experience the pulse of humanity in real-time. Feel the world with MoodPop.** 🌍💙
