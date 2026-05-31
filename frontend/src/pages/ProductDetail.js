import React from 'react';
import { useParams } from 'react-router-dom';
import { products } from '../data/products';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return <div className="not-found">Product not found</div>;
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="product-detail">
      <div className="detail-container">
        <div className="detail-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="detail-info">
          <span className="detail-category">{product.category}</span>
          <h1>{product.name}</h1>
          <div className="detail-rating">
            {'⭐'.repeat(Math.floor(product.rating))}
            <span>({product.reviews} reviews)</span>
          </div>
          <div className="detail-price">
            <span className="current-price">${product.price}</span>
            <span className="original-price">${product.originalPrice}</span>
            <span className="discount">{discount}% OFF</span>
          </div>
          <p className="detail-description">
            Premium quality {product.name.toLowerCase()} with excellent features. 
            Best seller in {product.category} category.
          </p>
          <button className="add-cart-btn">🛒 Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;