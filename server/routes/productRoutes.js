const express = require('express');
const {
  createProduct,
  deleteProduct,
  getProductBySlug,
  getProducts,
  updateProduct
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const { getProductReviews } = require('../controllers/reviewController');

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.get('/:id/reviews', getProductReviews);
router.route('/:slug').get(getProductBySlug);
router.route('/:id').put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

module.exports = router;
