const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true, unique: true, lowercase: true },
  phone:       { type: String, required: true, unique: true },
  password:    { type: String, required: true },
  householdId: { type: mongoose.Schema.Types.ObjectId, ref: 'Household' },
  role:        { type: String, enum: ['admin', 'member', 'guest'], default: 'member' },
  isGuest:     { type: Boolean, default: false },
  guestExpiresAt: { type: Date },
  language:    { type: String, enum: ['en', 'ta'], default: 'en' },
  theme:       { type: String, enum: ['light', 'dark'], default: 'light' },
  lastLocation: {
    latitude:  { type: Number },
    longitude: { type: Number }
  }
}, { timestamps: true });

UserSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', UserSchema);