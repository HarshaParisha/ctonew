import { motion } from 'framer-motion';
import { useStore } from '../store';
import './WorldMoodIndex.css';

export default function WorldMoodIndex() {
  const { globalStats, connected } = useStore();

  const worldMood = globalStats?.worldMoodIndex ?? 5.0;
  const percentage = (worldMood / 10) * 100;

  const getMoodColor = (index: number) => {
    if (index >= 7) return '#FFD700';
    if (index >= 5) return '#9370DB';
    if (index >= 3) return '#4169E1';
    return '#FF4444';
  };

  return (
    <div className="world-mood-index">
      <div className="connection-status">
        <div className={`status-dot ${connected ? 'connected' : 'disconnected'}`} />
        <span className="status-text">{connected ? 'LIVE' : 'OFFLINE'}</span>
      </div>
      
      <motion.div
        className="mood-card"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mood-title">World Mood Index</h2>
        <motion.div
          className="mood-value"
          style={{ color: getMoodColor(worldMood) }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {worldMood.toFixed(1)}
        </motion.div>
        <div className="mood-bar">
          <motion.div
            className="mood-bar-fill"
            style={{
              width: `${percentage}%`,
              background: `linear-gradient(90deg, ${getMoodColor(worldMood)}, ${getMoodColor(worldMood)}dd)`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        <div className="mood-scale">
          <span>0</span>
          <span>5</span>
          <span>10</span>
        </div>
      </motion.div>
    </div>
  );
}
