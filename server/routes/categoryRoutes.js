const express = require('express');
const {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(getCategories).post(protect, admin, createCategory);
router.route('/:id').put(protect, admin, updateCategory).delete(protect, admin, deleteCategory);

module.exports = router;
