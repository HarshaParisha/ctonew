import { Mood } from './types';

export const MOODS: Mood[] = [
  { type: 'happy', emoji: '😄', color: '#FFD700', label: 'Happy' },
  { type: 'sad', emoji: '😭', color: '#4169E1', label: 'Sad' },
  { type: 'angry', emoji: '😡', color: '#FF4444', label: 'Angry' },
  { type: 'tired', emoji: '😴', color: '#9370DB', label: 'Tired' },
  { type: 'emotional', emoji: '🥲', color: '#FF69B4', label: 'Emotional' },
  { type: 'chaotic', emoji: '😈', color: '#FF6347', label: 'Chaotic' },
];

export const MOOD_COLORS: { [key: string]: string } = {
  happy: '#FFD700',
  sad: '#4169E1',
  angry: '#FF4444',
  tired: '#9370DB',
  emotional: '#FF69B4',
  chaotic: '#FF6347',
};

export const MOOD_WEIGHTS: { [key: string]: number } = {
  happy: 1,
  sad: -0.8,
  angry: -1,
  tired: -0.3,
  emotional: -0.5,
  chaotic: -0.6,
};
