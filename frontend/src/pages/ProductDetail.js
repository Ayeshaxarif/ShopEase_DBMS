import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetail.css';

function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        if (data.success) setProduct(data.product);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discount = product?.originalPrice > product?.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const stars = product ? '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating)) : '';

  if (loading) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 144px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(160deg, #fdf6ff, #fff0f5, #f0f4ff)'
      }}>
        <p style={{ color: '#9ca3af', fontSize: '18px' }}>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 144px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(160deg, #fdf6ff, #fff0f5, #f0f4ff)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '64px', marginBottom: '16px' }}>😕</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#1a1a2e', marginBottom: '12px' }}>Product not found!</h2>
          <button onClick={() => navigate('/products')} style={{
            background: '#e94560', color: '#fff', border: 'none',
            padding: '12px 28px', borderRadius: '30px', cursor: 'pointer', fontSize: '15px'
          }}>Back to Products</button>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="detail-container">
        <div className="detail-image-section">
          <div className="detail-image-box">
            <span className="detail-emoji">{product.icon}</span>
            {discount > 0 && <span className="detail-badge">{discount}% OFF</span>}
          </div>
          <div className="detail-tags">
            <span className="detail-tag">✓ Free Delivery</span>
            <span className="detail-tag">✓ Easy Returns</span>
            <span className="detail-tag">✓ Secure Payment</span>
          </div>
        </div>

        <div className="detail-info">
          <span className="detail-category">{product.category}</span>
          <h1 className="detail-name">{product.name}</h1>

          <div className="detail-stars">
            <span className="stars-text">{stars}</span>
            <span className="reviews-count">({product.reviews} reviews)</span>
          </div>

          <div className="detail-price-section">
            <span className="detail-price">${product.price.toFixed(2)}</span>
            {discount > 0 && (
              <span className="detail-original">${product.originalPrice.toFixed(2)}</span>
            )}
            {discount > 0 && (
              <span className="detail-saving">Save ${(product.originalPrice - product.price).toFixed(2)}</span>
            )}
          </div>

          <div className="detail-stock">
            <span className={product.stock > 10 ? 'in-stock' : 'low-stock'}>
              {product.stock > 10 ? `✓ In Stock (${product.stock} available)` : `⚠ Only ${product.stock} left!`}
            </span>
          </div>

          <div className="detail-quantity">
            <p>Quantity:</p>
            <div className="quantity-controls">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
            </div>
          </div>

          <div className="detail-actions">
            <button
              className={`add-btn ${added ? 'added' : ''}`}
              onClick={handleAddToCart}
            >
              {added ? '✓ Added to Cart!' : 'Add to Cart 🛒'}
            </button>
            <button className="buy-btn" onClick={() => { handleAddToCart(); navigate('/cart'); }}>
              Buy Now →
            </button>
          </div>

          <div className="detail-meta">
            <div className="meta-item">
              <span className="meta-label">Category</span>
              <span className="meta-value">{product.category}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Rating</span>
              <span className="meta-value">{product.rating}/5 ⭐</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Stock</span>
              <span className="meta-value">{product.stock} units</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;