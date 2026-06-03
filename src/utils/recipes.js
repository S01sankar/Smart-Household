const defaultRecipes = [
    {
      name: 'Chicken Biryani',
      category: 'non vegetarian',
      isDefault: true,
      ingredients: [
        { name: 'Basmati Rice', quantity: 2, unit: 'cups', category: 'grains' },
        { name: 'Chicken', quantity: 500, unit: 'grams', category: 'other' },
        { name: 'Onion', quantity: 3, unit: 'units', category: 'vegetables' },
        { name: 'Tomato', quantity: 2, unit: 'units', category: 'vegetables' },
        { name: 'Ginger Garlic Paste', quantity: 2, unit: 'units', category: 'other' },
        { name: 'Biryani Masala', quantity: 2, unit: 'units', category: 'other' },
        { name: 'Curd', quantity: 1, unit: 'cup', category: 'dairy' },
        { name: 'Mint Leaves', quantity: 1, unit: 'units', category: 'vegetables' },
        { name: 'Oil', quantity: 3, unit: 'units', category: 'other' },
        { name: 'Salt', quantity: 1, unit: 'units', category: 'other' },
      ]
    },
    {
      name: 'Mutton Biryani',
      category: 'non vegetarian',
      isDefault: true,
      ingredients: [
        { name: 'Basmati Rice', quantity: 2, unit: 'cups', category: 'grains' },
        { name: 'Mutton', quantity: 500, unit: 'grams', category: 'other' },
        { name: 'Onion', quantity: 3, unit: 'units', category: 'vegetables' },
        { name: 'Tomato', quantity: 2, unit: 'units', category: 'vegetables' },
        { name: 'Ginger Garlic Paste', quantity: 2, unit: 'units', category: 'other' },
        { name: 'Biryani Masala', quantity: 2, unit: 'units', category: 'other' },
        { name: 'Curd', quantity: 1, unit: 'cup', category: 'dairy' },
        { name: 'Mint Leaves', quantity: 1, unit: 'units', category: 'vegetables' },
        { name: 'Oil', quantity: 3, unit: 'units', category: 'other' },
        { name: 'Salt', quantity: 1, unit: 'units', category: 'other' },
      ]
    },
    {
      name: 'Grill',
      category: 'non vegetarian',
      isDefault: true,
      ingredients: [
        { name: 'Chicken', quantity: 500, unit: 'grams', category: 'other' },
        { name: 'Lemon', quantity: 2, unit: 'units', category: 'fruits' },
        { name: 'Chilli Powder', quantity: 2, unit: 'units', category: 'other' },
        { name: 'Turmeric', quantity: 1, unit: 'units', category: 'other' },
        { name: 'Ginger Garlic Paste', quantity: 2, unit: 'units', category: 'other' },
        { name: 'Oil', quantity: 2, unit: 'units', category: 'other' },
        { name: 'Salt', quantity: 1, unit: 'units', category: 'other' },
      ]
    },
    {
      name: 'Sambar',
      category: 'south indian',
      isDefault: true,
      ingredients: [
        { name: 'Toor Dal', quantity: 1, unit: 'cup', category: 'grains' },
        { name: 'Tomato', quantity: 2, unit: 'units', category: 'vegetables' },
        { name: 'Onion', quantity: 1, unit: 'units', category: 'vegetables' },
        { name: 'Tamarind', quantity: 1, unit: 'units', category: 'other' },
        { name: 'Sambar Powder', quantity: 2, unit: 'units', category: 'other' },
        { name: 'Mustard Seeds', quantity: 1, unit: 'units', category: 'other' },
        { name: 'Curry Leaves', quantity: 1, unit: 'units', category: 'vegetables' },
        { name: 'Oil', quantity: 2, unit: 'units', category: 'other' },
      ]
    },
    {
      name: 'Rasam',
      category: 'south indian',
      isDefault: true,
      ingredients: [
        { name: 'Tomato', quantity: 2, unit: 'units', category: 'vegetables' },
        { name: 'Tamarind', quantity: 1, unit: 'units', category: 'other' },
        { name: 'Pepper', quantity: 1, unit: 'units', category: 'other' },
        { name: 'Cumin Seeds', quantity: 1, unit: 'units', category: 'other' },
        { name: 'Mustard Seeds', quantity: 1, unit: 'units', category: 'other' },
        { name: 'Curry Leaves', quantity: 1, unit: 'units', category: 'vegetables' },
        { name: 'Garlic', quantity: 3, unit: 'units', category: 'vegetables' },
        { name: 'Salt', quantity: 1, unit: 'units', category: 'other' },
      ]
    },
    {
      name: 'Puli Kulambu',
      category: 'south indian',
      isDefault: true,
      ingredients: [
        { name: 'Tamarind', quantity: 2, unit: 'units', category: 'other' },
        { name: 'Onion', quantity: 1, unit: 'units', category: 'vegetables' },
        { name: 'Tomato', quantity: 1, unit: 'units', category: 'vegetables' },
        { name: 'Chilli Powder', quantity: 2, unit: 'units', category: 'other' },
        { name: 'Coriander Powder', quantity: 1, unit: 'units', category: 'other' },
        { name: 'Mustard Seeds', quantity: 1, unit: 'units', category: 'other' },
        { name: 'Curry Leaves', quantity: 1, unit: 'units', category: 'vegetables' },
        { name: 'Oil', quantity: 3, unit: 'units', category: 'other' },
        { name: 'Salt', quantity: 1, unit: 'units', category: 'other' },
      ]
    },
    {
      name: 'Rice',
      category: 'rice',
      isDefault: true,
      ingredients: [
        { name: 'Rice', quantity: 2, unit: 'cups', category: 'grains' },
        { name: 'Water', quantity: 4, unit: 'cups', category: 'other' },
        { name: 'Salt', quantity: 1, unit: 'units', category: 'other' },
      ]
    },
    {
      name: 'Idiyappam',
      category: 'breakfast',
      isDefault: true,
      ingredients: [
        { name: 'Rice Flour', quantity: 2, unit: 'cups', category: 'grains' },
        { name: 'Salt', quantity: 1, unit: 'units', category: 'other' },
        { name: 'Oil', quantity: 1, unit: 'units', category: 'other' },
        { name: 'Water', quantity: 2, unit: 'cups', category: 'other' },
      ]
    },
    {
      name: 'Idli',
      category: 'breakfast',
      isDefault: true,
      ingredients: [
        { name: 'Idli Rice', quantity: 2, unit: 'cups', category: 'grains' },
        { name: 'Urad Dal', quantity: 1, unit: 'cup', category: 'grains' },
        { name: 'Salt', quantity: 1, unit: 'units', category: 'other' },
        { name: 'Fenugreek Seeds', quantity: 1, unit: 'units', category: 'other' },
      ]
    },
    {
      name: 'Dosa',
      category: 'breakfast',
      isDefault: true,
      ingredients: [
        { name: 'Idli Rice', quantity: 3, unit: 'cups', category: 'grains' },
        { name: 'Urad Dal', quantity: 1, unit: 'cup', category: 'grains' },
        { name: 'Salt', quantity: 1, unit: 'units', category: 'other' },
        { name: 'Oil', quantity: 2, unit: 'units', category: 'other' },
        { name: 'Fenugreek Seeds', quantity: 1, unit: 'units', category: 'other' },
      ]
    },
    {
      name: 'Puri',
      category: 'breakfast',
      isDefault: true,
      ingredients: [
        { name: 'Wheat Flour', quantity: 2, unit: 'cups', category: 'grains' },
        { name: 'Salt', quantity: 1, unit: 'units', category: 'other' },
        { name: 'Oil', quantity: 2, unit: 'units', category: 'other' },
        { name: 'Water', quantity: 1, unit: 'cup', category: 'other' },
      ]
    },
    {
      name: 'Pongal',
      category: 'breakfast',
      isDefault: true,
      ingredients: [
        { name: 'Rice', quantity: 1, unit: 'cup', category: 'grains' },
        { name: 'Moong Dal', quantity: 0.5, unit: 'cup', category: 'grains' },
        { name: 'Pepper', quantity: 1, unit: 'units', category: 'other' },
        { name: 'Cumin Seeds', quantity: 1, unit: 'units', category: 'other' },
        { name: 'Ginger', quantity: 1, unit: 'units', category: 'vegetables' },
        { name: 'Curry Leaves', quantity: 1, unit: 'units', category: 'vegetables' },
        { name: 'Ghee', quantity: 2, unit: 'units', category: 'dairy' },
        { name: 'Cashews', quantity: 1, unit: 'units', category: 'snacks' },
      ]
    },
    {
      name: 'Chapathi',
      category: 'bread',
      isDefault: true,
      ingredients: [
        { name: 'Wheat Flour', quantity: 2, unit: 'cups', category: 'grains' },
        { name: 'Salt', quantity: 1, unit: 'units', category: 'other' },
        { name: 'Oil', quantity: 1, unit: 'units', category: 'other' },
        { name: 'Water', quantity: 1, unit: 'cup', category: 'other' },
      ]
    },
    {
      name: 'Bread Omelette',
      category: 'breakfast',
      isDefault: true,
      ingredients: [
        { name: 'Bread', quantity: 4, unit: 'slices', category: 'grains' },
        { name: 'Eggs', quantity: 2, unit: 'units', category: 'other' },
        { name: 'Onion', quantity: 1, unit: 'units', category: 'vegetables' },
        { name: 'Green Chilli', quantity: 1, unit: 'units', category: 'vegetables' },
        { name: 'Salt', quantity: 1, unit: 'units', category: 'other' },
        { name: 'Oil', quantity: 1, unit: 'units', category: 'other' },
        { name: 'Pepper', quantity: 1, unit: 'units', category: 'other' },
      ]
    }
  ];
  
  const getAllRecipes = (customRecipes = []) => {
    return [...defaultRecipes, ...customRecipes];
  };
  
  const getRecipeByName = (name, customRecipes = []) => {
    const allRecipes = getAllRecipes(customRecipes);
    return allRecipes.find(r =>
      r.name.toLowerCase().includes(name.toLowerCase())
    );
  };
  
  const getRecipesByCategory = (category, customRecipes = []) => {
    const allRecipes = getAllRecipes(customRecipes);
    return allRecipes.filter(r =>
      r.category.toLowerCase().includes(category.toLowerCase())
    );
  };
  
  module.exports = {
    getAllRecipes,
    getRecipeByName,
    getRecipesByCategory,
    defaultRecipes
  };