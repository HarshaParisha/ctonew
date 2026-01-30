import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { MOODS, MOOD_COLORS } from '../constants';
import './CountryDetails.css';

export default function CountryDetails() {
  const { globalStats, selectedCountry, setSelectedCountry, setSelectedCity } = useStore();

  if (!selectedCountry || !globalStats) return null;

  const countryData = globalStats.countryData.find(c => c.country === selectedCountry);
  const cityData = globalStats.cityData[selectedCountry] || [];

  if (!countryData) return null;

  const moodEntries = Object.entries(countryData.moods)
    .map(([mood, count]) => ({
      mood,
      count,
      percentage: countryData.total > 0 ? (count / countryData.total) * 100 : 0
    }))
    .filter(entry => entry.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <AnimatePresence>
      <motion.div
        className="country-details-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedCountry(null)}
      >
        <motion.div
          className="country-details"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="details-header">
            <h2>{selectedCountry}</h2>
            <button className="close-btn" onClick={() => setSelectedCountry(null)}>
              ✕
            </button>
          </div>

          <div className="details-content">
            <div className="stats-summary">
              <div className="summary-item">
                <div className="summary-label">Total Taps</div>
                <div className="summary-value">{countryData.total}</div>
              </div>
              <div className="summary-item">
                <div className="summary-label">Dominant Mood</div>
                <div className="summary-value">
                  {MOODS.find(m => m.type === countryData.dominantMood)?.emoji} {countryData.dominantMood}
                </div>
              </div>
            </div>

            <div className="mood-distribution">
              <h3>Mood Distribution</h3>
              {moodEntries.map(({ mood, count, percentage }) => {
                const moodData = MOODS.find(m => m.type === mood);
                return (
                  <div key={mood} className="mood-bar-item">
                    <div className="mood-bar-label">
                      <span className="mood-bar-emoji">{moodData?.emoji}</span>
                      <span className="mood-bar-name">{moodData?.label}</span>
                      <span className="mood-bar-count">{count}</span>
                    </div>
                    <div className="mood-bar-container">
                      <motion.div
                        className="mood-bar-fill"
                        style={{
                          backgroundColor: MOOD_COLORS[mood],
                          boxShadow: `0 0 10px ${MOOD_COLORS[mood]}`,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="mood-bar-percentage">{percentage.toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>

            {cityData.length > 0 && (
              <div className="city-list">
                <h3>Cities</h3>
                <div className="city-grid">
                  {cityData.map((city) => {
                    const cityMood = MOODS.find(m => m.type === city.dominantMood);
                    return (
                      <motion.div
                        key={city.city}
                        className="city-card"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCity(city.city || null)}
                      >
                        <div className="city-emoji">{cityMood?.emoji}</div>
                        <div className="city-name">{city.city}</div>
                        <div className="city-taps">{city.total} taps</div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
