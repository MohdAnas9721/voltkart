const express = require('express');
const { createBanner, deleteBanner, getBanners, updateBanner } = require('../controllers/bannerController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(getBanners).post(protect, admin, createBanner);
router.route('/:id').put(protect, admin, updateBanner).delete(protect, admin, deleteBanner);

module.exports = router;
