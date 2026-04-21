const mongoose = require('mongoose');
const makeSlug = require('../utils/slug');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, default: '' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    sku: { type: String, required: true, unique: true },
    images: [{ type: String }],
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    specifications: { type: mongoose.Schema.Types.Mixed, default: {} },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    tags: [{ type: String, index: true }],
    shippingCharge: { type: Number, default: 0 },
    dispatchTime: { type: Number, default: 1, min: 1 },
    estimatedDispatchDays: { type: Number, default: 1, min: 1 },
    estimatedDeliveryDaysMin: { type: Number, default: 3, min: 1 },
    estimatedDeliveryDaysMax: { type: Number, default: 5, min: 1 },
    warrantyAvailable: { type: Boolean, default: true },
    warrantyText: { type: String, default: '2 Years Manufacturer Warranty' },
    returnAvailable: { type: Boolean, default: true },
    returnWindowDays: { type: Number, default: 7, min: 0 },
    returnPolicyText: { type: String, default: '7-Day Return Available for unused products in original packaging.' },
    openBoxDeliveryAvailable: { type: Boolean, default: false },
    openBoxDeliveryText: { type: String, default: 'Open box inspection can be enabled for eligible orders.' },
    codAvailable: { type: Boolean, default: true },
    deliveryChargeType: {
      type: String,
      enum: ['free', 'fixed', 'distance_based', 'conditional'],
      default: 'conditional'
    },
    fixedDeliveryCharge: { type: Number, default: 99, min: 0 },
    freeDeliveryMinOrderAmount: { type: Number, default: 2500, min: 0 },
    weight: { type: Number, default: 0 },
    popularity: { type: Number, default: 0 }
  },
  { timestamps: true }
);

productSchema.pre('save', function setSlugAndDiscount(next) {
  if (!this.slug || this.isModified('name')) this.slug = makeSlug(this.name);
  if (this.isModified('dispatchTime') && !this.isModified('estimatedDispatchDays')) {
    this.estimatedDispatchDays = this.dispatchTime;
  } else if (this.estimatedDispatchDays && this.estimatedDispatchDays !== this.dispatchTime) {
    this.dispatchTime = this.estimatedDispatchDays;
  }
  if (this.originalPrice && this.price) {
    this.discountPercent = Math.max(
      0,
      Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100)
    );
  }
  if (this.estimatedDeliveryDaysMax < this.estimatedDeliveryDaysMin) {
    this.estimatedDeliveryDaysMax = this.estimatedDeliveryDaysMin;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
