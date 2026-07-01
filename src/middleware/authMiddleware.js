const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      const error = new Error('Unauthorized: token missing');
      error.statusCode = 401;
      return next(error);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      const error = new Error('Unauthorized: token missing');
      error.statusCode = 401;
      return next(error);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      const error = new Error('Unauthorized: invalid token');
      error.statusCode = 401;
      return next(error);
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = protect;
