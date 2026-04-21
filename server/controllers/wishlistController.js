const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/Wishlist');

const populateWishlist = (id) =>
  Wishlist.findById(id).populate({
    path: 'items',
    populate: [
      { path: 'brand', select: 'name slug logo' },
      { path: 'category', select: 'name slug' }
    ]
  });

exports.getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, items: [] });
  res.json(await populateWishlist(wishlist._id));
});

exports.addWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOneAndUpdate(
    { user: req.user._id },
    { $setOnInsert: { user: req.user._id }, $addToSet: { items: req.body.productId } },
    { upsert: true, new: true }
  );
  res.status(201).json(await populateWishlist(wishlist._id));
});

exports.removeWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { items: req.params.id } },
    { new: true }
  );
  res.json(await populateWishlist(wishlist._id));
});
