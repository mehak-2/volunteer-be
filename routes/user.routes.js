import express from 'express';
import { registerUser, findUserByEmail, demoLogin, getUser } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/demo-login', demoLogin);
router.get('/find/:email', findUserByEmail);
router.get('/user', getUser);

export default router;
