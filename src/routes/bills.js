const router = require('express').Router();
const protect = require('../middleware/auth');
const {
  getBills,
  addBill,
  updateBill,
  deleteBill,
  markAsPaid
} = require('../controllers/billController');

router.get('/',           protect, getBills);
router.post('/',          protect, addBill);
router.put('/:id',        protect, updateBill);
router.delete('/:id',     protect, deleteBill);
router.put('/:id/paid',   protect, markAsPaid);

module.exports = router;