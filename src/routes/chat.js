const router = require('express').Router();
const protect = require('../middleware/auth');
const {
  getMessages,
  sendMessage,
  deleteMessage
} = require('../controllers/chatController');

router.get('/',       protect, getMessages);
router.post('/',      protect, sendMessage);
router.delete('/:id', protect, deleteMessage);

module.exports = router;