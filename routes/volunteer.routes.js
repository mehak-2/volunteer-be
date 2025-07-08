import express from 'express';
import {
  getVolunteerProfile,
  updateProfile,
  toggleEmergencyStatus,
  createNewAlert,
  respondToAlert
} from '../controllers/volunteer.controller.js';
import { adminAuthMiddleware } from '../middlewares/adminAuth.middleware.js';
import User from '../models/user.model.js';

const router = express.Router();

router.get('/profile/:userId', getVolunteerProfile);
router.put('/profile/:userId', updateProfile);
router.put('/emergency-status/:userId', toggleEmergencyStatus);
router.post('/alerts', createNewAlert);
router.put('/alerts/:alertId/respond', respondToAlert);

router.post('/volunteers/bulk-approve', adminAuthMiddleware, async (req, res) => {
  try {
    const { volunteerIds } = req.body;
    
    if (!volunteerIds || !Array.isArray(volunteerIds)) {
      return res.status(400).json({ 
        success: false, 
        error: 'volunteerIds array is required' 
      });
    }

    await User.updateMany(
      { _id: { $in: volunteerIds }, role: 'volunteer' },
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
