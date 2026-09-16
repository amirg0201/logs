const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  module: { type: String, required: true },
  action: { type: String, required: true },
  actor: {
    user_id: String,
    profile: String,
    school_id: String
  },
  target: {
    entity_id: String,
    entity_name: String
  },
  request_origin: {
    ip: String,
    city: String,
    country: String
  },
  technical_data: {
    log_id_gcp: { type: String, unique: true, sparse: true }
  }
}, {
  collection: 'activity_logs',
  strict: false // Flexible para permitir campos dinámicos futuros
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;
