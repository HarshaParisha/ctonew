import { io, Socket } from 'socket.io-client';
import { GlobalStats, MoodTap, HistorySnapshot } from '../types';

class SocketService {
  private socket: Socket | null = null;

  connect(
    onStatsUpdate: (stats: GlobalStats) => void, 
    onConnected: (connected: boolean) => void,
    onHistoryUpdate?: (history: HistorySnapshot[]) => void
  ) {
    const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      onConnected(true);
      this.socket?.emit('request_stats');
      this.socket?.emit('request_history');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      onConnected(false);
    });

    this.socket.on('stats_update', (stats: GlobalStats) => {
      onStatsUpdate(stats);
    });

    if (onHistoryUpdate) {
      this.socket.on('history_update', (history: HistorySnapshot[]) => {
        onHistoryUpdate(history);
      });
    }

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
