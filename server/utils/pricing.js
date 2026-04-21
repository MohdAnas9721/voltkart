const Settings = require('../models/Settings');

const getSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  return settings;
};

const toNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const getItemDeliveryCharge = (item, settings, subtotal, distanceKm) => {
  const type = item.deliveryChargeType || 'conditional';
  const fixedCharge = toNumber(item.fixedDeliveryCharge ?? item.shippingCharge, settings.shippingCharge);
  const freeThreshold = toNumber(item.freeDeliveryMinOrderAmount, settings.freeShippingThreshold);

  if (type === 'free') return 0;
  if (type === 'distance_based') {
    return distanceKm > 0 ? Math.round(distanceKm * settings.perKilometerCharge) : fixedCharge;
  }
  if (type === 'conditional') {
    return subtotal >= freeThreshold ? 0 : fixedCharge;
  }
  return fixedCharge;
};

const isCodAllowedForItems = (items, settings) =>
  Boolean(settings.codEnabled) && items.every((item) => item.codAvailable !== false);

const calculateOrderTotals = async (items, coupon, options = {}) => {
  const settings = await getSettings();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const distanceKm = Math.max(
    0,
    toNumber(options.approxDistanceKm ?? options.shippingAddress?.approxDistanceKm, 0)
  );
  const itemShippingCharges = items.map((item) => getItemDeliveryCharge(item, settings, subtotal, distanceKm));
  const productShipping = itemShippingCharges.length ? Math.max(...itemShippingCharges) : 0;
  let discountAmount = 0;

  if (coupon && coupon.isActive) {
    discountAmount =
      coupon.discountType === 'percentage'
        ? Math.round((subtotal * coupon.value) / 100)
        : coupon.value;
    discountAmount = Math.min(discountAmount, coupon.maxDiscount || discountAmount, subtotal);
  }

  const taxableAmount = Math.max(subtotal - discountAmount, 0);
  const rawShippingCharge = productShipping;
  const shippingCharge = rawShippingCharge;
  const codAllowed = isCodAllowedForItems(items, settings);
  const codCharge = options.paymentMethod === 'cod' && codAllowed ? settings.codCharge || 0 : 0;
  const freeDeliveryDiscount = rawShippingCharge > shippingCharge ? rawShippingCharge - shippingCharge : 0;
  const taxAmount = Math.round((taxableAmount * settings.taxPercentage) / 100);
  const totalAmount = taxableAmount + shippingCharge + taxAmount + codCharge;

  return {
    subtotal,
    shippingCharge,
    discountAmount,
    taxAmount,
    codCharge,
    freeDeliveryDiscount,
    totalAmount,
    codAllowed,
    deliveryDistanceKm: distanceKm,
    minimumOrderAmount: settings.minimumOrderAmount,
    settings
  };
};

module.exports = { calculateOrderTotals, getSettings, isCodAllowedForItems };
