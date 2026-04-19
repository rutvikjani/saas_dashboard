const mongoose = require('mongoose');

const revenueSchema = new mongoose.Schema({
  month: { type: String, required: true }, // "2024-01"
  mrr: { type: Number, default: 0 },
  arr: { type: Number, default: 0 },
  newRevenue: { type: Number, default: 0 },
  churnedRevenue: { type: Number, default: 0 },
  expansionRevenue: { type: Number, default: 0 },
  activeSubscriptions: { type: Number, default: 0 },
  churnRate: { type: Number, default: 0 },
  transactions: [{
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    amount: Number,
    type: { type: String, enum: ['subscription', 'one-time', 'refund'] },
    date: { type: Date, default: Date.now },
    description: String,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Revenue', revenueSchema);
