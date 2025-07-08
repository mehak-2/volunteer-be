import express from 'express';
import { ActivityController } from '../controllers/activity.controller.js';
import { adminAuthMiddleware } from '../middlewares/adminAuth.middleware.js';

const router = express.Router();

// Get recent activities (protected by admin auth)
router.get('/recent', adminAuthMiddleware, ActivityController.getRecentActivities);

// Create activity (protected by admin auth)
router.post('/', adminAuthMiddleware, ActivityController.createActivity);

export default router; 