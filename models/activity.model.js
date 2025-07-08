import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['volunteer_approved', 'volunteer_rejected', 'emergency_alert', 'emergency_response', 'volunteer_registered']
  },
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer'
  },
  description: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Activity', activitySchema); 