const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    slug: String,
    image: String,
    sku: String,
    price: Number,
    quantity: Number,
    shippingCharge: Number,
    dispatchTime: { type: Number, default: 1 },
    estimatedDispatchDays: { type: Number, default: 1 },
    estimatedDeliveryDaysMin: { type: Number, default: 3 },
    estimatedDeliveryDaysMax: { type: Number, default: 5 },
    warrantyAvailable: Boolean,
    warrantyText: String,
    returnAvailable: Boolean,
    returnWindowDays: Number,
    returnPolicyText: String,
    openBoxDeliveryAvailable: Boolean,
    openBoxDeliveryText: String,
    codAvailable: Boolean,
    deliveryChargeType: String,
    fixedDeliveryCharge: Number,
    freeDeliveryMinOrderAmount: Number
  },
  { _id: false }
);

const trackingEventSchema = new mongoose.Schema(
  {
    status: String,
    message: String,
    locationText: String,
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { _id: true }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: String,
      phone: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: { type: String, default: 'India' },
      approxDistanceKm: { type: Number, default: 0 }
    },
    paymentMethod: { type: String, enum: ['cod', 'online'], default: 'cod' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    orderStatus: {
      type: String,
      enum: ['placed', 'packed', 'shipped', 'out-for-delivery', 'delivered', 'cancelled'],
      default: 'placed'
    },
    subtotal: Number,
    shippingCharge: Number,
    discountAmount: Number,
    taxAmount: Number,
    codCharge: { type: Number, default: 0 },
    freeDeliveryDiscount: { type: Number, default: 0 },
    totalAmount: Number,
    couponCode: String,
    trackingId: { type: String, index: true },
    assignedDeliveryBoy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    deliveryStatus: {
      type: String,
      enum: [
        'placed',
        'packed',
        'assigned',
        'picked',
        'shipped',
        'out-for-delivery',
        'nearby-hub',
        'delivered',
        'delivery-failed',
        'return-requested',
        'return-picked',
        'refunded',
        'cancelled'
      ],
      default: 'placed'
    },
    trackingEvents: [trackingEventSchema],
    currentLocationText: { type: String, default: 'Order placed' },
    deliveryNote: { type: String, default: '' },
    outForDeliveryAt: Date,
    deliveredAt: Date,
    returnStatus: {
      type: String,
      enum: ['none', 'requested', 'approved', 'rejected', 'picked', 'refunded'],
      default: 'none'
    },
    returnRequestedAt: Date,
    refundStatus: { type: String, enum: ['none', 'pending', 'refunded'], default: 'none' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
