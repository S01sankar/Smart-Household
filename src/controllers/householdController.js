const Household = require('../models/Household');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

exports.getHousehold = async (req, res) => {
  try {
    const household = await Household.findById(req.user.householdId)
      .populate('members', 'name email phone role isGuest guestExpiresAt')
      .populate('admin', 'name email');
    res.json(household);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBudget = async (req, res) => {
  try {
    const household = await Household.findByIdAndUpdate(
      req.user.householdId,
      { monthlyBudget: req.body.monthlyBudget },
      { new: true }
    );
    res.json(household);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.joinHousehold = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const household = await Household.findOne({ inviteCode });

    if (!household)
      return res.status(404).json({ message: 'Invalid invite code' });

    if (household.members.includes(req.user._id))
      return res.status(400).json({ message: 'Already a member' });

    household.members.push(req.user._id);
    await household.save();

    await User.findByIdAndUpdate(req.user._id, {
      householdId: household._id
    });

    global.io.to(household._id.toString()).emit('member-joined', {
      message: `${req.user.name} joined the household`
    });

    res.json({ message: 'Joined successfully', household });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMembers = async (req, res) => {
  try {
    const household = await Household.findById(req.user.householdId)
      .populate('members', 'name email phone role isGuest guestExpiresAt');
    res.json(household.members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addGuest = async (req, res) => {
  try {
    // Only admin can add guests
    if (req.user.role !== 'admin')
      return res.status(403).json({ message: 'Only admin can add guests' });

    const { name, email, phone, password, daysAccess } = req.body;

    // Check if user already exists
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already exists' });

    // Calculate expiry date
    const guestExpiresAt = new Date();
    guestExpiresAt.setDate(guestExpiresAt.getDate() + (daysAccess || 7));

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create guest user
    const guest = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      householdId: req.user.householdId,
      role: 'guest',
      isGuest: true,
      guestExpiresAt
    });

    // Add to household members
    const household = await Household.findById(req.user.householdId);
    household.members.push(guest._id);
    await household.save();

    global.io.to(req.user.householdId.toString()).emit('member-joined', {
      message: `${guest.name} joined as a guest`
    });

    res.status(201).json({
      message: 'Guest added successfully',
      guest: {
        id: guest._id,
        name: guest.name,
        email: guest.email,
        role: guest.role,
        guestExpiresAt: guest.guestExpiresAt
      },
      token: generateToken(guest._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeGuest = async (req, res) => {
  try {
    // Only admin can remove guests
    if (req.user.role !== 'admin')
      return res.status(403).json({ message: 'Only admin can remove guests' });

    const guest = await User.findById(req.params.id);

    if (!guest)
      return res.status(404).json({ message: 'Guest not found' });

    if (!guest.isGuest)
      return res.status(400).json({ message: 'User is not a guest' });

    // Remove from household members
    await Household.findByIdAndUpdate(req.user.householdId, {
      $pull: { members: guest._id }
    });

    // Delete guest user
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'Guest removed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};