const jwt = require('jsonwebtoken');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'dev_electric_market_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });

module.exports = generateToken;
