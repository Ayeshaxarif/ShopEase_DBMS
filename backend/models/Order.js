const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    name:     { type: String, required: true },
    price:    { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    icon:     { type: String, default: '📦' },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    customerName:  { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, lowercase: true, trim: true },
    customerPhone: { type: String, default: '' },

    items: {
      type: [orderItemSchema],
      validate: {
        validator: (v) => v.length > 0,
        message: 'Order must have at least one item',
      },
    },

    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative'],
    },

    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },

    shippingAddress: {
      street:  { type: String, required: true },
      city:    { type: String, required: true },
      country: { type: String, default: 'Pakistan' },
    },

    paymentMethod: {
      type: String,
      enum: ['cash_on_delivery', 'card', 'jazzcash', 'easypaisa'],
      default: 'cash_on_delivery',
    },

    isPaid: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ─────────────────────────────────────────────────
// Find orders by user (My Orders page)
orderSchema.index({ userId: 1 });
// Admin: latest orders first
orderSchema.index({ createdAt: -1 });
// Filter by status (admin dashboard)
orderSchema.index({ status: 1 });
// Compound: user + status (user's pending orders)
orderSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Order', orderSchema);
