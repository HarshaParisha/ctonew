import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import './HistoryView.css';

export default function HistoryView() {
  const { showHistory, setShowHistory, history } = useStore();

  if (!showHistory) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="history-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowHistory(false)}
      >
        <motion.div
          className="history-panel"
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="history-header">
            <h2>📊 Mood History</h2>
            <button className="close-btn" onClick={() => setShowHistory(false)}>
              ✕
            </button>
          </div>
          
          <div className="history-content">
            {history.length === 0 ? (
              <div className="no-history">
                <p>No historical data yet.</p>
                <p className="history-hint">History snapshots are collected daily.</p>
              </div>
            ) : (
              <div className="history-timeline">
                {history.map((snapshot, index) => (
                  <motion.div
                    key={snapshot.date}
                    className="history-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="history-date">{snapshot.date}</div>
                    <div className="history-mood-index">
                      <div className="history-mood-label">World Mood Index</div>
                      <div className="history-mood-value">{snapshot.worldMoodIndex.toFixed(1)}</div>
                    </div>
                    {snapshot.countryData.length > 0 && (
                      <div className="history-countries">
                        <div className="history-countries-label">Top Countries</div>
                        <div className="history-countries-list">
                          {snapshot.countryData.slice(0, 5).map(country => (
                            <div key={country.country} className="history-country-item">
                              <span>{country.country}</span>
                              <span>{country.total} taps</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
