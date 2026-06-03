const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  quantity: { type: Number, required: true },
  unit:     { type: String, required: true },
  category: { type: String, default: 'other' }
});

const CustomRecipeSchema = new mongoose.Schema({
  householdId: { type: mongoose.Schema.Types.ObjectId, ref: 'Household', required: true },
  addedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name:        { type: String, required: true },
  category:    { type: String, default: 'other' },
  ingredients: [IngredientSchema],
  isDefault:   { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('CustomRecipe', CustomRecipeSchema);