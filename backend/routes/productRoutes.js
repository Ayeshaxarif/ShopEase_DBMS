const express = require('express');
const router  = express.Router();
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// ─── GET /api/products ────────────────────────────────────────
// Features: category filter, text search, pagination, sorting
router.get('/', async (req, res) => {
  try {
    const {
      category,
      search,
      page     = 1,
      limit    = 12,
      sortBy   = 'createdAt',
      order    = 'desc',
      minPrice,
      maxPrice,
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (category && category !== 'All') {
      filter.category = category; // uses { category: 1 } index
    }

    // MongoDB $text search (uses text index on name + description)
    if (search) {
      filter.$text = { $search: search };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Pagination with .skip() and .limit()
    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    // Sort direction
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj   = { [sortBy]: sortOrder };

    // Run query and count in parallel
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortObj)
        .skip(skip)          // Pagination: skip previous pages
        .limit(limitNum)     // Pagination: take only N records
        .lean(),             // .lean() returns plain JS objects (faster)
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      products,
      pagination: {
        total,
        page:       pageNum,
        limit:      limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNext:    pageNum < Math.ceil(total / limitNum),
        hasPrev:    pageNum > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── GET /api/products/stats ──────────────────────────────────
// Aggregation Pipeline: category-wise stats for admin dashboard
router.get('/stats', async (req, res) => {
  try {
    const stats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id:          '$category',
          totalProducts:{ $sum: 1 },
          avgPrice:     { $avg: '$price' },
          totalStock:   { $sum: '$stock' },
          avgRating:    { $avg: '$rating' },
          minPrice:     { $min: '$price' },
          maxPrice:     { $max: '$price' },
        },
      },
      { $sort: { totalProducts: -1 } },
      {
        $project: {
          category:      '$_id',
          totalProducts: 1,
          avgPrice:      { $round: ['$avgPrice', 2] },
          totalStock:    1,
          avgRating:     { $round: ['$avgRating', 1] },
          minPrice:      1,
          maxPrice:      1,
          _id:           0,
        },
      },
    ]);

    // Overall summary
    const summary = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id:           null,
          totalProducts: { $sum: 1 },
          avgPrice:      { $avg: '$price' },
          totalStockValue:{ $sum: { $multiply: ['$price', '$stock'] } },
          lowStockCount: {
            $sum: { $cond: [{ $lte: ['$stock', 10] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id:            0,
          totalProducts:  1,
          avgPrice:       { $round: ['$avgPrice', 2] },
          totalStockValue:{ $round: ['$totalStockValue', 2] },
          lowStockCount:  1,
        },
      },
    ]);

    res.json({ success: true, categoryStats: stats, summary: summary[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── GET /api/products/:id ────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── POST /api/products ───────────────────────────────────────
// Admin only
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: error.message });
  }
});

// ─── PUT /api/products/:id ────────────────────────────────────
// Admin only — uses findByIdAndUpdate with validation
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true } // runValidators: enforce schema rules on update
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ success: true, product });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: error.message });
  }
});

// ─── DELETE /api/products/:id ─────────────────────────────────
// Admin only — soft delete (sets isActive: false)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: { isActive: false } },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
