import User from '../models/user.model.js';
import { Alert } from '../models/alert.model.js';
import { 
  getVolunteerDashboard,
  updateVolunteerProfile,
  toggleEmergencyAvailability 
} from '../services/volunteer.service.js';

export const getVolunteerProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const dashboardData = await getVolunteerDashboard(userId);
    
    res.json({
      success: true,
      data: dashboardData
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
    
    const user = await updateVolunteerProfile(userId, updateData);
    
    res.json({
      success: true,
      data: user
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
    
    const user = await toggleEmergencyAvailability(userId);
    
    res.json({
      success: true,
      data: user
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
    
    const alert = await Alert.create(alertData);
    
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
    
    const alert = await Alert.findByIdAndUpdate(
      alertId,
      { status, respondedBy: volunteerId },
      { new: true }
    );
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

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