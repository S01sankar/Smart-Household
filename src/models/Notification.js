const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  householdId: { type: mongoose.Schema.Types.ObjectId, ref: 'Household' },
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message:     { type: String, required: true },
  type:        { type: String, enum: ['low-stock','expiry','budget','task','activity'], default: 'activity' },
  read:        { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);