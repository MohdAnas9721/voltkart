const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');

const productPopulate = [
  { path: 'category', select: 'name slug icon' },
  { path: 'subcategory', select: 'name slug icon' },
  { path: 'brand', select: 'name slug logo' }
];

const resolveCategoryIds = async (value) => {
  if (!value) return undefined;
  const or = [{ slug: value }];
  if (value.match(/^[0-9a-fA-F]{24}$/)) or.push({ _id: value });
  const categories = await Category.find({ $or: or }).select('_id');
  return categories.map((category) => category._id);
};

const resolveBrandIds = async (value) => {
  if (!value) return undefined;
  const or = [{ slug: value }];
  if (value.match(/^[0-9a-fA-F]{24}$/)) or.push({ _id: value });
  const brands = await Brand.find({ $or: or }).select('_id');
  return brands.map((brand) => brand._id);
};

exports.getProducts = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    discount,
    rating,
    stock,
    type,
    conductorSize,
    packing,
    length,
    sort = 'newest',
    page = 1,
    limit = 12,
    featured
  } = req.query;

  const query = { isActive: true };
  const and = [];
  if (search) {
    and.push({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ]
    });
  }
  if (category) {
    const ids = await resolveCategoryIds(category);
    and.push({ $or: [{ category: { $in: ids } }, { subcategory: { $in: ids } }] });
  }
  if (brand) query.brand = { $in: await resolveBrandIds(brand) };
  if (minPrice || maxPrice) query.price = {};
  if (minPrice) query.price.$gte = Number(minPrice);
  if (maxPrice) query.price.$lte = Number(maxPrice);
  if (discount) query.discountPercent = { $gte: Number(discount) };
  if (rating) query.rating = { $gte: Number(rating) };
  if (stock === 'in') query.stock = { $gt: 0 };
  if (stock === 'out') query.stock = 0;
  if (type) query.tags = { $in: String(type).split(',') };
  if (conductorSize) query['specifications.Conductor Size'] = conductorSize;
  if (packing) query['specifications.Packing'] = packing;
  if (length) query['specifications.Length'] = length;
  if (featured !== undefined) query.featured = featured === 'true';
  if (and.length) query.$and = and;

  const sortMap = {
    priceLow: { price: 1 },
    priceHigh: { price: -1 },
    popularity: { popularity: -1 },
    discount: { discountPercent: -1 },
    newest: { createdAt: -1 }
  };

  const currentPage = Math.max(Number(page), 1);
  const pageSize = Math.min(Math.max(Number(limit), 1), 48);
  const [products, total] = await Promise.all([
    Product.find(query)
      .populate(productPopulate)
      .sort(sortMap[sort] || sortMap.newest)
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize),
    Product.countDocuments(query)
  ]);

  res.json({
    products,
    pagination: {
      page: currentPage,
      pages: Math.ceil(total / pageSize),
      total,
      limit: pageSize
    }
  });
});

exports.getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate(productPopulate);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  product.popularity += 1;
  await product.save();
  res.json(product);
});

exports.createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(await product.populate(productPopulate));
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  Object.assign(product, req.body);
  await product.save();
  res.json(await product.populate(productPopulate));
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await product.deleteOne();
  res.json({ message: 'Product deleted' });
});
