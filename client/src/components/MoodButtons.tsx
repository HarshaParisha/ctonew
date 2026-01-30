import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOODS } from '../constants';
import { MoodType } from '../types';
import { getApproximateLocation } from '../services/location';
import { socketService } from '../services/socket';
import { useStore } from '../store';
import './MoodButtons.css';

export default function MoodButtons() {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [message, setMessage] = useState('');
  const [showMessageInput, setShowMessageInput] = useState(false);
  const { incrementUserTaps } = useStore();

  const handleMoodTap = async (mood: MoodType) => {
    setSelectedMood(mood);
    setShowMessageInput(true);
  };

  const handleSubmit = async () => {
    if (!selectedMood) return;

    const location = await getApproximateLocation();
    
    socketService.submitMood({
      mood: selectedMood,
      timestamp: Date.now(),
      country: location.country,
      city: location.city,
      message: message.trim() || undefined,
    });

    incrementUserTaps(selectedMood);

    setSelectedMood(null);
    setMessage('');
    setShowMessageInput(false);
  };

  const handleSkip = () => {
    handleSubmit();
  };

  return (
    <>
      <div className="mood-buttons">
        {MOODS.map((mood) => (
          <motion.button
            key={mood.type}
            className="mood-button"
            style={{
              '--mood-color': mood.color,
            } as React.CSSProperties}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMoodTap(mood.type)}
          >
            <span className="mood-emoji">{mood.emoji}</span>
            <span className="mood-label">{mood.label}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {showMessageInput && (
          <motion.div
            className="message-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="message-dialog"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              <h3>Want to share how you feel?</h3>
              <p className="message-hint">Optional - Max 80 characters</p>
              <input
                type="text"
                className="message-input"
                placeholder="What's on your mind..."
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 80))}
                maxLength={80}
                autoFocus
              />
              <div className="message-actions">
                <button className="btn-skip" onClick={handleSkip}>
                  Skip
                </button>
                <button className="btn-send" onClick={handleSubmit}>
                  Send
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
