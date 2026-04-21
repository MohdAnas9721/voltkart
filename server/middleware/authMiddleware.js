const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Not authorized, token missing');
  }

  const token = header.split(' ')[1];
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_electric_market_secret');
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token invalid');
  }

  const userId = decoded.id || decoded._id || decoded.userId;
  if (!userId) {
    res.status(401);
    throw new Error('Not authorized, token payload invalid');
  }

  req.user = await User.findById(userId).select('-password');
  if (!req.user) {
    res.status(401);
    throw new Error('User no longer exists');
  }
  if (req.user.isActive === false) {
    res.status(403);
    throw new Error('Account is inactive');
  }

  next();
});

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403);
  throw new Error('Admin access required');
};

const delivery = (req, res, next) => {
  if (req.user && (req.user.role === 'delivery' || req.user.role === 'admin')) return next();
  res.status(403);
  throw new Error('Delivery access required');
};

module.exports = { protect, admin, delivery };
