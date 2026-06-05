const express = require('express');
const router  = express.Router();
const Cart    = require('../models/Cart');

// ─── GET /api/cart/:userId ────────────────────────────────────
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId })
      .populate('items.productId', 'name price icon stock');
    if (!cart) return res.json({ success: true, cart: { items: [] } });
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── POST /api/cart/save ──────────────────────────────────────
// Save entire cart to MongoDB using findOneAndUpdate + $set
router.post('/save', async (req, res) => {
  try {
    const { userId, items } = req.body;
    if (!userId || userId === 'guest') {
      return res.json({ success: true, message: 'Guest cart not saved' });
    }

    // findOneAndUpdate with upsert — creates if not exists
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $set: { userId, items, updatedAt: new Date() } },
      { upsert: true, new: true }
    );

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── POST /api/cart/add ───────────────────────────────────────
// Add single item using $push or update quantity
router.post('/add', async (req, res) => {
  try {
    const { userId, item } = req.body;
    if (!userId || userId === 'guest') {
      return res.json({ success: true, message: 'Guest cart' });
    }

    // Check if item already exists in cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create new cart with item
      const newCart = await Cart.create({ userId, items: [item] });
      return res.json({ success: true, cart: newCart });
    }

    const existingIdx = cart.items.findIndex(
      i => i.productId?.toString() === item.productId
    );

    if (existingIdx > -1) {
      // Update quantity using $inc
      cart.items[existingIdx].quantity += item.quantity;
      await cart.save();
    } else {
      // Push new item using $push
      await Cart.findOneAndUpdate(
        { userId },
        { $push: { items: item } },
        { new: true }
      );
    }

    const updated = await Cart.findOne({ userId });
    res.json({ success: true, cart: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── DELETE /api/cart/clear/:userId ──────────────────────────
router.delete('/clear/:userId', async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { userId: req.params.userId },
      { $set: { items: [] } }
    );
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
