import express from 'express';
import { documentStepUser } from '../controllers/documentstep.controller.js';

const router = express.Router();

router.post('/', documentStepUser);

export default router;
