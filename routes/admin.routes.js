import express from 'express';
import { default as Activity } from '../models/activity.model.js';
import User from '../models/user.model.js';
import Organization from '../models/organization.model.js';
import {
  adminLogin,
  createAdmin,
  adminLogout,
  getDashboardStats,
  getVolunteers,
  updateVolunteerStatus,
  getRecentActivity,
  sendEmergencyAlert,
  getOrganizations,
  updateOrganizationStatus,
} from '../controllers/admin.controller.js';
import { adminAuthMiddleware } from '../middlewares/adminAuth.middleware.js';

const router = express.Router();

router.post('/login', adminLogin);
router.post('/logout', adminLogout);
router.post('/create', createAdmin);
router.get('/dashboard', adminAuthMiddleware, getDashboardStats);
router.get('/volunteers', adminAuthMiddleware, getVolunteers);
router.put('/volunteers/:id/status', adminAuthMiddleware, updateVolunteerStatus);
router.patch('/volunteers/:volunteerId/status', adminAuthMiddleware, async (req, res) => {
  try {
    const { volunteerId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be one of: pending, approved, rejected"
      });
    }

    const volunteer = await User.findByIdAndUpdate(
      volunteerId,
      {
        status,
        lastUpdated: new Date()
      },
      { new: true }
    ).select('name email personalInfo contactInfo skills status emergency profileCompletion onboardingComplete createdAt');

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found"
      });
    }

    await Activity.create({
      type: `volunteer_${status}`,
      volunteer: volunteerId,
      description: `Volunteer ${status === 'approved' ? 'approved' : 'rejected'}`,
    });

    res.status(200).json({
      success: true,
      data: [volunteer]
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
router.get('/activity', adminAuthMiddleware, getRecentActivity);
router.post('/emergency-alert', adminAuthMiddleware, sendEmergencyAlert);
router.get('/organizations', adminAuthMiddleware, getOrganizations);
router.put('/organizations/:id/status', adminAuthMiddleware, updateOrganizationStatus);
router.patch('/organizations/status', adminAuthMiddleware, async (req, res) => {
  try {
    const { organizationId, status } = req.body;

    const validStatuses = ['pending', 'approved', 'rejected', 'suspended'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be one of: pending, approved, rejected, suspended"
      });
    }

    const organization = await Organization.findByIdAndUpdate(
      organizationId,
      { 
        status,
        lastUpdated: new Date()
      },
      { new: true }
    ).select('name email description phone address status contact createdAt');

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found"
      });
    }

    res.status(200).json({
      success: true,
      data: organization
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router; 