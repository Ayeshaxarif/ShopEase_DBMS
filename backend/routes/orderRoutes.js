const express  = require('express');
const router   = express.Router();
const mongoose = require('mongoose');
const Order    = require('../models/Order');
const Product  = require('../models/Product');

// ─── POST /api/orders ─────────────────────────────────────────
// Place order — stock validation + order insert + stock decrement
router.post('/', async (req, res) => {
  try {
    const {
      userId, customerName, customerEmail, customerPhone,
      items, totalAmount, shippingAddress, paymentMethod,
    } = req.body;

    // ── Step 1: Validate stock for each item BEFORE placing order ──
    for (const item of items) {
      if (item.productId && item.productId !== 'guest') {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({ message: `Product not found: ${item.name}` });
        }
        if (product.stock < item.quantity) {
          return res.status(400).json({
            message: `Insufficient stock for "${product.name}". Available: ${product.stock}`,
          });
        }
      }
    }

    // ── Step 2: Create the order ───────────────────────────────────
    const order = await Order.create({
      userId:        userId && userId !== 'guest' ? userId : null,
      customerName,
      customerEmail,
      customerPhone,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'cash_on_delivery',
      status:        'pending',
      isPaid:        false,
    });

    // ── Step 3: Decrement stock for each product ($inc) ────────────
    for (const item of items) {
      if (item.productId && item.productId !== 'guest') {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } }  // $inc: atomic decrement
        );
      }
    }

    // Populate user info for response
    const populatedOrder = await Order.findById(order._id).populate('userId', 'name email');

    res.status(201).json({ success: true, order: populatedOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── GET /api/orders ──────────────────────────────────────────
// Admin: get all orders with user details (populate)
router.get('/', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('userId', 'name email phone') // JOIN with users collection
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Order.countDocuments(filter),
    ]);

    res.json({
      success: true,
      orders,
      pagination: {
        total,
        page:       parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── GET /api/orders/analytics ───────────────────────────────
// Aggregation Pipeline: full order analytics for admin dashboard
router.get('/analytics', async (req, res) => {
  try {
    // ── Pipeline 1: Revenue & order counts by status ──────────────
    const statusStats = await Order.aggregate([
      {
        $group: {
          _id:          '$status',
          count:        { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // ── Pipeline 2: Revenue per day (last 30 days) ────────────────
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          status:    { $ne: 'cancelled' },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          revenue: { $sum: '$totalAmount' },
          orders:  { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // ── Pipeline 3: Top selling products ─────────────────────────
    const topProducts = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $unwind: '$items' },                          // unwind items array
      {
        $group: {
          _id:          '$items.productId',
          productName:  { $first: '$items.name' },
          totalSold:    { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id:         0,
          productId:   '$_id',
          productName: 1,
          totalSold:   1,
          totalRevenue:{ $round: ['$totalRevenue', 2] },
        },
      },
    ]);

    // ── Pipeline 4: Overall totals ────────────────────────────────
    const [totals] = await Order.aggregate([
      {
        $group: {
          _id:          null,
          totalOrders:  { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          avgOrderValue:{ $avg: '$totalAmount' },
          paidOrders:   { $sum: { $cond: ['$isPaid', 1, 0] } },
        },
      },
      {
        $project: {
          _id:           0,
          totalOrders:   1,
          totalRevenue:  { $round: ['$totalRevenue', 2] },
          avgOrderValue: { $round: ['$avgOrderValue', 2] },
          paidOrders:    1,
        },
      },
    ]);

    // ── Pipeline 5: Payment method breakdown ──────────────────────
    const paymentStats = await Order.aggregate([
      {
        $group: {
          _id:   '$paymentMethod',
          count: { $sum: 1 },
          total: { $sum: '$totalAmount' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      analytics: {
        totals:       totals || {},
        statusStats,
        dailyRevenue,
        topProducts,
        paymentStats,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── GET /api/orders/user/:userId ────────────────────────────
// Get orders of a specific user with product details (populate)
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate({
        path:   'items.productId',  // populate product details inside items array
        select: 'name price icon category',
        model:  'Product',
      })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── GET /api/orders/:id ──────────────────────────────────────
// Single order with full user + product details
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email phone address') // user details
      .populate('items.productId', 'name price icon category'); // product details

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── PUT /api/orders/:id ──────────────────────────────────────
// Update order status (Admin)
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status,
          isPaid: status === 'delivered' ? true : undefined,
        },
      },
      { new: true, runValidators: true }
    ).populate('userId', 'name email');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
