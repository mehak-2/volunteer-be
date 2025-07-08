import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js';

export const adminAuthMiddleware = async (req, res, next) => {
  try {
    // Check both cookie and Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Admin not found.'
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}; 