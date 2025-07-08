import express from 'express';
import { adminAuthMiddleware } from '../middlewares/adminAuth.middleware.js';
import { Volunteer } from '../models/volunteer.model.js';

const router = express.Router();

router.post('/reports/generate', adminAuthMiddleware, async (req, res) => {
  try {
    // Get basic stats
    const stats = {
      total: await Volunteer.countDocuments(),
      approved: await Volunteer.countDocuments({ status: 'approved' }),
      pending: await Volunteer.countDocuments({ status: 'pending' }),
      rejected: await Volunteer.countDocuments({ status: 'rejected' }),
      activeEmergency: await Volunteer.countDocuments({ 'emergency.isAvailable': true })
    };

    res.json({
      success: true,
      data: {
        generatedAt: new Date(),
        stats,
        reportUrl: '/reports/latest' // Placeholder URL
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router; 