const router = require('express').Router();
const protect = require('../middleware/auth');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../controllers/notificationController');

router.get('/',           protect, getNotifications);
router.put('/:id',        protect, markAsRead);
router.put('/read/all',   protect, markAllAsRead);
router.delete('/:id',     protect, deleteNotification);

module.exports = router;