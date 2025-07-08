import User from '../models/user.model.js';
import { Alert } from '../models/alert.model.js';

export const createVolunteerFromOnboarding = async (userId) => {
  try {
    console.log('Checking volunteer profile for userId:', userId);
    
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    console.log('User found:', {
      userId: user._id,
      onboardingComplete: user.onboardingComplete,
      profileCompletion: user.profileCompletion
    });

    if (!user.onboardingComplete) {
      throw new Error('User onboarding not complete');
    }

    console.log('Volunteer profile already exists in user model');
    return user;
  } catch (error) {
    console.error('Error in createVolunteerFromOnboarding:', error);
    throw new Error(`Error checking volunteer profile: ${error.message}`);
  }
};

export const getVolunteerDashboard = async (userId) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }



    if (!user.onboardingComplete) {
      return {
        volunteer: null,
        isOnboardingComplete: false,
        recentAlerts: [],
        stats: {
          totalResponses: 0,
          responseTime: '< 15 min',
          profileCompletion: user.profileCompletion || 0
        }
      };
    }

    const recentAlerts = await Alert.find({ volunteer: user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    return {
      volunteer: user,
      isOnboardingComplete: true,
      recentAlerts,
      stats: {
        totalResponses: user.emergency?.totalResponses || 0,
        responseTime: user.emergency?.responseTime || '< 15 min',
        profileCompletion: user.profileCompletion || 0
      }
    };
  } catch (error) {
    throw new Error(`Error fetching dashboard: ${error.message}`);
  }
};

export const updateVolunteerProfile = async (userId, updateData) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    Object.assign(user, updateData);
    user.calculateProfileCompletion();
    if (!user.emergency) {
      user.emergency = {};
    }
    user.emergency.lastActive = new Date();
    
    await user.save();
    return user;
  } catch (error) {
    throw new Error(`Error updating profile: ${error.message}`);
  }
};

export const toggleEmergencyAvailability = async (userId) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.emergency) {
      user.emergency = { isAvailable: false };
    }
    user.emergency.isAvailable = !user.emergency.isAvailable;
    user.emergency.lastActive = new Date();
    
    await user.save();
    return user;
  } catch (error) {
    throw new Error(`Error toggling emergency availability: ${error.message}`);
  }
};

export const createAlert = async (alertData) => {
  try {
    const alert = new Alert(alertData);
    await alert.save();
    return alert;
  } catch (error) {
    throw new Error(`Error creating alert: ${error.message}`);
  }
};

export const updateAlertStatus = async (alertId, status, volunteerId) => {
  try {
    const alert = await Alert.findById(alertId);
    
    if (!alert) {
      throw new Error('Alert not found');
    }

    alert.status = status;
    if (status === 'responded') {
      alert.responseTime = Date.now() - alert.createdAt;
      
      const user = await User.findById(volunteerId);
      if (user) {
        if (!user.emergency) {
          user.emergency = { totalResponses: 0 };
        }
        user.emergency.totalResponses += 1;
        await user.save();
      }
    }

    await alert.save();
    return alert;
  } catch (error) {
    throw new Error(`Error updating alert: ${error.message}`);
  }
}; 