const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  householdId: { type: mongoose.Schema.Types.ObjectId, ref: 'Household', required: true },
  title:       { type: String, required: true },
  assignedTo:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deadline:    { type: Date },
  priority:    { type: String, enum: ['low','medium','high'], default: 'medium' },
  status:      { type: String, enum: ['pending','completed'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);