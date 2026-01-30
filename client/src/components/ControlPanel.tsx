import { motion } from 'framer-motion';
import { useStore } from '../store';
import './ControlPanel.css';

export default function ControlPanel() {
  const { setShowHistory, globalStats, setSelectedCountry } = useStore();

  const topCountries = globalStats?.countryData
    .sort((a, b) => b.total - a.total)
    .slice(0, 10) || [];

  return (
    <div className="control-panel">
      <motion.button
        className="control-btn history-btn"
        onClick={() => setShowHistory(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        📊 History
      </motion.button>

      {topCountries.length > 0 && (
        <div className="country-list-panel">
          <div className="country-list-title">🌍 Top Countries</div>
          <div className="country-list">
            {topCountries.map((country) => (
              <motion.div
                key={country.country}
                className="country-item"
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCountry(country.country)}
              >
                <span className="country-name">{country.country}</span>
                <span className="country-taps">{country.total}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
