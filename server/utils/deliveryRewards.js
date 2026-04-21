const Order = require('../models/Order');
const DeliveryReward = require('../models/DeliveryReward');
const { getSettings } = require('./pricing');

const getDateKey = (date = new Date()) => date.toISOString().slice(0, 10);

const getDayRange = (date = new Date()) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
};

const buildRewardCode = (dateKey) =>
  `DEL${dateKey.replace(/-/g, '').slice(2)}${Math.floor(100 + Math.random() * 900)}`;

const refreshDeliveryReward = async (deliveryBoyId, date = new Date()) => {
  if (!deliveryBoyId) return null;

  const settings = await getSettings();
  const dateKey = getDateKey(date);
  const { start, end } = getDayRange(date);
  const completedDeliveries = await Order.countDocuments({
    assignedDeliveryBoy: deliveryBoyId,
    deliveryStatus: 'delivered',
    deliveredAt: { $gte: start, $lt: end }
  });

  let reward = await DeliveryReward.findOne({ deliveryBoy: deliveryBoyId, dateKey });
  if (!reward) {
    reward = await DeliveryReward.create({
      deliveryBoy: deliveryBoyId,
      dateKey,
      threshold: settings.deliveryRewardThreshold,
      rewardType: settings.deliveryRewardType,
      rewardValue: settings.deliveryRewardCouponValue,
      message: settings.deliveryRewardBonusText
    });
  }

  reward.completedDeliveries = completedDeliveries;
  reward.threshold = settings.deliveryRewardThreshold;
  reward.rewardType = settings.deliveryRewardType;
  reward.rewardValue = settings.deliveryRewardCouponValue;
  reward.message = settings.deliveryRewardBonusText;

  if (
    settings.deliveryRewardActive &&
    completedDeliveries >= settings.deliveryRewardThreshold &&
    !reward.rewardIssued
  ) {
    reward.rewardIssued = true;
    reward.rewardCouponCode =
      settings.deliveryRewardType === 'coupon' ? reward.rewardCouponCode || buildRewardCode(dateKey) : '';
    reward.message =
      settings.deliveryRewardType === 'coupon'
        ? `Reward coupon earned after ${completedDeliveries} deliveries.`
        : settings.deliveryRewardBonusText;
  }

  await reward.save();
  return reward;
};

module.exports = { refreshDeliveryReward, getDateKey, getDayRange };
