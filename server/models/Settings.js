const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: 'VoltKart Electricals' },
    supportEmail: { type: String, default: 'support@voltkart.example' },
    supportPhone: { type: String, default: '+91 98765 43210' },
    shippingCharge: { type: Number, default: 99 },
    freeShippingThreshold: { type: Number, default: 2500 },
    minimumOrderAmount: { type: Number, default: 0 },
    perKilometerCharge: { type: Number, default: 12 },
    maxServiceDistanceKm: { type: Number, default: 40 },
    codCharge: { type: Number, default: 0 },
    defaultDispatchDays: { type: Number, default: 1 },
    defaultEtaMinDays: { type: Number, default: 3 },
    defaultEtaMaxDays: { type: Number, default: 5 },
    codEnabled: { type: Boolean, default: true },
    taxPercentage: { type: Number, default: 18 },
    deliveryRewardActive: { type: Boolean, default: true },
    deliveryRewardThreshold: { type: Number, default: 20 },
    deliveryRewardType: { type: String, enum: ['coupon', 'bonus_text'], default: 'coupon' },
    deliveryRewardCouponValue: { type: Number, default: 250 },
    deliveryRewardBonusText: { type: String, default: 'Daily delivery performance bonus earned.' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
