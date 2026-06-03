const router = require('express').Router();
const protect = require('../middleware/auth');
const { getSeasonalSuggestions } = require('../controllers/suggestionController');

router.get('/seasonal', protect, getSeasonalSuggestions);

module.exports = router;