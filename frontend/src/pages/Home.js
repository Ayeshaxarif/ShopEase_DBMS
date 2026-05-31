import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../api';
import './Home.css';

function Home({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const featured = products.slice(0, 4);

  const categories = [
    { name: 'Electronics', icon: '⚡', gradient: 'linear-gradient(135deg, #667eea, #764ba2)', light: 'rgba(102,126,234,0.12)' },
    { name: 'Fashion', icon: '👗', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)', light: 'rgba(240,147,251,0.12)' },
    { name: 'Home', icon: '🏠', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)', light: 'rgba(79,172,254,0.12)' },
    { name: 'Sports', icon: '🏃', gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)', light: 'rgba(67,233,123,0.12)' },
  ];

  return (
    <div className="home">
      <section className="hero-section">
        <div className="hero-orb hero-orb1"></div>
        <div className="hero-orb hero-orb2"></div>
        <div className="hero-orb hero-orb3"></div>
        <div className="hero-left">
          <span className="hero-pill">✦ New Arrivals 2026</span>
          <h1 className="hero-heading">
            Shop <span className="hero-highlight">Smarter</span>,<br />
            Live <span className="hero-highlight2">Better</span>
          </h1>
          <p className="hero-para">
            Premium products at unbeatable prices — delivered straight to your door with love.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="hero-cta">Shop Now →</Link>
            <Link to="/products" className="hero-cta2">View All →</Link>
          </div>
          <div className="hero-badges">
            <span className="badge">🚚 Free Delivery</span>
            <span className="badge">🔒 Secure Payment</span>
            <span className="badge">⭐ Top Rated</span>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-card-float">
            <span className="hero-emoji">🛍️</span>
            <div className="hero-float-tag">{products.length}+ Products</div>
          </div>
        </div>
      </section>

      <section className="cat-section">
        <div className="section-head">
          <h2>Shop by <span>Category</span></h2>
          <p>Find exactly what you're looking for</p>
        </div>
        <div className="cat-grid">
          {categories.map(cat => (
            <Link to={`/products?category=${cat.name}`} key={cat.name}
              className="cat-tile" style={{ background: cat.light }}>
              <div className="cat-icon-wrap" style={{ background: cat.gradient }}>
                <span>{cat.icon}</span>
              </div>
              <span className="cat-label">{cat.name}</span>
              <span className="cat-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="featured-section">
        <div className="section-head">
          <h2>Featured <span>Products</span></h2>
          <p>Handpicked just for you</p>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
            Loading products...
          </div>
        ) : (
          <div className="featured-grid">
            {featured.map(p => (
              <ProductCard key={p._id} product={p} addToCart={addToCart} />
            ))}
          </div>
        )}
        <div className="featured-cta">
          <Link to="/products" className="view-all-btn">View All Products →</Link>
        </div>
      </section>

      <section className="promo-banner">
        <div className="promo-orb pb1"></div>
        <div className="promo-orb pb2"></div>
        <div className="promo-content">
          <h2>Ready to start shopping?</h2>
          <p>Join thousands of happy customers on ShopEase</p>
          <Link to="/signup" className="promo-btn">Create Account →</Link>
        </div>
      </section>
    </div>
  );
}

export default Home;