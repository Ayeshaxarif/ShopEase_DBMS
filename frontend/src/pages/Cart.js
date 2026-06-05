import React from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';

function Cart({ cart, removeFromCart, updateQuantity }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Helper: get correct id whether from MongoDB (_id) or local (id)
  const getId = (item) => item._id || item.id;

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
        <Link to="/products" className="continue-btn">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="cart-title">Your Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.map(item => (
            // FIX: use getId(item) instead of item.id
            <div className="cart-item" key={getId(item)}>
              <div className="cart-item-icon">{item.icon}</div>
              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-category">{item.category}</div>
              </div>
              <div className="cart-item-controls">
                {/* FIX: use getId(item) instead of item.id */}
                <button onClick={() => updateQuantity(getId(item), item.quantity - 1)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(getId(item), item.quantity + 1)}>+</button>
              </div>
              <div className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</div>
              {/* FIX: use getId(item) instead of item.id */}
              <button className="remove-btn" onClick={() => removeFromCart(getId(item))}>✕</button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span style={{ color: '#16a34a' }}>Free</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Link to="/checkout" className="checkout-btn">Proceed to Checkout →</Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
