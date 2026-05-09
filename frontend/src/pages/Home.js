import React from 'react';
import { Link } from 'react-router-dom';
import { categories, products } from '../data/products';
import './Home.css';

function Home() {
  // Featured products (first 4)
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to ShopEase</h1>
        <p>Discover amazing products at unbeatable prices</p>
        <Link to="/products" className="shop-btn">Shop Now</Link>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2>Browse by Category</h2>
        <div className="categories-grid">
          {categories.map(cat => (
            <Link 
              to={`/products?category=${cat.name}`} 
              key={cat.id} 
              className="category-card"
              style={{ background: cat.color }}
            >
              <span className="category-icon">{cat.icon}</span>
              <h3>{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <h2>Featured Products</h2>
        <div className="featured-grid">
          {featuredProducts.map(product => (
            <div key={product.id} className="featured-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p className="price">${product.price}</p>
              <Link to={`/products`} className="view-btn">View Details</Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;