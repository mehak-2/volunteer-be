import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'volunteer'
  },
  personalInfo: {
    fullname: String,
    age: Number,
    gender: String,
    photo: String
  },
  contactInfo: {
    phone: String,
    address: String,
    location: {
      lat: Number,
      lng: Number
    },
    contactPreference: String
  },
  skills: {
    certifications: {
      cprTrained: { type: Boolean, default: false },
      firstAidTrained: { type: Boolean, default: false }
    },
    skillsList: [String],
    availability: [String]
  },
  documents: {
    idDocument: String,
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
  profileCompletion: { type: Number, default: 0 },
  onboardingComplete: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true
});

userSchema.methods.calculateProfileCompletion = function() {
  let score = 0;
  const totalFields = 10;
  
  if (this.personalInfo?.fullname) score++;
  if (this.personalInfo?.age) score++;
  if (this.personalInfo?.gender) score++;
  if (this.contactInfo?.phone) score++;
  if (this.contactInfo?.address) score++;
  if (this.skills?.skillsList?.length > 0) score++;
  if (this.skills?.availability?.length > 0) score++;
  if (this.documents?.idDocument) score++;
  if (this.documents?.termsAccepted) score++;
  if (this.documents?.backgroundCheckConsent) score++;
  
  this.profileCompletion = Math.round((score / totalFields) * 100);
  
  
  if (score >= 8) { 
    this.onboardingComplete = true;
  }
  
  return this.profileCompletion;
};

export default mongoose.model('User', userSchema);