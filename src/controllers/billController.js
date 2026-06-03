const Bill = require('../models/Bill');
const Notification = require('../models/Notification');

exports.getBills = async (req, res) => {
  try {
    const bills = await Bill.find({ householdId: req.user.householdId })
      .populate('addedBy', 'name')
      .sort({ dueDate: 1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addBill = async (req, res) => {
  try {
    const bill = await Bill.create({
      ...req.body,
      householdId: req.user.householdId,
      addedBy: req.user._id
    });

    // Notify all members
    await Notification.create({
      householdId: req.user.householdId,
      userId: req.user._id,
      message: `New bill added: ${bill.name} of ₹${bill.amount} due on ${new Date(bill.dueDate).toDateString()}`,
      type: 'activity'
    });

    global.io.to(req.user.householdId.toString()).emit('bill-added', {
      message: `New bill added: ${bill.name}`,
      bill
    });

    res.status(201).json(bill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBill = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!bill)
      return res.status(404).json({ message: 'Bill not found' });

    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBill = async (req, res) => {
  try {
    await Bill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bill deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markAsPaid = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'paid',
        paidDate: new Date()
      },
      { new: true }
    );

    if (!bill)
      return res.status(404).json({ message: 'Bill not found' });

    // Notify all members
    await Notification.create({
      householdId: req.user.householdId,
      userId: req.user._id,
      message: `${req.user.name} paid bill: ${bill.name} of ₹${bill.amount}`,
      type: 'activity'
    });

    global.io.to(req.user.householdId.toString()).emit('bill-paid', {
      message: `${req.user.name} paid bill: ${bill.name}`,
      bill
    });

    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};