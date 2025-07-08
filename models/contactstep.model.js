import mongoose from 'mongoose';

const contactStepSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    default: ''
  }, 
  location: {
    lat: Number,
    lng: Number
  },
  contactPreference: {
    type: String,
    enum: ['email', 'sms', 'phonecall', 'notification'],
    default: 'email'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false  // Make it optional for now
  }
}, {
  timestamps: true
});

export const ContactStep = mongoose.model('ContactStep', contactStepSchema);