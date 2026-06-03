const router = require('express').Router();
const protect = require('../middleware/auth');
const {
  getGroceries,
  addGrocery,
  updateGrocery,
  deleteGrocery,
  restockAll
} = require('../controllers/groceryController');

router.get('/',          protect, getGroceries);
router.post('/',         protect, addGrocery);
router.put('/:id',       protect, updateGrocery);
router.delete('/:id',    protect, deleteGrocery);
router.get('/restock',   protect, restockAll);

module.exports = router;