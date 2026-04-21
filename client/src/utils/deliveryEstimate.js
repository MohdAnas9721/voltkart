const DEFAULT_DISPATCH_DAYS = 1;
const DEFAULT_DELIVERY_MIN_DAYS = 3;
const DEFAULT_DELIVERY_MAX_DAYS = 5;

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short'
});

const weekdayFormatter = new Intl.DateTimeFormat('en-IN', {
  weekday: 'long'
});

const toPositiveNumber = (value, fallback) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
};

export const addBusinessDays = (startDate, days) => {
  const date = new Date(startDate);
  let added = 0;

  while (added < days) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) added += 1;
  }

  return date;
};

const getSourceEstimate = (source = {}) => ({
  dispatchDays: toPositiveNumber(
    source.estimatedDispatchDays ?? source.dispatchTime ?? source.dispatchDays,
    DEFAULT_DISPATCH_DAYS
  ),
  minDays: toPositiveNumber(source.estimatedDeliveryDaysMin, DEFAULT_DELIVERY_MIN_DAYS),
  maxDays: toPositiveNumber(source.estimatedDeliveryDaysMax, DEFAULT_DELIVERY_MAX_DAYS)
});

const formatDayRange = (minDays, maxDays) =>
  minDays === maxDays ? `${maxDays} business days` : `${minDays}-${maxDays} business days`;

export const getDeliveryEstimate = ({ product, items = [], order, fromDate } = {}) => {
  const sources = items.length
    ? items.map((item) => item.product || item).filter(Boolean)
    : [product || order].filter(Boolean);

  const merged = sources.reduce(
    (estimate, source) => {
      const sourceEstimate = getSourceEstimate(source);
      return {
        dispatchDays: Math.max(estimate.dispatchDays, sourceEstimate.dispatchDays),
        minDays: Math.max(estimate.minDays, sourceEstimate.minDays),
        maxDays: Math.max(estimate.maxDays, sourceEstimate.maxDays)
      };
    },
    {
      dispatchDays: DEFAULT_DISPATCH_DAYS,
      minDays: DEFAULT_DELIVERY_MIN_DAYS,
      maxDays: DEFAULT_DELIVERY_MAX_DAYS
    }
  );

  const startDate = fromDate || order?.createdAt || new Date();
  const deliveryDate = addBusinessDays(startDate, merged.maxDays);
  const dispatchText =
    merged.dispatchDays <= 1
      ? 'Dispatch within 24 hours'
      : `Dispatch within ${merged.dispatchDays} business days`;
  const daysText = `Estimated delivery in ${formatDayRange(merged.minDays, merged.maxDays)}`;

  return {
    ...merged,
    deliveryDate,
    deliveryByText: `Delivery by ${dateFormatter.format(deliveryDate)}, ${weekdayFormatter.format(deliveryDate)}`,
    daysText,
    dispatchText
  };
};

export const getPolicySummary = (product = {}) => ({
  warranty: product.warrantyAvailable
    ? product.warrantyText || 'Warranty available'
    : 'Warranty not available',
  return: product.returnAvailable
    ? `${product.returnWindowDays || 7}-Day Return Available`
    : 'Return not available',
  openBox: product.openBoxDeliveryAvailable
    ? product.openBoxDeliveryText || 'Open Box Delivery available'
    : 'Open Box Delivery not available',
  cod: product.codAvailable === false ? 'COD not available' : 'COD available',
  deliveryCharge:
    product.deliveryChargeType === 'free'
      ? 'Free delivery'
      : product.deliveryChargeType === 'distance_based'
        ? 'Distance-based delivery charge'
        : product.deliveryChargeType === 'conditional'
          ? `Free delivery above ₹${product.freeDeliveryMinOrderAmount || 0}`
          : `Delivery charge ₹${product.fixedDeliveryCharge ?? product.shippingCharge ?? 0}`
});
