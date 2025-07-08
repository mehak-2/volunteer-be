import express from 'express';
import { contactStepUser } from '../controllers/contactstep.controller.js';
const router = express.Router();

router.post('/contactStep', contactStepUser);

export default router;
