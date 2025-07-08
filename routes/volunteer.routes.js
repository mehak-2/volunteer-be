import express from 'express';
import {
  createVolunteer,
  getVolunteerProfile,
  updateProfile,
  toggleEmergencyStatus,
  createNewAlert,
  respondToAlert
} from '../controllers/volunteer.controller.js';
import { adminAuthMiddleware } from '../middlewares/adminAuth.middleware.js';
import { Volunteer } from '../models/volunteer.model.js';

const router = express.Router();

router.post('/create', createVolunteer);
router.get('/profile/:userId', getVolunteerProfile);
router.put('/profile/:userId', updateProfile);
router.put('/emergency-status/:userId', toggleEmergencyStatus);
router.post('/alerts', createNewAlert);
router.put('/alerts/:alertId/respond', respondToAlert);

// Add this new route for bulk approval
router.post('/volunteers/bulk-approve', adminAuthMiddleware, async (req, res) => {
  try {
    const { volunteerIds } = req.body;
    
    if (!volunteerIds || !Array.isArray(volunteerIds)) {
      return res.status(400).json({ 
        success: false, 
        error: 'volunteerIds array is required' 
      });
    }

    await Volunteer.updateMany(
      { _id: { $in: volunteerIds } },
      { $set: { status: 'approved' } }
    );

    res.json({ 
      success: true, 
      message: `${volunteerIds.length} volunteers approved` 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
