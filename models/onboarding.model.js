import mongoose from 'mongoose';

const personalInfoSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'non-binary', 'prefer-not-to-say', 'other'],
    required: true,
  },
  photo: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, {
  timestamps: true
});

const OnboardingInfo = mongoose.model('OnboardingInfo', personalInfoSchema);
export { OnboardingInfo };