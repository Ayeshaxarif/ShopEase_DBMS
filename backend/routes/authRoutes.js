const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Signup
router.post('/signup', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { name, email, password } = req.body;
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await db.collection('users').insertOne({
      name, email,
      password: hashedPassword,
      role: 'customer',
      createdAt: new Date()
    });
    const token = jwt.sign({ id: user.insertedId, role: 'customer' }, process.env.JWT_SECRET || 'shopease_secret_2026', { expiresIn: '7d' });
    res.status(201).json({ success: true, token, user: { id: user.insertedId, name, email, role: 'customer' } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { email, password } = req.body;
    const user = await db.collection('users').findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'shopease_secret_2026', { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;