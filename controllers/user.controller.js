import { registerUserService } from '../services/user.service.js';
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const newUser = await registerUserService({ name, email, password });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: newUser,
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

export const findUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const foundUser = await User.findOne({ email });
    
    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      user: {
        id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        onboardingComplete: foundUser.onboardingComplete,
        profileCompletion: foundUser.profileCompletion
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const demoLogin = async (req, res) => {
  try {
    let demoUser = await User.findOne({ email: 'demo@volunteerhub.com' });
    
    if (!demoUser) {
      demoUser = new User({
        name: 'Demo Volunteer',
        email: 'demo@volunteerhub.com',
        password: await bcrypt.hash('demo123', 10),
        role: 'volunteer',
        personalInfo: {
          fullname: 'Demo Volunteer',
          age: 30,
          gender: 'prefer-not-to-say',
        },
        contactInfo: {
          phone: '+1 (555) 123-4567',
          address: '123 Main St, City, State 12345',
          contactPreference: 'email',
        },
        skills: {
          certifications: {
            cprTrained: true,
            firstAidTrained: true,
          },
          skillsList: ['First Aid', 'CPR', 'Emergency Response'],
          availability: ['Morning', 'Afternoon'],
        },
        documents: {
          termsAccepted: true,
          backgroundCheckConsent: true,
        },
        status: 'approved',
      });
      
      demoUser.calculateProfileCompletion();
      await demoUser.save();
    }
    
    res.status(200).json({
      success: true,
      user: {
        id: demoUser._id,
        email: demoUser.email,
        role: demoUser.role,
        name: demoUser.name,
        accessToken: 'demo-token',
        onboardingComplete: demoUser.onboardingComplete,
        profileCompletion: demoUser.profileCompletion
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const { email } = req.params;
    const foundUser = await User.findOne({ email });
    
    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      user: {
        id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        onboardingComplete: foundUser.onboardingComplete,
        profileCompletion: foundUser.profileCompletion,
        personalInfo: foundUser.personalInfo,
        contactInfo: foundUser.contactInfo,
        skills: foundUser.skills,
        documents: foundUser.documents,
        status: foundUser.status,
        emergency: foundUser.emergency
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}
