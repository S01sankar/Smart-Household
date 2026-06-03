const router = require('express').Router();
const protect = require('../middleware/auth');
const {
  getTasks,
  addTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

router.get('/',       protect, getTasks);
router.post('/',      protect, addTask);
router.put('/:id',    protect, updateTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;