import React, { useState } from 'react';
import { categories, products } from '../data/products';
import ProductCard from '../components/ProductCard';
import './Products.css';

function Products({ addToCart }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="products-page">
      <h1>Our Products</h1>
      
      {/* Category Filter */}
      <div className="category-filter">
        <button 
          className={selectedCategory === 'All' ? 'active' : ''}
          onClick={() => setSelectedCategory('All')}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={selectedCategory === cat.name ? 'active' : ''}
            onClick={() => setSelectedCategory(cat.name)}
            style={{ '--cat-color': cat.color }}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            addToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
}

export default Products;