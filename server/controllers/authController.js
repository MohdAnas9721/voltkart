const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  isActive: user.isActive,
  avatar: user.avatar,
  addresses: user.addresses,
  createdAt: user.createdAt
});

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error('Email already registered');
  }

  const user = await User.create({ name, email, password, phone });
  res.status(201).json({ user: sanitizeUser(user), token: generateToken(user._id) });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  res.json({ user: sanitizeUser(user), token: generateToken(user._id) });
});

exports.me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.name = req.body.name ?? user.name;
  user.phone = req.body.phone ?? user.phone;
  user.avatar = req.body.avatar ?? user.avatar;
  if (Array.isArray(req.body.addresses)) user.addresses = req.body.addresses;
  await user.save();
  res.json({ user: sanitizeUser(user) });
});
