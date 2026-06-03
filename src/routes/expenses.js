const router = require('express').Router();
const protect = require('../middleware/auth');
const {
  getExpenses,
  addExpense,
  deleteExpense,
  getExpenseSummary
} = require('../controllers/expenseController');

router.get('/',          protect, getExpenses);
router.post('/',         protect, addExpense);
router.delete('/:id',    protect, deleteExpense);
router.get('/summary',   protect, getExpenseSummary);

module.exports = router;