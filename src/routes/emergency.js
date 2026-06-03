const router = require('express').Router();
const protect = require('../middleware/auth');
const {
  getEmergencies,
  triggerEmergency,
  resolveEmergency
} = require('../controllers/emergencyController');

router.get('/',           protect, getEmergencies);
router.post('/trigger',   protect, triggerEmergency);
router.put('/:id/resolve',protect, resolveEmergency);

module.exports = router;