import { ActivityService } from '../services/activity.service.js';

export const ActivityController = {
  async getRecentActivities(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const activities = await ActivityService.getRecentActivities(limit);
      res.json({ success: true, data: activities });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async createActivity(req, res) {
    try {
      const activity = await ActivityService.createActivity(req.body);
      res.status(201).json({ success: true, data: activity });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}; 