import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar({ cartCount }) {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/home">Shop<span>Ease</span></Link>
      </div>
      <div className="navbar-links">
        <Link to="/home" className={location.pathname === '/home' ? 'active' : ''}>Home</Link>
        <Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>Products</Link>
        <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>Login</Link>
        <Link to="/signup" className="signup-link">Sign Up</Link>
        <Link to="/cart" className="cart-link">
          🛒 <span className="cart-badge">{cartCount}</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;