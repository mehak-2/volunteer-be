import Activity from '../models/activity.model.js';

export const ActivityService = {
  async createActivity(data) {
    try {
      const activity = new Activity(data);
      await activity.save();
      return activity;
    } catch (error) {
      throw error;
    }
  },

  async getRecentActivities(limit = 10) {
    try {
      const activities = await Activity.find()
        .populate('volunteer', 'personalInfo.fullname')
        .sort({ timestamp: -1 })
        .limit(limit);
      
      return activities.map(activity => ({
        id: activity._id,
        description: activity.description,
        volunteer: activity.volunteer?.personalInfo?.fullname || 'Unknown',
        timestamp: activity.timestamp,
        type: activity.type
      }));
    } catch (error) {
      throw error;
    }
  }
}; 