import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

function Checkout() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setOrderPlaced(true);
    
    // Email notification simulate karo
    setTimeout(() => {
      alert(`📧 Order confirmation sent to ${email}`);
      navigate('/home');
    }, 2000);
  };

  if (orderPlaced) {
    return (
      <div className="checkout-success">
        <div className="success-box">
          <h1>🎉 Order Placed!</h1>
          <p>Confirmation email sent to {email}</p>
          <p>Thank you for shopping with ShopEase!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-box">
        <h2>📦 Checkout</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="John Doe" required />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="john@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Address</label>
            <input type="text" placeholder="123 Main St" required />
          </div>
          
          <div className="form-group">
            <label>Phone</label>
            <input type="tel" placeholder="+92 300 1234567" required />
          </div>

          <button type="submit" className="place-order-btn">
            Place Order & Send Email
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;