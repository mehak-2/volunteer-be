import express from 'express';
import { getActiveVolunteers, getEmergencyAlerts } from '../controllers/emergency.controller.js';
import { adminAuthMiddleware } from '../middlewares/adminAuth.middleware.js';

const router = express.Router();

router.get('/active-volunteers', adminAuthMiddleware, getActiveVolunteers);
router.get('/alerts', adminAuthMiddleware, getEmergencyAlerts);

export default router; 