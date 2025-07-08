import express from 'express';
import { submitApplication, personalInfoUser } from '../controllers/onboarding.controller.js';

const router = express.Router();

router.post('/submit', submitApplication);
router.post('/personalInfo', personalInfoUser);

export default router;
