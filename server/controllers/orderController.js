const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const User = require('../models/User');
const { calculateOrderTotals } = require('../utils/pricing');
const { refreshDeliveryReward } = require('../utils/deliveryRewards');

const trackingId = () => `VK${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 90 + 10)}`;

const statusToOrderStatus = {
  placed: 'placed',
  packed: 'packed',
  assigned: 'packed',
  picked: 'shipped',
  shipped: 'shipped',
  'out-for-delivery': 'out-for-delivery',
  'nearby-hub': 'shipped',
  delivered: 'delivered',
  'delivery-failed': 'shipped',
  'return-requested': 'delivered',
  'return-picked': 'delivered',
  refunded: 'delivered',
  cancelled: 'cancelled'
};

const pushTrackingEvent = (order, { status, message, locationText, updatedBy }) => {
  const nextStatus = status || order.deliveryStatus || order.orderStatus;
  order.deliveryStatus = nextStatus;
  order.orderStatus = statusToOrderStatus[nextStatus] || order.orderStatus;
  order.currentLocationText = locationText || order.currentLocationText;
  order.trackingEvents.push({
    status: nextStatus,
    message: message || `Order status updated to ${nextStatus}`,
    locationText: locationText || order.currentLocationText,
    updatedBy
  });
  if (nextStatus === 'out-for-delivery') order.outForDeliveryAt = new Date();
  if (nextStatus === 'delivered') order.deliveredAt = new Date();
};

exports.createOrder = asyncHandler(async (req, res) => {
  const { items: bodyItems, shippingAddress, paymentMethod = 'cod', couponCode } = req.body;
  let sourceItems = bodyItems;

  if (!sourceItems || sourceItems.length === 0) {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    sourceItems = cart?.items.map((item) => ({ productId: item.product._id, quantity: item.quantity })) || [];
  }

  if (sourceItems.length === 0) {
    res.status(400);
    throw new Error('Order requires at least one product');
  }

  const productIds = sourceItems.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds }, isActive: true });
  const orderItems = sourceItems.map((item) => {
    const product = products.find((candidate) => candidate._id.toString() === String(item.productId));
    if (!product) throw new Error('One or more products are unavailable');
    if (product.stock < item.quantity) throw new Error(`${product.name} has limited stock`);
    return {
      product: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images?.[0],
      sku: product.sku,
      price: product.price,
      quantity: Number(item.quantity),
      shippingCharge: product.shippingCharge,
      dispatchTime: product.dispatchTime,
      estimatedDispatchDays: product.estimatedDispatchDays,
      estimatedDeliveryDaysMin: product.estimatedDeliveryDaysMin,
      estimatedDeliveryDaysMax: product.estimatedDeliveryDaysMax,
      warrantyAvailable: product.warrantyAvailable,
      warrantyText: product.warrantyText,
      returnAvailable: product.returnAvailable,
      returnWindowDays: product.returnWindowDays,
      returnPolicyText: product.returnPolicyText,
      openBoxDeliveryAvailable: product.openBoxDeliveryAvailable,
      openBoxDeliveryText: product.openBoxDeliveryText,
      codAvailable: product.codAvailable,
      deliveryChargeType: product.deliveryChargeType,
      fixedDeliveryCharge: product.fixedDeliveryCharge,
      freeDeliveryMinOrderAmount: product.freeDeliveryMinOrderAmount
    };
  });

  const coupon = couponCode ? await Coupon.findOne({ code: couponCode.toUpperCase() }) : null;
  if (coupon && coupon.minOrderAmount > orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)) {
    res.status(400);
    throw new Error('Coupon minimum order amount not met');
  }

  const totals = await calculateOrderTotals(orderItems, coupon, { shippingAddress, paymentMethod });
  if (totals.minimumOrderAmount > 0 && totals.subtotal < totals.minimumOrderAmount) {
    res.status(400);
    throw new Error(`Minimum order amount is ${totals.minimumOrderAmount}`);
  }
  if (totals.settings.maxServiceDistanceKm > 0 && totals.deliveryDistanceKm > totals.settings.maxServiceDistanceKm) {
    res.status(400);
    throw new Error(`Delivery is available within ${totals.settings.maxServiceDistanceKm} km`);
  }
  if (paymentMethod === 'cod' && !totals.codAllowed) {
    res.status(400);
    throw new Error('Cash on Delivery is not available for this order');
  }

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    paymentStatus: paymentMethod === 'online' ? 'paid' : 'pending',
    couponCode: coupon?.code,
    trackingId: trackingId(),
    deliveryStatus: 'placed',
    currentLocationText: 'Order placed',
    trackingEvents: [
      {
        status: 'placed',
        message: 'Order placed successfully',
        locationText: shippingAddress?.city ? `Order received for ${shippingAddress.city}` : 'Order received',
        updatedBy: req.user._id
      }
    ],
    ...totals
  });

  await Promise.all(
    orderItems.map((item) =>
      Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity, popularity: item.quantity } })
    )
  );
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.status(201).json(order);
});

exports.myOrders = asyncHandler(async (req, res) => {
  res.json(await Order.find({ user: req.user._id }).populate('assignedDeliveryBoy', 'name phone').sort({ createdAt: -1 }));
});

exports.getOrder = asyncHandler(async (req, res) => {
  const query = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, user: req.user._id };
  const order = await Order.findOne(query)
    .populate('user', 'name email phone')
    .populate('assignedDeliveryBoy', 'name phone email');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  res.json(order);
});

exports.adminOrders = asyncHandler(async (req, res) => {
  const { search = '' } = req.query;
  const query = search ? { trackingId: { $regex: search, $options: 'i' } } : {};
  res.json(
    await Order.find(query)
      .populate('user', 'name email phone')
      .populate('assignedDeliveryBoy', 'name phone email')
      .sort({ createdAt: -1 })
  );
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  order.orderStatus = req.body.orderStatus ?? order.orderStatus;
  order.paymentStatus = req.body.paymentStatus ?? order.paymentStatus;
  if (req.body.orderStatus && req.body.orderStatus !== order.deliveryStatus) {
    pushTrackingEvent(order, {
      status: req.body.orderStatus,
      message: req.body.message || `Admin updated order to ${req.body.orderStatus}`,
      locationText: req.body.currentLocationText,
      updatedBy: req.user?._id
    });
  }
  await order.save();
  res.json(order);
});

exports.assignDeliveryBoy = asyncHandler(async (req, res) => {
  const { deliveryBoyId, message, currentLocationText } = req.body;
  const [order, deliveryBoy] = await Promise.all([
    Order.findById(req.params.id),
    User.findOne({ _id: deliveryBoyId, role: 'delivery', isActive: { $ne: false } })
  ]);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (!deliveryBoy) {
    res.status(404);
    throw new Error('Active delivery boy not found');
  }

  order.assignedDeliveryBoy = deliveryBoy._id;
  pushTrackingEvent(order, {
    status: 'assigned',
    message: message || `Assigned to ${deliveryBoy.name}`,
    locationText: currentLocationText || order.currentLocationText || 'Assigned from warehouse',
    updatedBy: req.user._id
  });
  await order.save();
  res.json(await order.populate('assignedDeliveryBoy', 'name phone email'));
});

exports.updateTracking = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const isAssignedDeliveryBoy =
    req.user.role === 'delivery' && String(order.assignedDeliveryBoy) === String(req.user._id);
  if (req.user.role !== 'admin' && !isAssignedDeliveryBoy) {
    res.status(403);
    throw new Error('This order is not assigned to you');
  }

  const { status, message, currentLocationText, deliveryNote, paymentStatus } = req.body;
  if (paymentStatus && req.user.role === 'admin') order.paymentStatus = paymentStatus;
  if (deliveryNote !== undefined) order.deliveryNote = deliveryNote;
  pushTrackingEvent(order, {
    status,
    message,
    locationText: currentLocationText,
    updatedBy: req.user._id
  });
  await order.save();

  let reward = null;
  if (status === 'delivered' && order.assignedDeliveryBoy) {
    reward = await refreshDeliveryReward(order.assignedDeliveryBoy);
  }

  res.json({
    order: await order.populate('assignedDeliveryBoy', 'name phone email'),
    reward
  });
});

exports.requestReturn = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (order.deliveryStatus !== 'delivered') {
    res.status(400);
    throw new Error('Return can be requested after delivery');
  }
  const deliveredAt = order.deliveredAt || order.updatedAt;
  const returnableItems = order.items.filter((item) => {
    if (!item.returnAvailable) return false;
    const deadline = new Date(deliveredAt);
    deadline.setDate(deadline.getDate() + (item.returnWindowDays || 0));
    return new Date() <= deadline;
  });

  if (!returnableItems.length) {
    res.status(400);
    throw new Error('Return window is closed or items are not returnable');
  }

  order.returnStatus = 'requested';
  order.returnRequestedAt = new Date();
  pushTrackingEvent(order, {
    status: 'return-requested',
    message: req.body.reason || 'Customer requested a return',
    locationText: order.shippingAddress?.city || order.currentLocationText,
    updatedBy: req.user._id
  });
  await order.save();
  res.json(order);
});
