const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
  householdId: { type: mongoose.Schema.Types.ObjectId, ref: 'Household', required: true },
  name:        { type: String, required: true },
  amount:      { type: Number, required: true },
  dueDate:     { type: Date, required: true },
  category:    { type: String, enum: ['electricity', 'water', 'gas', 'internet', 'rent', 'other'], default: 'other' },
  status:      { type: String, enum: ['paid', 'unpaid', 'overdue'], default: 'unpaid' },
  addedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  paidDate:    { type: Date },
  notes:       { type: String },
  isRecurring: { type: Boolean, default: false },
  recurringDay:{ type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Bill', BillSchema);