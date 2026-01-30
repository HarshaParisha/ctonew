import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './database.js';
import { MoodEngine } from './services/moodEngine.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/moodpop';

const moodEngine = new MoodEngine();

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('request_stats', async () => {
    try {
      const stats = await moodEngine.calculateGlobalStats();
      socket.emit('stats_update', stats);
    } catch (error) {
      console.error('Error getting stats:', error);
    }
  });

  socket.on('mood_tap', async (data) => {
    try {
      await moodEngine.saveMoodTap(data);
      const stats = await moodEngine.calculateGlobalStats();
      io.emit('stats_update', stats);
    } catch (error) {
      console.error('Error saving mood tap:', error);
    }
  });

  socket.on('request_history', async () => {
    try {
      const history = await moodEngine.getHistory();
      socket.emit('history_update', history);
    } catch (error) {
      console.error('Error getting history:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

setInterval(async () => {
  try {
    const stats = await moodEngine.calculateGlobalStats();
    io.emit('stats_update', stats);
  } catch (error) {
    console.error('Error in stats update interval:', error);
  }
}, 10000);

setInterval(async () => {
  try {
    await moodEngine.createDailySnapshot();
    console.log('Daily snapshot created');
  } catch (error) {
    console.error('Error creating daily snapshot:', error);
  }
}, 24 * 60 * 60 * 1000);

async function start() {
  try {
    await connectDatabase(MONGODB_URI);
    
    await moodEngine.createDailySnapshot();
    
    httpServer.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Socket.IO ready for connections`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
