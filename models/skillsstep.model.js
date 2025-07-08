import mongoose from 'mongoose';

const skillsStepSchema = new mongoose.Schema({
  certificate: {
    cprTrained: {
      type: Boolean,
      required: true,
    },
    firstAidTrained: {
      type: Boolean,
      required: true,
    },
  },
  skills: {
    type: [String],
    required: true,
  },
  schedule: {
    type: [String],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
}, {
  timestamps: true
});

export const SkillsStep = mongoose.model('SkillsStep', skillsStepSchema);