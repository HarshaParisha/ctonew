import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { MOODS } from '../constants';
import './MessageFeed.css';

export default function MessageFeed() {
  const { globalStats, showMessages, setShowMessages } = useStore();

  const messages = globalStats?.recentMessages || [];

  return (
    <>
      <motion.button
        className="feed-toggle"
        onClick={() => setShowMessages(!showMessages)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        💬 Messages
      </motion.button>

      <AnimatePresence>
        {showMessages && (
          <motion.div
            className="message-feed-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMessages(false)}
          >
            <motion.div
              className="message-feed"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="feed-header">
                <h2>What the World is Saying</h2>
                <button className="close-btn" onClick={() => setShowMessages(false)}>
                  ✕
                </button>
              </div>
              <div className="feed-content">
                {messages.length === 0 ? (
                  <div className="no-messages">No messages yet. Be the first to share!</div>
                ) : (
                  messages.map((msg, index) => {
                    const mood = MOODS.find((m) => m.type === msg.mood);
                    return (
                      <motion.div
                        key={`${msg.timestamp}-${index}`}
                        className="message-item"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="message-emoji">{mood?.emoji}</div>
                        <div className="message-content">
                          <div className="message-text">{msg.message}</div>
                          <div className="message-meta">
                            {msg.city}, {msg.country}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
