const express = require('express');
const { createCoupon, deleteCoupon, getCoupons, updateCoupon } = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, admin);
router.route('/').get(getCoupons).post(createCoupon);
router.route('/:id').put(updateCoupon).delete(deleteCoupon);

module.exports = router;
