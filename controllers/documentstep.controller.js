import { documentStepService } from '../services/documentstep.service.js';
import  User  from '../models/user.model.js';

export const documentStepUser = async (req, res) => {
  const { documents, termsAndConditions, user: userEmail } = req.body;

  try {
    // Find or create user by email
    let user = await User.findOne({ email: userEmail });
    
    if (!user) {
      user = await User.create({ email: userEmail });
    }

    const savedDoc = await documentStepService({ 
      documents, 
      termsAndConditions, 
      user: user._id // Pass the user's MongoDB ID
    });
    user.onboardingComplete = true;
    await user.save();


    res.status(201).json({
      message: 'Document step saved successfully',
      id: savedDoc._id,
      token: 'your-auth-token-here' // Generate proper JWT token here
    });
  } catch (error) {
    console.error('Error saving document step:', error);
    res.status(400).json({ message: error.message });
  }
};
