const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  householdId: { type: mongoose.Schema.Types.ObjectId, ref: 'Household', required: true },
  sender:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message:     { type: String, required: true },
  type:        { type: String, enum: ['text', 'emoji', 'alert'], default: 'text' },
  readBy:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Chat', ChatSchema);