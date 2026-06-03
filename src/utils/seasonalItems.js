const seasonalItems = {
    summer: {
      months: [3, 4, 5], // April, May, June
      items: [
        { name: 'Watermelon', category: 'fruits' },
        { name: 'Mango', category: 'fruits' },
        { name: 'Cucumber', category: 'vegetables' },
        { name: 'Coconut Water', category: 'dairy' },
        { name: 'Lemon', category: 'fruits' },
        { name: 'Mint', category: 'vegetables' },
        { name: 'Buttermilk', category: 'dairy' },
        { name: 'Ice Cream', category: 'snacks' },
      ]
    },
    monsoon: {
      months: [6, 7, 8], // July, August, September
      items: [
        { name: 'Ginger', category: 'vegetables' },
        { name: 'Turmeric', category: 'other' },
        { name: 'Hot Chocolate', category: 'snacks' },
        { name: 'Corn', category: 'vegetables' },
        { name: 'Umbrella Snacks', category: 'snacks' },
        { name: 'Green Tea', category: 'other' },
        { name: 'Honey', category: 'other' },
        { name: 'Garlic', category: 'vegetables' },
      ]
    },
    autumn: {
      months: [9, 10, 11], // October, November, December
      items: [
        { name: 'Pumpkin', category: 'vegetables' },
        { name: 'Sweet Potato', category: 'vegetables' },
        { name: 'Apple', category: 'fruits' },
        { name: 'Pomegranate', category: 'fruits' },
        { name: 'Nuts and Dry Fruits', category: 'snacks' },
        { name: 'Dates', category: 'fruits' },
        { name: 'Cinnamon', category: 'other' },
        { name: 'Cardamom', category: 'other' },
      ]
    },
    winter: {
      months: [0, 1, 2], // January, February, March
      items: [
        { name: 'Carrot', category: 'vegetables' },
        { name: 'Spinach', category: 'vegetables' },
        { name: 'Cauliflower', category: 'vegetables' },
        { name: 'Orange', category: 'fruits' },
        { name: 'Strawberry', category: 'fruits' },
        { name: 'Groundnuts', category: 'snacks' },
        { name: 'Jaggery', category: 'other' },
        { name: 'Sesame Seeds', category: 'other' },
      ]
    },
    festivals: {
      diwali: {
        months: [9, 10], // October, November
        items: [
          { name: 'Dry Fruits', category: 'snacks' },
          { name: 'Sweets', category: 'snacks' },
          { name: 'Oil', category: 'other' },
          { name: 'Sugar', category: 'other' },
        ]
      },
      pongal: {
        months: [0], // January
        items: [
          { name: 'Rice', category: 'grains' },
          { name: 'Jaggery', category: 'other' },
          { name: 'Milk', category: 'dairy' },
          { name: 'Sugarcane', category: 'other' },
          { name: 'Turmeric', category: 'other' },
        ]
      }
    }
  };
  
  const getCurrentSeason = () => {
    const month = new Date().getMonth();
  
    for (const [season, data] of Object.entries(seasonalItems)) {
      if (season === 'festivals') continue;
      if (data.months.includes(month)) return season;
    }
  
    return 'summer';
  };
  
  const getSeasonalSuggestions = () => {
    const season = getCurrentSeason();
    const month = new Date().getMonth();
    const suggestions = [...seasonalItems[season].items];
  
    // Add festival items if applicable
    for (const [festival, data] of Object.entries(seasonalItems.festivals)) {
      if (data.months.includes(month)) {
        suggestions.push(...data.items);
      }
    }
  
    return {
      season,
      suggestions
    };
  };
  
  module.exports = { getSeasonalSuggestions, getCurrentSeason };