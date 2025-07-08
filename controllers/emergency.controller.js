import User from '../models/user.model.js';
import { Alert } from '../models/alert.model.js';

export const getActiveVolunteers = async (req, res) => {
  try {
    const volunteers = await User.find({
      role: 'volunteer',
      'emergency.isAvailable': true,
      'contactInfo.location': { $exists: true },
      status: 'approved'
    }).select({
      'name': 1,
      'personalInfo.fullname': 1,
      'contactInfo.location': 1,
      'emergency.lastActive': 1,
      'emergency.responseTime': 1,
      'skills.certifications': 1
    });

    res.status(200).json({
      success: true,
      data: volunteers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active volunteers',
      error: error.message
    });
  }
};

export const getEmergencyAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({
      status: { $in: ['pending', 'responded'] }
    }).select({
      type: 1,
      location: 1,
      priority: 1,
      status: 1,
      createdAt: 1
    });

    res.status(200).json({
      success: true,
      data: alerts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch emergency alerts',
      error: error.message
    });
  }
}; 