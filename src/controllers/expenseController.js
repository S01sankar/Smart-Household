const Expense = require('../models/Expense');
const Household = require('../models/Household');
const Notification = require('../models/Notification');

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ householdId: req.user.householdId })
      .populate('addedBy', 'name')
      .sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addExpense = async (req, res) => {
  try {
    const expense = await Expense.create({
      ...req.body,
      householdId: req.user.householdId,
      addedBy: req.user._id
    });

    // Check budget limit
    const household = await Household.findById(req.user.householdId);
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const totalExpenses = await Expense.aggregate([
      { $match: { householdId: req.user.householdId, date: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const total = totalExpenses[0]?.total || 0;

    if (total > household.monthlyBudget) {
      await Notification.create({
        householdId: req.user.householdId,
        userId: req.user._id,
        message: `Monthly budget exceeded! Spent ₹${total} of ₹${household.monthlyBudget}`,
        type: 'budget'
      });

      global.io.to(req.user.householdId.toString()).emit('budget-exceeded', {
        message: `Monthly budget exceeded! Spent ₹${total} of ₹${household.monthlyBudget}`
      });
    }

    global.io.to(req.user.householdId.toString()).emit('expense-added', {
      message: `${req.user.name} added expense: ${expense.title}`,
      expense
    });

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getExpenseSummary = async (req, res) => {
  try {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const summary = await Expense.aggregate([
      { $match: { householdId: req.user.householdId, date: { $gte: startOfMonth } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } }
    ]);

    const totalSpent = summary.reduce((acc, cur) => acc + cur.total, 0);
    const household = await Household.findById(req.user.householdId);

    res.json({
      summary,
      totalSpent,
      monthlyBudget: household.monthlyBudget,
      remaining: household.monthlyBudget - totalSpent
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};