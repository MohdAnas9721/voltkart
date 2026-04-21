const mongoose = require('mongoose');
const makeSlug = require('../utils/slug');

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    logo: { type: String, default: '' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

brandSchema.pre('save', function setSlug(next) {
  if (!this.slug || this.isModified('name')) this.slug = makeSlug(this.name);
  next();
});

module.exports = mongoose.model('Brand', brandSchema);
