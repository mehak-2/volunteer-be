import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const personalInfoService = async ({ fullname, age, gender }) => {
  
  return {
    fullname,
    age,
    gender,
  };
};

export const submitCompleteApplication = async (applicationData) => {
  try {
    const { personalInfo, contactInfo, skillsInfo, documentsInfo } = applicationData;

    
    let user = await User.findOne({ email: contactInfo.email });
    let token;

    if (user) {
      user.name = personalInfo.fullname;
      user.personalInfo = {
        fullname: personalInfo.fullname,
        age: personalInfo.age,
        gender: personalInfo.gender,
        photo: personalInfo.photo
      };
      user.contactInfo = {
        phone: contactInfo.phone,
        address: contactInfo.address,
        location: contactInfo.location,
        contactPreference: contactInfo.contactPreference || 'email'
      };
      user.skills = {
        certifications: {
          cprTrained: skillsInfo.cprTrained || false,
          firstAidTrained: skillsInfo.firstAidTrained || false
        },
        skillsList: skillsInfo.skills || [],
        availability: skillsInfo.availability || []
      };
      user.documents = {
        idDocument: documentsInfo.documents?.[0]?.document,
        termsAccepted: documentsInfo.termsAndConditions || false,
        backgroundCheckConsent: documentsInfo.backgroundCheckConsent || false
      };
      user.status = 'pending';
      
      user.calculateProfileCompletion();
      await user.save();
    } else {
      const hashedPassword = await bcrypt.hash("temporary-password", 10);
      user = await User.create({
        name: personalInfo.fullname,
        email: contactInfo.email,
        password: hashedPassword,
        personalInfo: {
          fullname: personalInfo.fullname,
          age: personalInfo.age,
          gender: personalInfo.gender,
          photo: personalInfo.photo
        },
        contactInfo: {
          phone: contactInfo.phone,
          address: contactInfo.address,
          location: contactInfo.location,
          contactPreference: contactInfo.contactPreference || 'email'
        },
        skills: {
          certifications: {
            cprTrained: skillsInfo.cprTrained || false,
            firstAidTrained: skillsInfo.firstAidTrained || false
          },
          skillsList: skillsInfo.skills || [],
          availability: skillsInfo.availability || []
        },
        documents: {
          idDocument: documentsInfo.documents?.[0]?.document,
          termsAccepted: documentsInfo.termsAndConditions || false,
          backgroundCheckConsent: documentsInfo.backgroundCheckConsent || false
        },
        status: 'pending'
      });
      
      user.calculateProfileCompletion();
      await user.save();
    }

    token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('User onboarding completed successfully:', {
      userId: user._id,
      onboardingComplete: user.onboardingComplete,
      profileCompletion: user.profileCompletion
    });

    return {
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: 'volunteer',
          onboardingComplete: user.onboardingComplete,
          profileCompletion: user.profileCompletion
        },
        token
      }
    };
  } catch (error) {
    console.error('Error in submitCompleteApplication:', error);
    throw error;
  }
};