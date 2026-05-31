const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Place order
router.post('/', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const order = await db.collection('orders').insertOne({
      ...req.body,
      createdAt: new Date()
    });
    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders (Admin)
router.get('/', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const orders = await db.collection('orders').find({}).sort({ createdAt: -1 }).toArray();
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user orders
router.get('/user/:userId', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const orders = await db.collection('orders')
      .find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .toArray();
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.put('/:id', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const order = await db.collection('orders').findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(req.params.id) },
      { $set: { status: req.body.status } },
      { returnDocument: 'after' }
    );
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;