const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Product = require('../models/Product');

exports.getProductReviews = asyncHandler(async (req, res) => {
  res.json(await Review.find({ product: req.params.id }).populate('user', 'name avatar').sort({ createdAt: -1 }));
});

exports.createReview = asyncHandler(async (req, res) => {
  const review = await Review.create({
    user: req.user._id,
    product: req.body.productId,
    rating: req.body.rating,
    title: req.body.title,
    comment: req.body.comment
  });
  const stats = await Review.aggregate([
    { $match: { product: review.product } },
    { $group: { _id: '$product', rating: { $avg: '$rating' }, numReviews: { $sum: 1 } } }
  ]);
  await Product.findByIdAndUpdate(review.product, {
    rating: Math.round((stats[0]?.rating || 0) * 10) / 10,
    numReviews: stats[0]?.numReviews || 0
  });
  res.status(201).json(review);
});
