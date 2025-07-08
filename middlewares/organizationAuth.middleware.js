import jwt from 'jsonwebtoken';
import Organization from '../models/organization.model.js';

export const organizationAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    if (decoded.role !== 'organization') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Organization role required.'
      });
    }

    const organization = await Organization.findById(decoded.id);
    
    if (!organization) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Organization not found.'
      });
    }

    if (organization.status !== 'approved') {
      return res.status(401).json({
        success: false,
        message: 'Organization not approved.'
      });
    }

    req.organization = {
      id: organization._id,
      email: organization.email,
      name: organization.name
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
}; 