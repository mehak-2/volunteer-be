import express from 'express';
import { Alert } from '../models/alert.model.js';
import { adminAuthMiddleware } from '../middlewares/adminAuth.middleware.js';

const router = express.Router();

router.post('/alert', adminAuthMiddleware, async (req, res) => {
  try {
    const { message, severity } = req.body;
    const alert = new Alert({
      type: 'Medical Emergency', // Using a valid enum value from the schema
      volunteer: req.admin._id, // Required field
      location: {
        address: 'Emergency Response Center', // Required field
        coordinates: {
          lat: 0,
          lng: 0
        }
      },
      priority: severity || 'high',
      status: 'pending',
      notes: message,
      createdBy: req.admin._id
    });
    
    await alert.save();
    res.status(201).json({ success: true, data: alert });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router; 