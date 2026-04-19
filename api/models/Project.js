const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  assignee: { type: String, default: '' },
  dueDate: { type: Date },
  status: { type: String, enum: ['todo', 'in_progress', 'review', 'done'], default: 'todo' },
}, { timestamps: true });

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['active', 'completed', 'paused', 'cancelled'], default: 'active' },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  dueDate: { type: Date },
  team: [{ type: String }],
  tasks: [taskSchema],
  color: { type: String, default: '#6366f1' },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
