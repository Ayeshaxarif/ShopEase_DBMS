const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Get all products
router.get('/', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { category } = req.query;
    const filter = category ? { category } : {};
    const products = await db.collection('products').find(filter).toArray();
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const product = await db.collection('products').findOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add product
router.post('/', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const product = await db.collection('products').insertOne(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const product = await db.collection('products').findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(req.params.id) },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    await db.collection('products').deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;