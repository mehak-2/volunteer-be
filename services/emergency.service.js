import User from '../models/user.model.js';
import { Alert } from '../models/alert.model.js';

export const getActiveVolunteersWithLocation = async () => {
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
      'emergency.responseTime': 1,
      'skills.certifications': 1
    });

    return volunteers;
  } catch (error) {
    throw new Error('Failed to fetch active volunteers: ' + error.message);
  }
};

export const getActiveAlerts = async () => {
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

    return alerts;
  } catch (error) {
    throw new Error('Failed to fetch emergency alerts: ' + error.message);
  }
}; 