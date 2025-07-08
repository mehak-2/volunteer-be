import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
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
  description: {
    type: String,
    required: true,
  },
  website: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  logo: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending',
  },
  registrationNumber: {
    type: String,
  },
  documents: {
    registrationCertificate: String,
    taxExemptCertificate: String,
  },
  contact: {
    primaryContactName: String,
    primaryContactEmail: String,
    primaryContactPhone: String,
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
  },
  role: {
    type: String,
    default: 'organization',
  },
}, {
  timestamps: true,
});

export default mongoose.model('Organization', organizationSchema); 