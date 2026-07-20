const ActivityLog = require('../models/ActivityLog');

async function logActivity(userId, action, details = {}, ipAddress = null) {
  try {
    await ActivityLog.create({ userId, action, details, ipAddress });
  } catch (err) {
    console.error('Failed to log activity:', err.message);
  }
}

module.exports = logActivity;
