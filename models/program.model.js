import mongoose from 'mongoose';

const programSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  location: {
    address: {
      type: String,
      required: true,
    },
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  volunteerRequirements: {
    minAge: Number,
    maxAge: Number,
    requiredSkills: [String],
    requiredCertifications: [String],
    experienceLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'any'],
      default: 'any',
    },
  },
  maxVolunteers: {
    type: Number,
    required: true,
  },
  currentVolunteers: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'in-progress', 'completed', 'cancelled'],
    default: 'draft',
  },
  category: {
    type: String,
    required: true,
    enum: ['healthcare', 'education', 'environment', 'community', 'disaster-relief', 'elderly-care', 'children', 'other'],
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  appliedVolunteers: [{
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Volunteer',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['applied', 'accepted', 'rejected'],
      default: 'applied',
    },
  }],
  selectedVolunteers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer',
  }],
  images: [String],
  contactInfo: {
    email: String,
    phone: String,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Program', programSchema); 