import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Medical Emergency', 'First Aid Required', 'Health Support', 'Crisis Support']
  },
  location: {
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'responded', 'completed', 'cancelled'],
    default: 'pending'
  },
  responseTime: { type: Number },
  notes: { type: String },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

export const Alert = mongoose.model('Alert', alertSchema); 