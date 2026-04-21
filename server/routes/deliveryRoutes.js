const express = require('express');
const { deliveryDashboard } = require('../controllers/deliveryController');
const { updateTracking } = require('../controllers/orderController');
const { protect, delivery } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, delivery);
router.get('/dashboard', deliveryDashboard);
router.put('/orders/:id/status', updateTracking);

module.exports = router;
