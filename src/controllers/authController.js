const User = require('../models/User');
const Household = require('../models/Household');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, householdName } = req.body;

    console.log('Register request:', { name, email, phone });

    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res.status(400).json({ message: 'Email already exists' });

    const existingPhone = await User.findOne({ phone });
    if (existingPhone)
      return res.status(400).json({ message: 'Phone already exists' });

    const household = await Household.create({
      name: householdName || `${name}'s Home`
    });

    console.log('Household created:', household._id);

    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      householdId: household._id,
      role: 'admin'
    });

    console.log('User created:', user._id);

    household.members.push(user._id);
    household.admin = user._id;
    await household.save();

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name,
        email,
        phone,
        householdId: household._id
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }]
    });

    if (!user)
      return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        householdId: user.householdId
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const { language, theme } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { language, theme },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Preferences updated successfully',
      user
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};