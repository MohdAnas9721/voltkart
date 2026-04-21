const express = require('express');
const { createBrand, deleteBrand, getBrands, updateBrand } = require('../controllers/brandController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(getBrands).post(protect, admin, createBrand);
router.route('/:id').put(protect, admin, updateBrand).delete(protect, admin, deleteBrand);

module.exports = router;
