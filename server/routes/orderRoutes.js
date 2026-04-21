const express = require('express');
const { adminOrders, createOrder, getOrder, myOrders, requestReturn, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.post('/', createOrder);
router.get('/my', myOrders);
router.get('/admin/orders', admin, adminOrders);
router.put('/admin/orders/:id/status', admin, updateOrderStatus);
router.post('/:id/return', requestReturn);
router.get('/:id', getOrder);

module.exports = router;
