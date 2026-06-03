const guestCheck = async (req, res, next) => {
    try {
      // Check if guest account has expired
      if (req.user.isGuest && req.user.guestExpiresAt) {
        const now = new Date();
        if (now > req.user.guestExpiresAt) {
          return res.status(403).json({ 
            message: 'Guest access has expired. Please contact the household admin.' 
          });
        }
      }
  
      // Block guests from modifying data
      if (req.user.isGuest && req.method !== 'GET') {
        return res.status(403).json({ 
          message: 'Guests can only view data. Contact admin for full access.' 
        });
      }
  
      next();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  module.exports = guestCheck;