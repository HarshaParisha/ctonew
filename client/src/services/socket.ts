import { io, Socket } from 'socket.io-client';
import { GlobalStats, MoodTap } from '../types';

class SocketService {
  private socket: Socket | null = null;

  connect(onStatsUpdate: (stats: GlobalStats) => void, onConnected: (connected: boolean) => void) {
    this.socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      onConnected(true);
      this.socket?.emit('request_stats');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      onConnected(false);
    });

    this.socket.on('stats_update', (stats: GlobalStats) => {
      onStatsUpdate(stats);
    });

    return this.socket;
  }

  submitMood(moodTap: MoodTap) {
    if (this.socket?.connected) {
      this.socket.emit('mood_tap', moodTap);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
