const asyncHandler = require('express-async-handler');
const Coupon = require('../models/Coupon');

exports.getCoupons = asyncHandler(async (req, res) => res.json(await Coupon.find().sort({ createdAt: -1 })));
exports.createCoupon = asyncHandler(async (req, res) => res.status(201).json(await Coupon.create(req.body)));
exports.updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }
  Object.assign(coupon, req.body);
  await coupon.save();
  res.json(coupon);
});
exports.deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }
  await coupon.deleteOne();
  res.json({ message: 'Coupon deleted' });
});
