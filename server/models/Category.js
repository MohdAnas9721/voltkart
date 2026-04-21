const mongoose = require('mongoose');
const makeSlug = require('../utils/slug');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    icon: { type: String, default: 'zap' },
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    bannerImage: { type: String, default: '' },
    description: { type: String, default: '' }
  },
  { timestamps: true }
);

categorySchema.pre('save', function setSlug(next) {
  if (!this.slug || this.isModified('name')) this.slug = makeSlug(this.name);
  next();
});

module.exports = mongoose.model('Category', categorySchema);
