import { create } from 'zustand';
import { GlobalStats, UserStats, HistorySnapshot, MoodType } from './types';

interface AppState {
  globalStats: GlobalStats | null;
  userStats: UserStats;
  history: HistorySnapshot[];
  selectedCountry: string | null;
  selectedCity: string | null;
  showHistory: boolean;
  showMessages: boolean;
  connected: boolean;
  setGlobalStats: (stats: GlobalStats) => void;
  setUserStats: (stats: UserStats) => void;
  addHistory: (snapshot: HistorySnapshot) => void;
  setSelectedCountry: (country: string | null) => void;
  setSelectedCity: (city: string | null) => void;
  setShowHistory: (show: boolean) => void;
  setShowMessages: (show: boolean) => void;
  setConnected: (connected: boolean) => void;
  incrementUserTaps: (mood: MoodType) => void;
}

const loadUserStats = (): UserStats => {
  const stored = localStorage.getItem('moodpop_user_stats');
  return stored ? JSON.parse(stored) : { tapCount: 0, happinessContributed: 0 };
};

const saveUserStats = (stats: UserStats) => {
  localStorage.setItem('moodpop_user_stats', JSON.stringify(stats));
};

export const useStore = create<AppState>((set) => ({
  globalStats: null,
  userStats: loadUserStats(),
  history: [],
  selectedCountry: null,
  selectedCity: null,
  showHistory: false,
  showMessages: false,
  connected: false,
  setGlobalStats: (stats) => set({ globalStats: stats }),
  setUserStats: (stats) => {
    saveUserStats(stats);
    set({ userStats: stats });
  },
  addHistory: (snapshot) =>
    set((state) => ({
      history: [...state.history, snapshot].slice(-30),
    })),
  setSelectedCountry: (country) => set({ selectedCountry: country, selectedCity: null }),
  setSelectedCity: (city) => set({ selectedCity: city }),
  setShowHistory: (show) => set({ showHistory: show }),
  setShowMessages: (show) => set({ showMessages: show }),
  setConnected: (connected) => set({ connected }),
  incrementUserTaps: (mood) =>
    set((state) => {
      const moodWeights: { [key: string]: number } = {
        happy: 1,
        sad: -0.8,
        angry: -1,
        tired: -0.3,
        emotional: -0.5,
        chaotic: -0.6,
      };
      const newStats = {
        tapCount: state.userStats.tapCount + 1,
        happinessContributed: state.userStats.happinessContributed + moodWeights[mood],
      };
      saveUserStats(newStats);
      return { userStats: newStats };
    }),
}));
