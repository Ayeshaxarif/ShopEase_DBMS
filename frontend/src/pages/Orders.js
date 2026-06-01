import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Orders.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.id) {
          setLoading(false);
          return;
        }
        const res = await fetch(`http://localhost:5000/api/orders/user/${user.id}`);
        const data = await res.json();
        if (data.success) setOrders(data.orders);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!user.id) {
    return (
      <div className="orders-page">
        <div className="orders-empty">
          <div className="empty-icon">🔐</div>
          <h2>Login Required</h2>
          <p>Apne orders dekhne ke liye login karein</p>
          <Link to="/login" className="orders-login-btn">Login →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>My <span>Orders</span></h1>
        <p>Aapke saare orders yahan hain</p>
      </div>

      {loading ? (
        <div className="orders-loading">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="orders-empty">
          <div className="empty-icon">📦</div>
          <h2>Koi order nahi hai abhi</h2>
          <p>Shopping shuru karein!</p>
          <Link to="/products" className="orders-login-btn">Shop Now →</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <div>
                  <p className="order-id">Order #{order._id.toString().slice(-8).toUpperCase()}</p>
                  <p className="order-date">{new Date(order.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="order-right">
                  <span className={`order-status ${order.status}`}>{order.status}</span>
                  <p className="order-total">${order.totalAmount.toFixed(2)}</p>
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item, i) => (
                  <div key={i} className="order-item">
                    <span className="order-item-icon">{item.icon}</span>
                    <div className="order-item-info">
                      <p>{item.name}</p>
                      <span>x{item.quantity} — ${item.price}</span>
                    </div>
                    <span className="order-item-total">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="order-card-footer">
                <div className="order-address">
                  📍 {order.shippingAddress?.street}, {order.shippingAddress?.city}
                </div>
                <div className="order-payment">
                  💳 {order.paymentMethod?.replace(/_/g, ' ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;