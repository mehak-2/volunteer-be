import express from 'express';
import { adminAuthMiddleware } from '../middlewares/adminAuth.middleware.js';
import User from '../models/user.model.js';

const router = express.Router();

router.post('/reports/generate', adminAuthMiddleware, async (req, res) => {
  try {
    const stats = {
      total: await User.countDocuments({ role: 'volunteer' }),
      approved: await User.countDocuments({ role: 'volunteer', status: 'approved' }),
      pending: await User.countDocuments({ role: 'volunteer', status: 'pending' }),
      rejected: await User.countDocuments({ role: 'volunteer', status: 'rejected' }),
      activeEmergency: await User.countDocuments({ 
        role: 'volunteer', 
        'emergency.isAvailable': true 
      })
    };

    res.json({
      success: true,
      data: {
        generatedAt: new Date(),
        stats,
        reportUrl: '/reports/latest'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router; 