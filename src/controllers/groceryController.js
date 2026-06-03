const Grocery = require('../models/Grocery');
const Notification = require('../models/Notification');

exports.getGroceries = async (req, res) => {
  try {
    const groceries = await Grocery.find({ householdId: req.user.householdId })
      .populate('addedBy', 'name');
    res.json(groceries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addGrocery = async (req, res) => {
  try {
    const { name, category, quantity, unit, minThreshold, price, purchaseDate, expiryDate } = req.body;

    let status = 'in-stock';
    if (quantity <= 0) status = 'empty';
    else if (quantity <= minThreshold) status = 'low';

    const grocery = await Grocery.create({
      name, category, quantity, unit, minThreshold, price, purchaseDate, expiryDate,
      status,
      householdId: req.user.householdId,
      addedBy: req.user._id
    });

    global.io.to(req.user.householdId.toString()).emit('grocery-added', {
      message: `${req.user.name} added ${grocery.name}`,
      grocery
    });

    await Notification.create({
      householdId: req.user.householdId,
      userId: req.user._id,
      message: `${req.user.name} added ${grocery.name}`,
      type: 'activity'
    });

    res.status(201).json(grocery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateGrocery = async (req, res) => {
  try {
    const grocery = await Grocery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!grocery)
      return res.status(404).json({ message: 'Grocery not found' });

    // Check if low or empty and notify
    if (grocery.status === 'low' || grocery.status === 'empty') {
      await Notification.create({
        householdId: req.user.householdId,
        userId: req.user._id,
        message: `${grocery.name} is ${grocery.status}!`,
        type: 'low-stock'
      });

      global.io.to(req.user.householdId.toString()).emit('low-stock', {
        message: `${grocery.name} is ${grocery.status}!`,
        grocery
      });
    }

    res.json(grocery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteGrocery = async (req, res) => {
  try {
    await Grocery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Grocery deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.restockAll = async (req, res) => {
  try {
    const items = await Grocery.find({
      householdId: req.user.householdId,
      status: { $in: ['low', 'empty'] }
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};