const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const MONGODB_URI = 'mongodb://localhost:27017/shopease';

const products = [
  { name: 'Wireless Headphones', price: 79.99,  originalPrice: 120.00, category: 'Electronics', icon: '🎧', rating: 4, reviews: 128, stock: 50,  description: 'Premium wireless headphones with noise cancellation and 30hr battery life.' },
  { name: 'Smartphone Stand',    price: 19.99,  originalPrice: 29.99,  category: 'Electronics', icon: '📱', rating: 3, reviews: 44,  stock: 80,  description: 'Adjustable smartphone stand for desk use, compatible with all phones.' },
  { name: 'Bluetooth Speaker',   price: 49.99,  originalPrice: 75.00,  category: 'Electronics', icon: '🔊', rating: 5, reviews: 203, stock: 30,  description: 'Waterproof portable speaker with 360° sound and 12hr battery.' },
  { name: 'Smart Watch',         price: 129.99, originalPrice: 180.00, category: 'Electronics', icon: '⌚', rating: 4, reviews: 167, stock: 25,  description: 'Feature-rich smartwatch with health tracking and GPS.' },
  { name: 'Laptop Sleeve',       price: 24.99,  originalPrice: 35.00,  category: 'Electronics', icon: '💻', rating: 4, reviews: 89,  stock: 40,  description: 'Neoprene laptop sleeve fits 13-15 inch laptops with accessory pocket.' },
  { name: 'Wireless Charger',    price: 34.99,  originalPrice: 50.00,  category: 'Electronics', icon: '🔋', rating: 4, reviews: 112, stock: 60,  description: 'Fast 15W wireless charger compatible with all Qi-enabled devices.' },
  { name: 'Earbuds Pro',         price: 59.99,  originalPrice: 90.00,  category: 'Electronics', icon: '🎵', rating: 5, reviews: 245, stock: 35,  description: 'True wireless earbuds with active noise cancellation and 24hr case.' },
  { name: 'Running Shoes',       price: 59.99,  originalPrice: 89.99,  category: 'Fashion',     icon: '👟', rating: 4, reviews: 95,  stock: 60,  description: 'Lightweight running shoes with responsive cushioning and breathable mesh.' },
  { name: 'Leather Wallet',      price: 34.99,  originalPrice: 50.00,  category: 'Fashion',     icon: '👜', rating: 4, reviews: 88,  stock: 45,  description: 'Genuine leather slim wallet with RFID blocking and 8 card slots.' },
  { name: 'Sunglasses',          price: 44.99,  originalPrice: 65.00,  category: 'Fashion',     icon: '🕶️', rating: 4, reviews: 76,  stock: 55,  description: 'UV400 polarized sunglasses with lightweight titanium frame.' },
  { name: 'Baseball Cap',        price: 19.99,  originalPrice: 30.00,  category: 'Fashion',     icon: '🧢', rating: 4, reviews: 63,  stock: 70,  description: 'Adjustable cotton baseball cap with embroidered logo.' },
  { name: 'Backpack',            price: 54.99,  originalPrice: 80.00,  category: 'Fashion',     icon: '🎒', rating: 4, reviews: 98,  stock: 40,  description: '30L waterproof backpack with laptop compartment and USB charging port.' },
  { name: 'Coffee Maker',        price: 49.99,  originalPrice: 70.00,  category: 'Home',        icon: '☕', rating: 5, reviews: 210, stock: 20,  description: '12-cup programmable coffee maker with auto-shut off and keep-warm plate.' },
  { name: 'Desk Lamp',           price: 39.99,  originalPrice: 55.00,  category: 'Home',        icon: '💡', rating: 4, reviews: 73,  stock: 35,  description: 'LED desk lamp with 5 brightness levels and USB charging port.' },
  { name: 'Scented Candles',     price: 14.99,  originalPrice: 22.00,  category: 'Home',        icon: '🕯️', rating: 5, reviews: 189, stock: 80,  description: 'Set of 3 soy wax scented candles — lavender, vanilla, and jasmine.' },
  { name: 'Plant Pot Set',       price: 24.99,  originalPrice: 38.00,  category: 'Home',        icon: '🪴', rating: 5, reviews: 134, stock: 50,  description: 'Set of 5 ceramic plant pots with drainage holes and bamboo trays.' },
  { name: 'Kitchen Blender',     price: 64.99,  originalPrice: 95.00,  category: 'Home',        icon: '🥤', rating: 4, reviews: 108, stock: 25,  description: '1000W high-speed blender with 6 stainless steel blades and 1.5L jar.' },
  { name: 'Yoga Mat',            price: 29.99,  originalPrice: 45.00,  category: 'Sports',      icon: '🧘', rating: 4, reviews: 67,  stock: 55,  description: 'Non-slip 6mm thick yoga mat with alignment lines and carry strap.' },
  { name: 'Water Bottle',        price: 24.99,  originalPrice: 35.00,  category: 'Sports',      icon: '🍶', rating: 5, reviews: 156, stock: 70,  description: 'Insulated 750ml stainless steel water bottle keeps cold 24hr, hot 12hr.' },
  { name: 'Dumbbells Set',       price: 89.99,  originalPrice: 120.00, category: 'Sports',      icon: '🏋️', rating: 5, reviews: 201, stock: 15,  description: 'Adjustable dumbbell set 5-25kg with quick-change mechanism.' },
  { name: 'Jump Rope',           price: 12.99,  originalPrice: 20.00,  category: 'Sports',      icon: '🪢', rating: 4, reviews: 77,  stock: 90,  description: 'Speed jump rope with ball bearing handles and adjustable length.' },
  { name: 'Sports Bag',          price: 39.99,  originalPrice: 60.00,  category: 'Sports',      icon: '🏅', rating: 4, reviews: 85,  stock: 45,  description: '40L gym bag with shoe compartment, wet pocket, and water bottle holder.' },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected!');

    const db = mongoose.connection.db;

    // ── Clear existing data ──────────────────────────────────────
    await db.collection('products').deleteMany({});
    await db.collection('users').deleteMany({});
    await db.collection('orders').deleteMany({});
    await db.collection('carts').deleteMany({});
    console.log('🗑️  Cleared old data');

    // ── Insert products ──────────────────────────────────────────
    await db.collection('products').insertMany(
      products.map((p) => ({ ...p, isActive: true, createdAt: new Date(), updatedAt: new Date() }))
    );
    console.log(`✅ ${products.length} products inserted`);

    // ── Create admin user with HASHED password ───────────────────
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await db.collection('users').insertOne({
      name:      'Admin ShopEase',
      email:     'admin@shopease.com',
      password:  hashedPassword,          // properly hashed
      role:      'admin',
      isActive:  true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ Admin user created (password hashed)');

    // ── Create sample customer ───────────────────────────────────
    const customerPassword = await bcrypt.hash('customer123', 12);
    await db.collection('users').insertOne({
      name:      'Ayesha Arif',
      email:     'ayesha@shopease.com',
      password:  customerPassword,
      role:      'customer',
      isActive:  true,
      phone:     '0300-1234567',
      address:   { street: 'Street 5, Block B', city: 'Lahore', country: 'Pakistan' },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ Sample customer created');

    // ── Create Indexes ───────────────────────────────────────────
    // Users
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });
    await db.collection('users').createIndex({ createdAt: -1 });

    // Products
    await db.collection('products').createIndex({ name: 'text', description: 'text' });
    await db.collection('products').createIndex({ category: 1 });
    await db.collection('products').createIndex({ price: 1 });
    await db.collection('products').createIndex({ rating: -1 });
    await db.collection('products').createIndex({ stock: 1 });
    await db.collection('products').createIndex({ createdAt: -1 });
    await db.collection('products').createIndex({ category: 1, price: 1 });

    // Orders
    await db.collection('orders').createIndex({ userId: 1 });
    await db.collection('orders').createIndex({ createdAt: -1 });
    await db.collection('orders').createIndex({ status: 1 });
    await db.collection('orders').createIndex({ userId: 1, status: 1 });

    // Carts
    await db.collection('carts').createIndex({ userId: 1 }, { unique: true });

    console.log('✅ All indexes created');
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('  ShopEase database seeded successfully!');
    console.log('  Admin:    admin@shopease.com / admin123');
    console.log('  Customer: ayesha@shopease.com / customer123');
    console.log('═══════════════════════════════════════');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

seed();
