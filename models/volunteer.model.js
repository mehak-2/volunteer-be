import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  personalInfo: {
    fullname: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    photo: { type: String }
  },
  contactInfo: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    location: {
      lat: { type: Number },
      lng: { type: Number }
    },
    contactPreference: { type: String, required: true }
  },
  skills: {
    certifications: {
      cprTrained: { type: Boolean, default: false },
      firstAidTrained: { type: Boolean, default: false }
    },
    skillsList: [{ type: String }],
    availability: [{ type: String }]
  },
  documents: {
    idDocument: { type: String },
    termsAccepted: { type: Boolean, default: false },
    backgroundCheckConsent: { type: Boolean, default: false }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  emergency: {
    isAvailable: { type: Boolean, default: false },
    responseTime: { type: String, default: '< 15 min' },
    totalResponses: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now }
  },
  training: {
    nextTraining: { type: String },
    completedTrainings: [{ type: String }]
  },
  profileCompletion: { type: Number, default: 0 }
}, {
  timestamps: true
});

volunteerSchema.methods.calculateProfileCompletion = function() {
  let score = 0;
  const totalFields = 10;
  
  if (this.personalInfo.fullname) score++;
  if (this.personalInfo.age) score++;
  if (this.personalInfo.gender) score++;
  if (this.contactInfo.phone) score++;
  if (this.contactInfo.email) score++;
  if (this.contactInfo.address) score++;
  if (this.skills.skillsList.length > 0) score++;
  if (this.skills.availability.length > 0) score++;
  if (this.documents.idDocument) score++;
  if (this.documents.termsAccepted) score++;
  
  this.profileCompletion = Math.round((score / totalFields) * 100);
  return this.profileCompletion;
};

export const Volunteer = mongoose.model('Volunteer', volunteerSchema);