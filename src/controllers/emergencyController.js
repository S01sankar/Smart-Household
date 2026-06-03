const Emergency = require('../models/Emergency');
const Notification = require('../models/Notification');
const User = require('../models/User');
const sendWhatsApp = require('../utils/sendWhatsApp');

const emergencyEmoji = {
  fire:    '🔥',
  medical: '🚑',
  gas:     '⚠️',
  power:   '⚡',
  flood:   '🌊',
  other:   '🚨'
};

const emergencyMessage = {
  fire:    'FIRE EMERGENCY! Please evacuate immediately!',
  medical: 'MEDICAL EMERGENCY! Someone needs immediate help!',
  gas:     'GAS LEAK EMERGENCY! Open windows and evacuate!',
  power:   'POWER CUT EMERGENCY! Be careful in the dark!',
  flood:   'FLOOD EMERGENCY! Move to higher ground immediately!',
  other:   'EMERGENCY ALERT! Please respond immediately!'
};

exports.getEmergencies = async (req, res) => {
  try {
    const emergencies = await Emergency.find({
      householdId: req.user.householdId
    })
      .populate('triggeredBy', 'name phone')
      .populate('resolvedBy',  'name')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(emergencies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.triggerEmergency = async (req, res) => {
  try {
    const { type, message, location } = req.body;

    const emergency = await Emergency.create({
      householdId: req.user.householdId,
      triggeredBy: req.user._id,
      type,
      message:     message || emergencyMessage[type],
      location,
      status:      'active'
    });

    // Get all household members
    const members = await User.find({
      householdId: req.user.householdId,
      _id:         { $ne: req.user._id }
    });

    // Send WhatsApp to all members
    for (const member of members) {
      if (member.phone) {
        const locationText = location
          ? `\n📍 Location: https://maps.google.com/?q=${location.latitude},${location.longitude}`
          : '';

        await sendWhatsApp(
          member.phone,
          `${emergencyEmoji[type]} *EMERGENCY ALERT!*\n\n` +
          `🏠 *${req.user.name}* has triggered an emergency!\n\n` +
          `🚨 Type: *${type.toUpperCase()}*\n` +
          `📢 Message: *${message || emergencyMessage[type]}*` +
          `${locationText}\n\n` +
          `⏰ Time: ${new Date().toLocaleString('en-IN')}\n\n` +
          `Please respond immediately! 🙏`
        );
      }

      // Create in app notification
      await Notification.create({
        householdId: req.user.householdId,
        userId:      member._id,
        message:     `${emergencyEmoji[type]} EMERGENCY! ${req.user.name} triggered ${type} alert!`,
        type:        'activity'
      });
    }

    // Emit real time emergency event
    global.io.to(req.user.householdId.toString()).emit('emergency', {
      message:   `${emergencyEmoji[type]} EMERGENCY! ${req.user.name} triggered ${type} alert!`,
      emergency,
      type
    });

    res.status(201).json(emergency);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resolveEmergency = async (req, res) => {
  try {
    const emergency = await Emergency.findByIdAndUpdate(
      req.params.id,
      {
        status:     'resolved',
        resolvedAt: new Date(),
        resolvedBy: req.user._id
      },
      { new: true }
    );

    if (!emergency)
      return res.status(404).json({ message: 'Emergency not found' });

    // Notify all members emergency is resolved
    const members = await User.find({
      householdId: req.user.householdId
    });

    for (const member of members) {
      if (member.phone) {
        await sendWhatsApp(
          member.phone,
          `✅ *Emergency Resolved!*\n\n` +
          `🏠 The ${emergency.type} emergency has been resolved by *${req.user.name}*\n` +
          `⏰ Resolved at: ${new Date().toLocaleString('en-IN')}\n\n` +
          `Everything is safe now! 🙏`
        );
      }
    }

    global.io.to(req.user.householdId.toString()).emit('emergency-resolved', {
      message:   `✅ Emergency resolved by ${req.user.name}`,
      emergency
    });

    res.json(emergency);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};