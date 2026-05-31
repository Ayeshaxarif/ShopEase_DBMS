import React from 'react';
import './ProductCard.css';

function ProductCard({ product, addToCart }) {
  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));

  return (
    <div className="product-card">
      <div className="product-image-box">
        <span className="product-emoji">{product.icon}</span>
        {discount > 0 && <span className="discount-badge">{discount}% OFF</span>}
      </div>
      <div className="product-body">
        <div className="product-category">{product.category}</div>
        <div className="product-name">{product.name}</div>
        <div className="product-stars">
          {stars}
          {product.reviews && (
            <span className="review-count">({product.reviews})</span>
          )}
        </div>
        <div className="product-footer">
          <div className="product-price">
            ${product.price.toFixed(2)}
            {discount > 0 && (
              <span className="original-price">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <button className="add-to-cart-btn" onClick={() => addToCart(product)}>+</button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;