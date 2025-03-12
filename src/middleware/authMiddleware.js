// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware to check if the user is authenticated
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id, token });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

// Middleware to check if the user has the required role
const authorize = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Access denied.' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };