const asyncHandler = require('express-async-handler');
const Banner = require('../models/Banner');

exports.getBanners = asyncHandler(async (req, res) => {
  const query = req.query.all === 'true' ? {} : { isActive: true };
  res.json(await Banner.find(query).sort('sortOrder'));
});

exports.createBanner = asyncHandler(async (req, res) => res.status(201).json(await Banner.create(req.body)));

exports.updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) {
    res.status(404);
    throw new Error('Banner not found');
  }
  Object.assign(banner, req.body);
  await banner.save();
  res.json(banner);
});

exports.deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) {
    res.status(404);
    throw new Error('Banner not found');
  }
  await banner.deleteOne();
  res.json({ message: 'Banner deleted' });
});
