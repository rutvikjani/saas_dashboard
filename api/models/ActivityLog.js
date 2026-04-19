const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  entity: { type: String, default: '' },
  entityId: { type: String, default: '' },
  description: { type: String, default: '' },
  metadata: { type: Object, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
