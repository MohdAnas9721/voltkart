const mongoose = require('mongoose');

const deliveryRewardSchema = new mongoose.Schema(
  {
    deliveryBoy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dateKey: { type: String, required: true },
    completedDeliveries: { type: Number, default: 0 },
    threshold: { type: Number, default: 20 },
    rewardIssued: { type: Boolean, default: false },
    rewardType: { type: String, enum: ['coupon', 'bonus_text'], default: 'coupon' },
    rewardCouponCode: String,
    rewardValue: { type: Number, default: 0 },
    message: String
  },
  { timestamps: true }
);

deliveryRewardSchema.index({ deliveryBoy: 1, dateKey: 1 }, { unique: true });

module.exports = mongoose.model('DeliveryReward', deliveryRewardSchema);
