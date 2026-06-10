import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './ProductDetail.css';

const API_URL = 'http://localhost:5000/api';

function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product,  setProduct]  = useState(null);
  const [related,  setRelated]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [added,    setAdded]    = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res  = await fetch(`${API_URL}/products/${id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.product);
          // Fetch related products (same category)
          const rel = await fetch(`${API_URL}/products?category=${data.product.category}&limit=4`);
          const relData = await rel.json();
          setRelated((relData.products || []).filter(p => p._id !== id).slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discount = product?.originalPrice > product?.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  const stars = product
    ? '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating))
    : '';

  // Sample reviews for display
  const sampleReviews = [
    { name: 'Ali Hassan',    rating: 5, comment: 'Excellent product! Highly recommended.', date: '2 days ago' },
    { name: 'Sara Khan',     rating: 4, comment: 'Good quality, fast delivery.',           date: '1 week ago' },
    { name: 'Usman Malik',   rating: 4, comment: 'Worth the price. Very satisfied.',       date: '2 weeks ago' },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: 'calc(100vh - 144px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg, #fdf6ff, #fff0f5, #f0f4ff)' }}>
        <p style={{ color: '#9ca3af', fontSize: '18px' }}>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: 'calc(100vh - 144px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg, #fdf6ff, #fff0f5, #f0f4ff)' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '64px', marginBottom: '16px' }}>😕</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#1a1a2e', marginBottom: '12px' }}>Product not found!</h2>
          <button onClick={() => navigate('/products')} style={{ background: '#e94560', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '30px', cursor: 'pointer', fontSize: '15px' }}>
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'linear-gradient(160deg, #fdf6ff, #fff0f5, #f0f4ff)', minHeight: 'calc(100vh - 144px)', padding: '32px 48px' }}>

      {/* Breadcrumb */}
      <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '24px' }}>
        <Link to="/home" style={{ color: '#9ca3af', textDecoration: 'none' }}>Home</Link>
        <span> / </span>
        <Link to="/products" style={{ color: '#9ca3af', textDecoration: 'none' }}>Products</Link>
        <span> / </span>
        <Link to={`/products?category=${product.category}`} style={{ color: '#9ca3af', textDecoration: 'none' }}>{product.category}</Link>
        <span> / </span>
        <span style={{ color: '#1a1a2e' }}>{product.name}</span>
      </div>

      {/* Main Product Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 4px 24px rgba(108,99,255,0.08)', marginBottom: '32px' }}>

        {/* Left — Image */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          <div style={{ width: '100%', aspectRatio: '1', background: 'linear-gradient(135deg, #fdf6ff, #f0f4ff)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <span style={{ fontSize: '140px' }}>{product.icon}</span>
            {discount > 0 && (
              <span style={{ position: 'absolute', top: '16px', right: '16px', background: 'linear-gradient(135deg, #e94560, #c73652)', color: '#fff', fontSize: '14px', fontWeight: '700', padding: '6px 14px', borderRadius: '20px' }}>
                {discount}% OFF
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
            {['✓ Free Delivery', '✓ Easy Returns', '✓ Secure Pay'].map(tag => (
              <span key={tag} style={{ flex: 1, textAlign: 'center', fontSize: '12px', background: 'rgba(108,99,255,0.08)', color: '#6c63ff', padding: '8px', borderRadius: '10px', fontWeight: '500' }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Right — Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#6c63ff', background: 'rgba(108,99,255,0.1)', padding: '4px 12px', borderRadius: '20px', letterSpacing: '0.05em' }}>
              {product.category}
            </span>
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#1a1a2e', margin: 0, lineHeight: 1.3 }}>
            {product.name}
          </h1>

          {/* Stars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#f5a623', fontSize: '20px', letterSpacing: '2px' }}>{stars}</span>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>{product.rating}/5</span>
            <span style={{ fontSize: '14px', color: '#9ca3af' }}>({product.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '36px', fontWeight: '700', color: '#1a1a2e', fontFamily: "'Playfair Display', serif" }}>
              ${product.price.toFixed(2)}
            </span>
            {discount > 0 && (
              <>
                <span style={{ fontSize: '20px', color: '#9ca3af', textDecoration: 'line-through' }}>
                  ${product.originalPrice.toFixed(2)}
                </span>
                <span style={{ fontSize: '14px', background: '#d1fae5', color: '#065f46', padding: '4px 10px', borderRadius: '20px', fontWeight: '600' }}>
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              </>
            )}
          </div>

          {/* Stock */}
          <div style={{ padding: '12px 16px', borderRadius: '12px', background: product.stock > 10 ? '#d1fae5' : '#fee2e2', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>{product.stock > 10 ? '✅' : '⚠️'}</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: product.stock > 10 ? '#065f46' : '#991b1b' }}>
              {product.stock > 10 ? `In Stock — ${product.stock} units available` : `Only ${product.stock} left!`}
            </span>
          </div>

          {/* Quantity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Quantity:</span>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                style={{ padding: '10px 16px', border: 'none', background: '#f9fafb', cursor: 'pointer', fontSize: '18px', color: '#374151' }}>−</button>
              <span style={{ padding: '10px 20px', fontSize: '16px', fontWeight: '600', color: '#1a1a2e', borderLeft: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb' }}>{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                style={{ padding: '10px 16px', border: 'none', background: '#f9fafb', cursor: 'pointer', fontSize: '18px', color: '#374151' }}>+</button>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleAddToCart}
              style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '2px solid #1a1a2e', background: added ? '#1a1a2e' : 'transparent', color: added ? '#fff' : '#1a1a2e', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>
              {added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
            </button>
            <button onClick={() => { handleAddToCart(); navigate('/cart'); }}
              style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #e94560, #c73652)', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 14px rgba(233,69,96,0.35)' }}>
              Buy Now →
            </button>
          </div>

          {/* Meta */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', padding: '16px', background: '#faf9ff', borderRadius: '12px' }}>
            {[
              { label: 'Category', value: product.category },
              { label: 'Rating',   value: `${product.rating}/5 ⭐` },
              { label: 'Reviews',  value: `${product.reviews}+` },
            ].map(m => (
              <div key={m.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{m.label}</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e' }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs — Description & Reviews */}
      <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 24px rgba(108,99,255,0.08)', marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid #f3f4f6', paddingBottom: '0' }}>
          {['description', 'reviews'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '10px 24px', border: 'none', background: 'transparent', cursor: 'pointer',
              fontSize: '14px', fontWeight: '600', textTransform: 'capitalize',
              color: activeTab === tab ? '#e94560' : '#9ca3af',
              borderBottom: activeTab === tab ? '2px solid #e94560' : '2px solid transparent',
              marginBottom: '-2px',
            }}>
              {tab === 'description' ? '📋 Description' : `⭐ Reviews (${product.reviews})`}
            </button>
          ))}
        </div>

        {activeTab === 'description' && (
          <div>
            <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: 1.8, marginBottom: '20px' }}>
              {product.description || `${product.name} is a premium quality product from our ${product.category} collection. Designed for everyday use with exceptional durability and performance. Perfect for those who value quality and style.`}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                '✓ Premium Quality Materials',
                '✓ 1 Year Warranty',
                '✓ Free Shipping on all orders',
                '✓ Easy 30-day Returns',
                '✓ 24/7 Customer Support',
                '✓ Secure & Safe Packaging',
              ].map(f => (
                <div key={f} style={{ fontSize: '14px', color: '#374151', padding: '10px 14px', background: '#f9fafb', borderRadius: '10px' }}>{f}</div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {sampleReviews.map((r, i) => (
              <div key={i} style={{ padding: '20px', background: '#faf9ff', borderRadius: '14px', border: '1px solid #f0e8ff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #6c63ff, #e94560)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '14px' }}>
                      {r.name.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontWeight: '600', color: '#1a1a2e', fontSize: '14px', margin: 0 }}>{r.name}</p>
                      <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0 }}>{r.date}</p>
                    </div>
                  </div>
                  <span style={{ color: '#f5a623', fontSize: '16px' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                </div>
                <p style={{ color: '#6b7280', fontSize: '14px', margin: 0, lineHeight: 1.6 }}>{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 24px rgba(108,99,255,0.08)' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#1a1a2e', marginBottom: '24px' }}>
            Related <span style={{ color: '#e94560' }}>Products</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {related.map(p => (
              <Link to={`/product/${p._id}`} key={p._id} style={{ textDecoration: 'none' }}>
                <div style={{ padding: '20px', border: '1px solid #f0e8ff', borderRadius: '16px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', background: '#faf9ff' }}>
                  <div style={{ fontSize: '56px', marginBottom: '12px' }}>{p.icon}</div>
                  <p style={{ fontWeight: '600', color: '#1a1a2e', fontSize: '14px', marginBottom: '4px' }}>{p.name}</p>
                  <p style={{ color: '#e94560', fontWeight: '700', fontSize: '16px', margin: 0 }}>${p.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
