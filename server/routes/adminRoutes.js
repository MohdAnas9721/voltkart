const express = require('express');
const { dashboardStats, deleteUser, getUsers, updateUser } = require('../controllers/adminController');
const {
  createDeliveryBoy,
  listDeliveryBoys,
  listRewards,
  updateDeliveryBoy
} = require('../controllers/deliveryController');
const { adminOrders, assignDeliveryBoy, updateOrderStatus, updateTracking } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, admin);
router.get('/dashboard', dashboardStats);
router.get('/orders', adminOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/orders/:id/assign', assignDeliveryBoy);
router.put('/orders/:id/tracking', updateTracking);
router.route('/delivery-boys').get(listDeliveryBoys).post(createDeliveryBoy);
router.route('/delivery-boys/:id').put(updateDeliveryBoy);
router.get('/delivery-rewards', listRewards);
router.route('/users').get(getUsers);
router.route('/users/:id').put(updateUser).delete(deleteUser);

module.exports = router;
