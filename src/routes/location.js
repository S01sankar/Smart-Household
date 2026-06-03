const router = require('express').Router();
const protect = require('../middleware/auth');
const {
  saveLocation,
  getNearbyStores
} = require('../controllers/locationController');

router.post('/save',   protect, saveLocation);
router.post('/nearby', protect, getNearbyStores);

module.exports = router;