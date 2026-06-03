const { getSeasonalSuggestions } = require('../utils/seasonalItems');

exports.getSeasonalSuggestions = async (req, res) => {
  try {
    const suggestions = getSeasonalSuggestions();
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};