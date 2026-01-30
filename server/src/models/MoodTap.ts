import mongoose from 'mongoose';

const moodTapSchema = new mongoose.Schema({
  mood: {
    type: String,
    required: true,
    enum: ['happy', 'sad', 'angry', 'tired', 'emotional', 'chaotic'],
  },
  timestamp: {
    type: Number,
    required: true,
    default: Date.now,
  },
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    maxlength: 80,
  },
});

moodTapSchema.index({ timestamp: -1 });
moodTapSchema.index({ country: 1 });
moodTapSchema.index({ city: 1 });

export default mongoose.model('MoodTap', moodTapSchema);
