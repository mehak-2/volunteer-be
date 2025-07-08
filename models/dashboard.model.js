import mongoose from 'mongoose';

const dashboardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  location: { type: String, required: true },
  contactPreference: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  skills: { type: [String], required: true },
  availability: { type: [String], required: true },
  cprTrained: { type: Boolean, required: true },
  firstAidTrained: { type: Boolean, required: true },
  documents: { type: [String], required: true },
  termsAndConditions: { type: Boolean, required: true },
  profileCompletion: { type: Number, required: true },
  responseTime: { type: String, required: true },
  totalResponses: { type: Number, required: true },
  location: { type: String, required: true },
  skills: { type: [String], required: true },
  availability: { type: [String], required: true },
  cprTrained: { type: Boolean, required: true },
  firstAidTrained: { type: Boolean, required: true },
 
  //emergency
  emergencyAvailable: { type: Boolean, required: true },
  status: { type: String, required: true },
  lastActive: { type: String, required: true },
  nextTraining: { type: String, required: true },
  totalResponses: { type: Number, required: true },
  responseTime: { type: String, required: true },
  profileCompletion: { type: Number, required: true },

}, { _id: false, timestamps: true });



export const Dashboard = mongoose.model("Dashboard", dashboardSchema);
