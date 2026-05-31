const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://localhost:27017/shopease';
const products = [
  { name: 'Wireless Headphones', price: 79.99, originalPrice: 120.00, category: 'Electronics', icon: '🎧', rating: 4, reviews: 128, stock: 50 },
  { name: 'Smartphone Stand', price: 19.99, originalPrice: 29.99, category: 'Electronics', icon: '📱', rating: 3, reviews: 44, stock: 80 },
  { name: 'Bluetooth Speaker', price: 49.99, originalPrice: 75.00, category: 'Electronics', icon: '🔊', rating: 5, reviews: 203, stock: 30 },
  { name: 'Smart Watch', price: 129.99, originalPrice: 180.00, category: 'Electronics', icon: '⌚', rating: 4, reviews: 167, stock: 25 },
  { name: 'Laptop Sleeve', price: 24.99, originalPrice: 35.00, category: 'Electronics', icon: '💻', rating: 4, reviews: 89, stock: 40 },
  { name: 'Wireless Charger', price: 34.99, originalPrice: 50.00, category: 'Electronics', icon: '🔋', rating: 4, reviews: 112, stock: 60 },
  { name: 'Earbuds Pro', price: 59.99, originalPrice: 90.00, category: 'Electronics', icon: '🎵', rating: 5, reviews: 245, stock: 35 },
  { name: 'Running Shoes', price: 59.99, originalPrice: 89.99, category: 'Fashion', icon: '👟', rating: 4, reviews: 95, stock: 60 },
  { name: 'Leather Wallet', price: 34.99, originalPrice: 50.00, category: 'Fashion', icon: '👜', rating: 4, reviews: 88, stock: 45 },
  { name: 'Sunglasses', price: 44.99, originalPrice: 65.00, category: 'Fashion', icon: '🕶️', rating: 4, reviews: 76, stock: 55 },
  { name: 'Baseball Cap', price: 19.99, originalPrice: 30.00, category: 'Fashion', icon: '🧢', rating: 4, reviews: 63, stock: 70 },
  { name: 'Backpack', price: 54.99, originalPrice: 80.00, category: 'Fashion', icon: '🎒', rating: 4, reviews: 98, stock: 40 },
  { name: 'Coffee Maker', price: 49.99, originalPrice: 70.00, category: 'Home', icon: '☕', rating: 5, reviews: 210, stock: 20 },
  { name: 'Desk Lamp', price: 39.99, originalPrice: 55.00, category: 'Home', icon: '💡', rating: 4, reviews: 73, stock: 35 },
  { name: 'Scented Candles', price: 14.99, originalPrice: 22.00, category: 'Home', icon: '🕯️', rating: 5, reviews: 189, stock: 80 },
  { name: 'Plant Pot Set', price: 24.99, originalPrice: 38.00, category: 'Home', icon: '🪴', rating: 5, reviews: 134, stock: 50 },
  { name: 'Kitchen Blender', price: 64.99, originalPrice: 95.00, category: 'Home', icon: '🥤', rating: 4, reviews: 108, stock: 25 },
  { name: 'Yoga Mat', price: 29.99, originalPrice: 45.00, category: 'Sports', icon: '🧘', rating: 4, reviews: 67, stock: 55 },
  { name: 'Water Bottle', price: 24.99, originalPrice: 35.00, category: 'Sports', icon: '🍶', rating: 5, reviews: 156, stock: 70 },
  { name: 'Dumbbells Set', price: 89.99, originalPrice: 120.00, category: 'Sports', icon: '🏋️', rating: 5, reviews: 201, stock: 15 },
  { name: 'Jump Rope', price: 12.99, originalPrice: 20.00, category: 'Sports', icon: '🪢', rating: 4, reviews: 77, stock: 90 },
  { name: 'Sports Bag', price: 39.99, originalPrice: 60.00, category: 'Sports', icon: '🏅', rating: 4, reviews: 85, stock: 45 },
];

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    console.log('✅ MongoDB Connected!');
    const db = client.db('shopease');
    await db.collection('products').deleteMany({});
    await db.collection('users').deleteMany({});
    await db.collection('products').insertMany(products);
    await db.collection('users').insertOne({
      name: 'Admin ShopEase',
      email: 'admin@shopease.com',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date()
    });
    console.log('✅ Database seeded successfully!');
    console.log(`✅ ${products.length} products added!`);
    console.log('✅ Admin user created!');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.close();
    process.exit();
  }
}

seed();