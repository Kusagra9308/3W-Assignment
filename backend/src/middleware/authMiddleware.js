const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'taskplanet_access_token_secret_key_3w_internship_2026');

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'User not found', code: 'USER_NOT_FOUND' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Access token expired', code: 'TOKEN_EXPIRED' });
      }
      return res.status(401).json({ message: 'Not authorized, invalid token', code: 'INVALID_TOKEN' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided', code: 'NO_TOKEN' });
  }
};

module.exports = { protect };
