import express from 'express';
import { Volunteer } from '../models/volunteer.model.js';
import { default as Activity } from '../models/activity.model.js';
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

// Auth routes
router.post('/login', adminLogin);
router.post('/create', createAdmin);
router.post('/logout', adminLogout);

// Protected dashboard routes
router.get('/stats', adminAuthMiddleware, getDashboardStats);
router.get('/volunteers', adminAuthMiddleware, getVolunteers);
router.put('/volunteers/:id/status', adminAuthMiddleware, updateVolunteerStatus);
router.patch('/volunteers/:volunteerId/status', adminAuthMiddleware, async (req, res) => {
  try {
    const { volunteerId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be one of: pending, approved, rejected"
      });
    }

    const volunteer = await Volunteer.findByIdAndUpdate(
      volunteerId,
      {
        status,
        lastUpdated: new Date(),
        $push: {
          statusHistory: {
            status,
            updatedAt: new Date()
          }
        }
      },
      { new: true }
    ).select('personalInfo contactInfo skills status emergency joinDate');

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found"
      });
    }

    // Create activity log
    await Activity.create({
      type: `volunteer_${status}`,
      volunteer: volunteerId,
      description: `Volunteer ${status === 'approved' ? 'approved' : 'rejected'}`,
    });

    res.status(200).json({
      success: true,
      data: [volunteer] // Returning as array to match existing format
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
router.get('/activity', adminAuthMiddleware, getRecentActivity);
router.post('/alerts', adminAuthMiddleware, sendEmergencyAlert);

// Organization management routes
router.get('/organizations', adminAuthMiddleware, getOrganizations);
router.patch('/organizations/status', adminAuthMiddleware, updateOrganizationStatus);

export default router; 