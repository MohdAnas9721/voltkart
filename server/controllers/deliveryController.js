const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Order = require('../models/Order');
const DeliveryReward = require('../models/DeliveryReward');
const { refreshDeliveryReward, getDateKey, getDayRange } = require('../utils/deliveryRewards');

const sanitizeDeliveryBoy = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt
});

exports.listDeliveryBoys = asyncHandler(async (req, res) => {
  const deliveryBoys = await User.find({ role: 'delivery' }).select('-password').sort({ createdAt: -1 });
  const rows = await Promise.all(
    deliveryBoys.map(async (boy) => {
      const reward = await refreshDeliveryReward(boy._id);
      const [assignedOrders, completedOrders] = await Promise.all([
        Order.countDocuments({ assignedDeliveryBoy: boy._id, deliveryStatus: { $nin: ['delivered', 'cancelled'] } }),
        Order.countDocuments({ assignedDeliveryBoy: boy._id, deliveryStatus: 'delivered' })
      ]);
      return {
        ...sanitizeDeliveryBoy(boy),
        assignedOrders,
        completedOrders,
        completedDeliveriesToday: reward?.completedDeliveries || 0,
        rewardIssuedToday: Boolean(reward?.rewardIssued),
        rewardCouponCode: reward?.rewardCouponCode || ''
      };
    })
  );
  res.json(rows);
});

exports.createDeliveryBoy = asyncHandler(async (req, res) => {
  const exists = await User.findOne({ email: req.body.email });
  if (exists) {
    res.status(409);
    throw new Error('Email already registered');
  }
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password || 'Delivery123',
    role: 'delivery',
    isActive: req.body.isActive ?? true
  });
  res.status(201).json(sanitizeDeliveryBoy(user));
});

exports.updateDeliveryBoy = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, role: 'delivery' });
  if (!user) {
    res.status(404);
    throw new Error('Delivery boy not found');
  }
  user.name = req.body.name ?? user.name;
  user.phone = req.body.phone ?? user.phone;
  user.email = req.body.email ?? user.email;
  user.isActive = req.body.isActive ?? user.isActive;
  if (req.body.password) user.password = req.body.password;
  await user.save();
  res.json(sanitizeDeliveryBoy(user));
});

exports.listRewards = asyncHandler(async (req, res) => {
  res.json(await DeliveryReward.find().populate('deliveryBoy', 'name email phone').sort({ createdAt: -1 }).limit(100));
});

exports.deliveryDashboard = asyncHandler(async (req, res) => {
  const dateKey = getDateKey();
  const { start, end } = getDayRange();
  const [assignedOrders, completedToday, reward] = await Promise.all([
    Order.find({
      assignedDeliveryBoy: req.user._id,
      deliveryStatus: { $nin: ['delivered', 'cancelled', 'refunded'] }
    })
      .populate('user', 'name email phone')
      .sort({ updatedAt: -1 }),
    Order.countDocuments({
      assignedDeliveryBoy: req.user._id,
      deliveryStatus: 'delivered',
      deliveredAt: { $gte: start, $lt: end }
    }),
    refreshDeliveryReward(req.user._id)
  ]);

  res.json({
    dateKey,
    assignedOrders,
    completedDeliveriesToday: completedToday,
    reward
  });
});
