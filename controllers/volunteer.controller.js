import User from '../models/user.model.js';
import { 
  createVolunteerFromOnboarding,
  getVolunteerDashboard,
  updateVolunteerProfile,
  toggleEmergencyAvailability,
  createAlert,
  updateAlertStatus
} from '../services/volunteer.service.js';

export const createVolunteer = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Check if user exists and onboarding is complete
    const user = await createVolunteerFromOnboarding(userId);
    
    res.status(200).json({
      success: true,
      data: user,
      message: 'Volunteer profile verified'
    });
  } catch (error) {
    console.error('Error verifying volunteer:', error);
    res.status(error.message.includes('not complete') ? 400 : 500).json({
      success: false,
      message: error.message || 'Failed to verify volunteer profile'
    });
  }
};

export const getVolunteerProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const dashboard = await getVolunteerDashboard(userId);
    
    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    
    const updatedVolunteer = await updateVolunteerProfile(userId, updateData);
    
    res.json({
      success: true,
      data: updatedVolunteer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const toggleEmergencyStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const volunteer = await toggleEmergencyAvailability(userId);
    
    res.json({
      success: true,
      data: volunteer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const createNewAlert = async (req, res) => {
  try {
    const alertData = req.body;
    const alert = await createAlert(alertData);
    
    res.status(201).json({
      success: true,
      data: alert
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const respondToAlert = async (req, res) => {
  try {
    const { alertId } = req.params;
    const { status, volunteerId } = req.body;
    
    const alert = await updateAlertStatus(alertId, status, volunteerId);
    
    res.json({
      success: true,
      data: alert
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}; 