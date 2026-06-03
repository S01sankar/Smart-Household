const router = require('express').Router();
const protect = require('../middleware/auth');
const {
  getAllRecipes,
  getRecipeByName,
  getRecipesByCategory,
  addCustomRecipe,
  deleteCustomRecipe
} = require('../controllers/recipeController');

router.get('/',                protect, getAllRecipes);
router.get('/search',          protect, getRecipeByName);
router.get('/category/:cat',   protect, getRecipesByCategory);
router.post('/custom',         protect, addCustomRecipe);
router.delete('/custom/:id',   protect, deleteCustomRecipe);

module.exports = router;