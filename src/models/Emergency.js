const mongoose = require('mongoose');

const EmergencySchema = new mongoose.Schema({
  householdId:  { 
    type:     mongoose.Schema.Types.ObjectId, 
    ref:      'Household', 
    required: true 
  },
  triggeredBy:  { 
    type:     mongoose.Schema.Types.ObjectId, 
    ref:      'User', 
    required: true 
  },
  type:         { 
    type:    String, 
    enum:    ['fire', 'medical', 'gas', 'power', 'flood', 'other'], 
    required: true 
  },
  message:      { type: String },
  location:     {
    latitude:  { type: Number },
    longitude: { type: Number }
  },
  status:       { 
    type:    String, 
    enum:    ['active', 'resolved'], 
    default: 'active' 
  },
  resolvedAt:   { type: Date },
  resolvedBy:   { 
    type: mongoose.Schema.Types.ObjectId, 
    ref:  'User' 
  },
}, { timestamps: true });

const Emergency = mongoose.model('Emergency', EmergencySchema);

module.exports = Emergency;