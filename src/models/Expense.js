const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  householdId: { type: mongoose.Schema.Types.ObjectId, ref: 'Household', required: true },
  title:       { type: String, required: true },
  amount:      { type: Number, required: true },
  category:    { type: String, enum: ['vegetables','fruits','dairy','grains','snacks','cleaning','utility','other'], default: 'other' },
  date:        { type: Date, default: Date.now },
  addedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes:       { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);