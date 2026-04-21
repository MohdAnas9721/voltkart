const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');

exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().populate('parentCategory', 'name slug').sort('name');
  res.json(categories);
});

exports.createCategory = asyncHandler(async (req, res) => {
  res.status(201).json(await Category.create(req.body));
});

exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  Object.assign(category, req.body);
  await category.save();
  res.json(category);
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  await category.deleteOne();
  res.json({ message: 'Category deleted' });
});
