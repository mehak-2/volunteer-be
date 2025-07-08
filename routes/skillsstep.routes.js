import express from 'express';
import { skillsStepUser } from '../controllers/skillsstep.controller.js';

const router = express.Router();

router.post('/skillsStep', skillsStepUser);

export default router;
