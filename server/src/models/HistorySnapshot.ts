import mongoose from 'mongoose';

const historySnapshotSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true,
  },
  worldMoodIndex: {
    type: Number,
    required: true,
  },
  countryData: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
    default: Date.now,
  },
});

historySnapshotSchema.index({ date: -1 });
historySnapshotSchema.index({ timestamp: -1 });

export default mongoose.model('HistorySnapshot', historySnapshotSchema);
