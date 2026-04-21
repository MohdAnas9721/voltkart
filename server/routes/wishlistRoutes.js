const express = require('express');
const { addWishlist, getWishlist, removeWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.route('/').get(getWishlist).post(addWishlist);
router.delete('/:id', removeWishlist);

module.exports = router;
