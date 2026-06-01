import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

function Checkout({ cart }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    street: '', city: '', country: 'Pakistan',
    paymentMethod: 'cash_on_delivery'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const orderData = {
        userId: user.id || 'guest',
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        items: cart.map(item => ({
          productId: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          icon: item.icon
        })),
        totalAmount: total,
        shippingAddress: {
          street: form.street,
          city: form.city,
          country: form.country
        },
        paymentMethod: form.paymentMethod,
        status: 'pending',
        isPaid: false,
        createdAt: new Date()
      };

      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => navigate('/home'), 3000);
      } else {
        setError('Order place karne mein problem aayi!');
      }
    } catch (err) {
      setError('Server se connection nahi ho raha!');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 144px)',
        background: 'linear-gradient(135deg, #0f0f1a, #1a1040)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <div style={{ fontSize: '80px', marginBottom: '24px' }}>🎉</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', marginBottom: '16px' }}>Order Placed!</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', marginBottom: '8px' }}>Aapka order successfully place ho gaya!</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Home page par redirect ho raha hai...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-form-section">
          <h1>Checkout</h1>
          <form onSubmit={handleSubmit}>
            <div className="checkout-section">
              <h3>👤 Personal Info</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" placeholder="Your name" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="you@example.com" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="text" placeholder="03XX-XXXXXXX" value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })} required />
              </div>
            </div>

            <div className="checkout-section">
              <h3>📦 Shipping Address</h3>
              <div className="form-group">
                <label>Street Address</label>
                <input type="text" placeholder="House #, Street, Area" value={form.street}
                  onChange={e => setForm({ ...form, street: e.target.value })} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input type="text" placeholder="Islamabad" value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input type="text" value={form.country}
                    onChange={e => setForm({ ...form, country: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="checkout-section">
              <h3>💳 Payment Method</h3>
              <div className="payment-options">
                {[
                  { value: 'cash_on_delivery', label: '💵 Cash on Delivery' },
                  { value: 'card', label: '💳 Credit/Debit Card' },
                  { value: 'jazzcash', label: '📱 JazzCash' },
                  { value: 'easypaisa', label: '📱 EasyPaisa' },
                ].map(opt => (
                  <label key={opt.value} className={`payment-option ${form.paymentMethod === opt.value ? 'active' : ''}`}>
                    <input type="radio" name="payment" value={opt.value}
                      checked={form.paymentMethod === opt.value}
                      onChange={e => setForm({ ...form, paymentMethod: e.target.value })} />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <button type="submit" className="place-order-btn" disabled={loading}>
              {loading ? 'Placing Order...' : `Place Order — $${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {cart.map(item => (
            <div key={item._id || item.id} className="checkout-item">
              <span className="checkout-item-icon">{item.icon}</span>
              <div className="checkout-item-info">
                <p>{item.name}</p>
                <span>x{item.quantity}</span>
              </div>
              <span className="checkout-item-price">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="checkout-divider"></div>
          <div className="checkout-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;