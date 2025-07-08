import mongoose from 'mongoose';

const documentsStepSchema = new mongoose.Schema({
  documents: [{
    document: {
      type: String,
      required: true
    }
  }],
  termsAndConditions: {
    type: Boolean,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

export const DocumentsStep = mongoose.model("DocumentsStep", documentsStepSchema);