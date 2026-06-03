const mongoose = require('mongoose');

const GrocerySchema = new mongoose.Schema({
  householdId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Household', required: true },
  name:         { type: String, required: true },
  category:     { type: String, enum: ['vegetables','fruits','dairy','grains','snacks','cleaning','other'], default: 'other' },
  quantity:     { type: Number, default: 0 },
  unit:         { type: String, default: 'units' },
  minThreshold: { type: Number, default: 1 },
  price:        { type: Number, default: 0 },
  purchaseDate: { type: Date },
  expiryDate:   { type: Date },
  status:       { type: String, enum: ['in-stock','low','empty'], default: 'in-stock' },
  addedBy:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Grocery', GrocerySchema);