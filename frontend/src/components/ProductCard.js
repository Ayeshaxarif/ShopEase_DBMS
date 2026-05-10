import React from 'react';

function ProductCard({ product, addToCart }) {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        {product.originalPrice > product.price && (
          <span className="discount-badge">
            {Math.round((1 - product.price/product.originalPrice) * 100)}% OFF
          </span>
        )}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <div className="rating">
          {'⭐'.repeat(Math.floor(product.rating))} 
          <span>({product.reviews})</span>
        </div>
        <div className="price-section">
          <span className="price">${product.price}</span>
          {product.originalPrice > product.price && (
            <span className="original-price">${product.originalPrice}</span>
          )}
        </div>
        <button 
          className="add-to-cart-btn"
          onClick={() => addToCart(product)}
        >
          🛒 Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;