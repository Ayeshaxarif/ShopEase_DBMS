require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const connectDB = require('./config/db');
const { getShardingInfo } = require('./config/sharding');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders',   require('./routes/orderRoutes'));

app.get('/', (req, res) => {
  res.json({ message: '✅ ShopEase API is running!' });
});

app.get('/api/shard-info', (req, res) => {
  res.json(getShardingInfo());
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});