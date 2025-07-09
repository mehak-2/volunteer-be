import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import onboardingRoutes from './routes/onboarding.routes.js';
import contactstepRoutes from './routes/contactstep.routes.js';
import skillsStepRoutes from './routes/skillsstep.routes.js';
import documentstepRoutes from './routes/documentstep.routes.js';
import volunteerRoutes from './routes/volunteer.routes.js';
import authRoutes from './routes/auth.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import adminRoutes from './routes/admin.routes.js';
import organizationRoutes from './routes/organization.routes.js';
import cookieParser from 'cookie-parser';
import alertRoutes from './routes/alert.routes.js';
import reportRoutes from './routes/reports.routes.js';
import emergencyRoutes from './routes/emergency.routes.js';

dotenv.config();
const app = express();

// Place this BEFORE other middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Origin', 
    'Accept', 
    'sec-ch-ua',
    'sec-ch-ua-mobile',
    'sec-ch-ua-platform',
    'user-agent',
    'referer'
  ],
  exposedHeaders: ['Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// Then place these after CORS middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/contactstep', contactstepRoutes);
app.use('/api/skillsstep', skillsStepRoutes);
app.use('/api/documentstep', documentstepRoutes);
app.use('/api/volunteer', volunteerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', alertRoutes);
app.use('/api/admin', volunteerRoutes);
app.use('/api/admin', reportRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/organization', organizationRoutes);

// MongoDB Connection with improved options
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/volunteer-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 15000, // Timeout after 15 seconds instead of 10
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  connectTimeoutMS: 15000, // Give up initial connection after 15 seconds
  maxPoolSize: 50, // Maintain up to 50 socket connections
  retryWrites: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Add upload routes
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
