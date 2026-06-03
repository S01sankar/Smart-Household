const router = require('express').Router();
const protect = require('../middleware/auth');
const {
  getHousehold,
  updateBudget,
  joinHousehold,
  getMembers,
  addGuest,
  removeGuest
} = require('../controllers/householdController');

router.get('/',           protect, getHousehold);
router.put('/budget',     protect, updateBudget);
router.post('/join',      protect, joinHousehold);
router.get('/members',    protect, getMembers);
router.post('/add-guest', protect, addGuest);
router.delete('/remove-guest/:id', protect, removeGuest);

module.exports = router;