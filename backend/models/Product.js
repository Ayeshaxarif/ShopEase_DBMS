const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative'],
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Electronics', 'Fashion', 'Home', 'Sports'],
    },
    icon: {
      type: String,
      default: '📦',
    },
    description: {
      type: String,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // auto createdAt & updatedAt
  }
);

// ─── Indexes ────────────────────────────────────────────────
// Text index for $text search on name and description
productSchema.index({ name: 'text', description: 'text' });
// Category filter (most common query)
productSchema.index({ category: 1 });
// Price range queries
productSchema.index({ price: 1 });
// Rating-based sorting
productSchema.index({ rating: -1 });
// Stock availability queries
productSchema.index({ stock: 1 });
// Newest products first
productSchema.index({ createdAt: -1 });
// Compound: category + price (filter + sort together)
productSchema.index({ category: 1, price: 1 });

// ─── Virtual: discount percentage ───────────────────────────
productSchema.virtual('discountPercent').get(function () {
  if (this.originalPrice > this.price) {
    return Math.round((1 - this.price / this.originalPrice) * 100);
  }
  return 0;
});

module.exports = mongoose.model('Product', productSchema);

