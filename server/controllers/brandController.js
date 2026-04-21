const asyncHandler = require('express-async-handler');
const Brand = require('../models/Brand');

exports.getBrands = asyncHandler(async (req, res) => {
  res.json(await Brand.find().sort('name'));
});

exports.createBrand = asyncHandler(async (req, res) => {
  res.status(201).json(await Brand.create(req.body));
});

exports.updateBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    res.status(404);
    throw new Error('Brand not found');
  }
  Object.assign(brand, req.body);
  await brand.save();
  res.json(brand);
});

exports.deleteBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    res.status(404);
    throw new Error('Brand not found');
  }
  await brand.deleteOne();
  res.json({ message: 'Brand deleted' });
});
