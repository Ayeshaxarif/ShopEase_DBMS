const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name:     { type: String, required: true },
    price:    { type: Number, required: true, min: 0 },
    icon:     { type: String, default: '📦' },
    quantity: { type: Number, required: true, default: 1, min: 1 },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // one cart per user
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

// ─── Index ───────────────────────────────────────────────────
// Note: userId unique index already created via unique:true in field definition

// ─── Virtual: total price of cart ────────────────────────────
cartSchema.virtual('totalPrice').get(function () {
  return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

// ─── Virtual: total item count ────────────────────────────────
cartSchema.virtual('itemCount').get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

module.exports = mongoose.model('Cart', cartSchema);

