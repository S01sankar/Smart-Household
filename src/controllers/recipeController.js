const { 
    getAllRecipes: getDefaultRecipes, 
    getRecipeByName: findRecipe,
    getRecipesByCategory: findByCategory
  } = require('../utils/recipes');
  const CustomRecipe = require('../models/CustomRecipe');
  
  exports.getAllRecipes = async (req, res) => {
    try {
      // Get custom recipes for this household
      const customRecipes = await CustomRecipe.find({ 
        householdId: req.user.householdId 
      });
  
      const allRecipes = getDefaultRecipes(customRecipes);
      res.json(allRecipes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  exports.getRecipeByName = async (req, res) => {
    try {
      const { name } = req.query;
  
      if (!name)
        return res.status(400).json({ message: 'Please provide a recipe name' });
  
      // Get custom recipes for this household
      const customRecipes = await CustomRecipe.find({ 
        householdId: req.user.householdId 
      });
  
      const recipe = findRecipe(name, customRecipes);
  
      if (!recipe)
        return res.status(404).json({ message: 'Recipe not found' });
  
      // Check which ingredients are already in stock
      const Grocery = require('../models/Grocery');
      const groceries = await Grocery.find({ 
        householdId: req.user.householdId 
      });
  
      const ingredientsWithStock = recipe.ingredients.map(ingredient => {
        const inStock = groceries.find(g => 
          g.name.toLowerCase() === ingredient.name.toLowerCase()
        );
        return {
          ...ingredient,
          inStock: inStock ? true : false,
          currentQuantity: inStock ? inStock.quantity : 0,
          status: inStock ? inStock.status : 'not available'
        };
      });
  
      res.json({
        ...recipe,
        ingredients: ingredientsWithStock
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  exports.getRecipesByCategory = async (req, res) => {
    try {
      const { cat } = req.params;
  
      const customRecipes = await CustomRecipe.find({ 
        householdId: req.user.householdId 
      });
  
      const recipes = findByCategory(cat, customRecipes);
      res.json(recipes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  exports.addCustomRecipe = async (req, res) => {
    try {
      const { name, category, ingredients } = req.body;
  
      if (!name || !ingredients)
        return res.status(400).json({ message: 'Name and ingredients are required' });
  
      const recipe = await CustomRecipe.create({
        name,
        category,
        ingredients,
        householdId: req.user.householdId,
        addedBy: req.user._id,
        isDefault: false
      });
  
      res.status(201).json(recipe);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  exports.deleteCustomRecipe = async (req, res) => {
    try {
      const recipe = await CustomRecipe.findById(req.params.id);
  
      if (!recipe)
        return res.status(404).json({ message: 'Recipe not found' });
  
      if (recipe.isDefault)
        return res.status(400).json({ message: 'Cannot delete default recipes' });
  
      await CustomRecipe.findByIdAndDelete(req.params.id);
      res.json({ message: 'Recipe deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };