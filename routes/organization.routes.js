import express from 'express';
import {
  organizationRegister,
  organizationLogin,
  getOrganizationDashboard,
  createProgram,
  getPrograms,
  getVolunteersForProgram,
  selectVolunteersForProgram,
  updateProgram,
  deleteProgram,
} from '../controllers/organization.controller.js';
import { organizationAuth } from '../middlewares/organizationAuth.middleware.js';

const router = express.Router();

router.post('/register', organizationRegister);
router.post('/login', organizationLogin);

router.use(organizationAuth);

router.get('/dashboard', getOrganizationDashboard);
router.post('/programs', createProgram);
router.get('/programs', getPrograms);
router.get('/programs/:programId/volunteers', getVolunteersForProgram);
router.post('/programs/:programId/select-volunteers', selectVolunteersForProgram);
router.put('/programs/:programId', updateProgram);
router.delete('/programs/:programId', deleteProgram);

export default router; 