const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  company: { type: String, default: '' },
  phone: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive', 'churned', 'trial'], default: 'active' },
  plan: { type: String, enum: ['free', 'starter', 'pro', 'enterprise'], default: 'free' },
  mrr: { type: Number, default: 0 },
  country: { type: String, default: '' },
  avatar: { type: String, default: '' },
  joinedAt: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
