import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js';
import User from '../models/user.model.js';
import {Alert} from '../models/alert.model.js';
import Activity from '../models/activity.model.js';
import Organization from '../models/organization.model.js';

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log('Admin not found');
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      data: {
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add logout endpoint
export const adminLogout = async (req, res) => {
  try {
    res.cookie('admin_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    console.log('Creating admin:', email);

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      email,
      password: hashedPassword,
      name,
      role: 'admin'
    });

    console.log('Admin created successfully:', admin.email);

    res.status(201).json({
      success: true,
      data: {
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        }
      }
    });
  } catch (error) {
    console.error('Admin creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const stats = {
      total: await User.countDocuments({ role: 'volunteer' }),
      pending: await User.countDocuments({ role: 'volunteer', status: 'pending' }),
      approved: await User.countDocuments({ role: 'volunteer', status: 'approved' }),
      active: await User.countDocuments({ 
        role: 'volunteer',
        status: 'approved', 
        'emergency.isAvailable': true 
      }),
      responseTime: "4.2 min",
      todayResponses: 23
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get volunteer list with filters
export const getVolunteers = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = { role: 'volunteer' };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { 'personalInfo.fullname': { $regex: search, $options: 'i' } },
        { 'email': { $regex: search, $options: 'i' } },
        { 'name': { $regex: search, $options: 'i' } }
      ];
    }

    const volunteers = await User.find(query)
      .select('name email personalInfo contactInfo skills status emergency profileCompletion onboardingComplete createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: volunteers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update volunteer status
export const updateVolunteerStatus = async (req, res) => {
  try {
    const { volunteerId, status } = req.body;

    const volunteer = await User.findByIdAndUpdate(
      volunteerId,
      { 
        status,
        lastUpdated: new Date()
      },
      { new: true }
    );

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found"
      });
    }

    // Create activity log
    await Activity.create({
      type: `volunteer_${status}`,
      volunteer: volunteerId,
      description: `Volunteer ${status === 'approved' ? 'approved' : 'rejected'}`,
    });

    res.status(200).json({
      success: true,
      data: volunteer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get recent activity
export const getRecentActivity = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate('volunteer', 'name personalInfo.fullname')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Send emergency alert
export const sendEmergencyAlert = async (req, res) => {
  try {
    const { title, description, severity, location } = req.body;

    const alert = await Alert.create({
      title,
      description,
      severity,
      location,
      status: 'active'
    });

    // Create activity log
    await Activity.create({
      type: 'emergency_alert',
      description: `Emergency alert created: ${title}`,
    });

    res.status(201).json({
      success: true,
      data: alert
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Organization Management
export const getOrganizations = async (req, res) => {
  try {
    const { status, search } = req.query;

    let filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const organizations = await Organization.find(filter)
      .select('name email description phone address status contact createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: organizations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateOrganizationStatus = async (req, res) => {
  try {
    const { organizationId, status } = req.body;

    const validStatuses = ['pending', 'approved', 'rejected', 'suspended'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be one of: pending, approved, rejected, suspended"
      });
    }

    const organization = await Organization.findByIdAndUpdate(
      organizationId,
      { 
        status,
        lastUpdated: new Date()
      },
      { new: true }
    ).select('name email description phone address status contact createdAt');

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found"
      });
    }

    res.status(200).json({
      success: true,
      data: organization
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

fetch('http://localhost:5000/api/admin/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: "admin@volunteerhub.com",
    password: "admin123",
    name: "Admin User"
  })
})
.then(res => res.json())
.then(data => console.log('Admin creation response:', data))
.catch(err => console.error('Error:', err));