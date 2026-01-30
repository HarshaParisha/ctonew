export type MoodType = 'happy' | 'sad' | 'angry' | 'tired' | 'emotional' | 'chaotic';

export interface MoodTap {
  mood: MoodType;
  timestamp: number;
  country: string;
  city: string;
  message?: string;
}

export interface MoodData {
  country: string;
  city?: string;
  moods: {
    [key in MoodType]: number;
  };
  total: number;
  dominantMood: MoodType;
  percentage: number;
}

export interface GlobalStats {
  worldMoodIndex: number;
  totalTaps: number;
  recentMessages: MoodMessage[];
  countryData: MoodData[];
  cityData: { [country: string]: MoodData[] };
}

export interface MoodMessage {
  mood: MoodType;
  message: string;
  country: string;
  city: string;
  timestamp: number;
}

export interface HistorySnapshot {
  date: string;
  worldMoodIndex: number;
  countryData: MoodData[];
}
