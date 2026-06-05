const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');
const User    = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'shopease_secret_2026';

// ─── POST /api/auth/signup ────────────────────────────────────
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // Check if email already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Manually hash password — bypass pre-save hook
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'customer',
    });

    // Mark password as not modified so pre-save hook skips re-hashing
    user.$locals.skipHash = true;
    await user.save({ validateBeforeSave: true });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: error.message });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user (use instance method for password compare)
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare using the instance method defined in User schema
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── GET /api/auth/profile ────────────────────────────────────
// Get logged-in user's profile
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token' });

    const token   = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user    = await User.findById(decoded.id).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ success: true, user });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// ─── GET /api/auth/users ──────────────────────────────────────
// Admin: get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
