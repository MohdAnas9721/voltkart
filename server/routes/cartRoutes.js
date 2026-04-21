const express = require('express');
const { addToCart, getCart, removeCartItem, updateCartItem } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.route('/').get(getCart).post(addToCart);
router.route('/:id').put(updateCartItem).delete(removeCartItem);

module.exports = router;
