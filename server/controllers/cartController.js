const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { calculateOrderTotals } = require('../utils/pricing');

const populateCart = (query) =>
  query.populate({
    path: 'items.product',
    populate: [
      { path: 'brand', select: 'name slug logo' },
      { path: 'category', select: 'name slug' }
    ]
  });

const buildCartResponse = async (cart, options = {}) => {
  const items = cart.items
    .filter((item) => item.product)
    .map((item) => ({
      _id: item._id,
      product: item.product,
      quantity: item.quantity,
      price: item.product.price,
      shippingCharge: item.product.shippingCharge,
      codAvailable: item.product.codAvailable,
      deliveryChargeType: item.product.deliveryChargeType,
      fixedDeliveryCharge: item.product.fixedDeliveryCharge,
      freeDeliveryMinOrderAmount: item.product.freeDeliveryMinOrderAmount
    }));
  const totals = await calculateOrderTotals(
    items.map((item) => ({
      price: item.price,
      quantity: item.quantity,
      shippingCharge: item.shippingCharge,
      codAvailable: item.codAvailable,
      deliveryChargeType: item.deliveryChargeType,
      fixedDeliveryCharge: item.fixedDeliveryCharge,
      freeDeliveryMinOrderAmount: item.freeDeliveryMinOrderAmount
    })),
    options
  );
  return { _id: cart._id, user: cart.user, items, totals };
};

exports.getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  cart = await populateCart(Cart.findById(cart._id));
  res.json(await buildCartResponse(cart, req.query));
});

exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    res.status(404);
    throw new Error('Product not found');
  }
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $setOnInsert: { user: req.user._id } },
    { upsert: true, new: true }
  );
  const existing = cart.items.find((item) => item.product.toString() === productId);
  if (existing) existing.quantity = Math.min(existing.quantity + Number(quantity), product.stock);
  else cart.items.push({ product: productId, quantity: Math.min(Number(quantity), product.stock || 1) });
  await cart.save();
  res.status(201).json(await buildCartResponse(await populateCart(Cart.findById(cart._id))));
});

exports.updateCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  const item = cart?.items.id(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Cart item not found');
  }
  item.quantity = Math.max(Number(req.body.quantity), 1);
  await cart.save();
  res.json(await buildCartResponse(await populateCart(Cart.findById(cart._id))));
});

exports.removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.json({ items: [], totals: await calculateOrderTotals([]) });
  cart.items = cart.items.filter((item) => item._id.toString() !== req.params.id);
  await cart.save();
  res.json(await buildCartResponse(await populateCart(Cart.findById(cart._id))));
});
