import { motion } from 'framer-motion';
import { useStore } from '../store';
import './UserStats.css';

export default function UserStats() {
  const { userStats } = useStore();

  return (
    <motion.div
      className="user-stats"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="stat-item">
        <div className="stat-value">{userStats.tapCount}</div>
        <div className="stat-label">Taps</div>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <div className="stat-value impact">
          {userStats.happinessContributed > 0 ? '+' : ''}
          {userStats.happinessContributed.toFixed(1)}
        </div>
        <div className="stat-label">Your Impact</div>
      </div>
    </motion.div>
  );
}
