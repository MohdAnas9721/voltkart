const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

exports.dashboardStats = asyncHandler(async (req, res) => {
  const [totalProducts, totalOrders, totalUsers, deliveryBoys, lowStockProducts, pendingDeliveries, sales] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    User.countDocuments({ role: 'delivery' }),
    Product.countDocuments({ stock: { $lte: 10 } }),
    Order.countDocuments({ deliveryStatus: { $in: ['assigned', 'picked', 'out-for-delivery', 'nearby-hub'] } }),
    Order.aggregate([{ $match: { orderStatus: { $ne: 'cancelled' } } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }])
  ]);
  res.json({
    totalProducts,
    totalOrders,
    totalUsers,
    deliveryBoys,
    lowStockProducts,
    pendingDeliveries,
    totalSales: sales[0]?.total || 0
  });
});

exports.getUsers = asyncHandler(async (req, res) => {
  const search = req.query.search || '';
  const query = search
    ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
    : {};
  res.json(await User.find(query).select('-password').sort({ createdAt: -1 }));
});

exports.updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  user.role = req.body.role ?? user.role;
  user.name = req.body.name ?? user.name;
  user.phone = req.body.phone ?? user.phone;
  user.isActive = req.body.isActive ?? user.isActive;
  await user.save();
  res.json(user);
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  await user.deleteOne();
  res.json({ message: 'User deleted' });
});
