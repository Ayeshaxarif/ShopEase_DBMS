import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Admin from './pages/Admin';
import Checkout from './pages/Checkout';
import ProductDetail from './pages/ProductDetail';
import RoleSelection from './components/RoleSelection';
import Orders from './pages/Orders';
import NotFound from './pages/NotFound';
import OrderConfirmation from './pages/OrderConfirmation';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [cart, setCart] = useState([]);

  // Load cart from MongoDB when user logs in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.id) {
      fetch(`${API_URL}/cart/${user.id}`)
        .then(r => r.json())
        .then(data => {
          if (data.success && data.cart?.items?.length > 0) {
            setCart(data.cart.items.map(item => ({
              ...item,
              _id: item.productId?._id || item.productId,
            })));
          }
        })
        .catch(() => {});
    }
  }, []);

  // Save cart to MongoDB whenever it changes
  const saveCartToDB = (updatedCart) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user?.id) return;
    fetch(`${API_URL}/cart/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        items: updatedCart.map(item => ({
          productId: item._id || item.id,
          name:      item.name,
          price:     item.price,
          icon:      item.icon,
          quantity:  item.quantity,
        })),
      }),
    }).catch(() => {});
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id || item.id === product.id);
      let updated;
      if (existing) {
        updated = prev.map(item =>
          (item._id === product._id || item.id === product.id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updated = [...prev, { ...product, quantity: 1 }];
      }
      saveCartToDB(updated);
      return updated;
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => {
      const updated = prev.filter(item => item._id !== id && item.id !== id);
      saveCartToDB(updated);
      return updated;
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCart(prev => {
      const updated = prev.map(item =>
        (item._id === id || item.id === id) ? { ...item, quantity } : item
      );
      saveCartToDB(updated);
      return updated;
    });
  };

  const clearCart = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.id) {
      fetch(`${API_URL}/cart/clear/${user.id}`, { method: 'DELETE' }).catch(() => {});
    }
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Router>
      <Navbar cartCount={cartCount} />
      <div className="main-content">
        <Routes>
          <Route path="/"                   element={<RoleSelection />} />
          <Route path="/home"               element={<Home addToCart={addToCart} />} />
          <Route path="/login"              element={<Login />} />
          <Route path="/signup"             element={<Signup />} />
          <Route path="/products"           element={<Products addToCart={addToCart} />} />
          <Route path="/product/:id"        element={<ProductDetail addToCart={addToCart} />} />
          <Route path="/cart"               element={<Cart cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />} />
          <Route path="/checkout"           element={<Checkout cart={cart} clearCart={clearCart} />} />
          <Route path="/orders"             element={<Orders />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/admin"              element={<Admin />} />
          <Route path="*"                   element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
