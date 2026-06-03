const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const HouseholdSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  inviteCode:    { type: String, default: uuidv4 },
  members:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  admin:         { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  monthlyBudget: { type: Number, default: 10000 },
}, { timestamps: true });

module.exports = mongoose.model('Household', HouseholdSchema);