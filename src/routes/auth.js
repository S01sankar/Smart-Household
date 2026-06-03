const router = require('express').Router();
const {
  register,
  login,
  getMe,
  updatePreferences
} = require('../controllers/authController');
const protect = require('../middleware/auth');

router.post('/register',     register);
router.post('/login',        login);
router.get('/me',            protect, getMe);
router.put('/preferences',   protect, updatePreferences);

// Temporary WhatsApp test route
router.get('/test-whatsapp', async (req, res) => {
  try {
    const sendWhatsApp = require('../utils/sendWhatsApp');
    await sendWhatsApp('9363146368', 'Test message from SmartHome! 🏠');
    res.json({ message: 'WhatsApp sent successfully' });
  } catch (err) {
    console.error('Test error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;