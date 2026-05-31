import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RoleSelection.css';

function RoleSelection() {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 2800);
    const t2 = setTimeout(() => {
      setShowWelcome(false);
      setTimeout(() => setAnimateCards(true), 100);
    }, 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (showWelcome) {
    return (
      <div className={`splash-screen ${fadeOut ? 'splash-fade' : ''}`}>
        <div className="splash-orb orb1"></div>
        <div className="splash-orb orb2"></div>
        <div className="splash-orb orb3"></div>
        <div className="splash-center">
          <div className="splash-badge">✦ EST. 2026 ✦</div>
          <div className="splash-icon-wrap">
            <span className="splash-icon">🛍️</span>
          </div>
          <h1 className="splash-title">
            <span className="splash-shop">Shop</span><span className="splash-ease">Ease</span>
          </h1>
          <p className="splash-sub">Premium Shopping Experience</p>
          <div className="splash-loader">
            <div className="loader-bar"></div>
          </div>
        </div>
        <p className="splash-credits">
          ✦ Ayesha Arif &nbsp;·&nbsp; Rabia Sohail &nbsp;·&nbsp; Minahil Khan ✦
        </p>
      </div>
    );
  }

  return (
    <div className={`select-page ${animateCards ? 'visible' : ''}`}>

      {/* TOP HERO BANNER */}
      <div className="select-hero">
        <div className="hero-orb h1"></div>
        <div className="hero-orb h2"></div>
        <div className="hero-text">
          <span className="hero-eyebrow">✦ Welcome to</span>
          <h1>Shop<span>Ease</span></h1>
          <p>Your modern e-commerce destination — shop smarter, live better.</p>
        </div>
        <div className="hero-stats">
          <div className="hstat"><span className="hnum">28+</span><span className="hlabel">Products</span></div>
          <div className="hstat"><span className="hnum">4</span><span className="hlabel">Categories</span></div>
          <div className="hstat"><span className="hnum">100%</span><span className="hlabel">Satisfaction</span></div>
        </div>
      </div>

      {/* ROLE CARDS */}
      <div className="select-cards-section">
        <p className="select-prompt">— Choose your role to continue —</p>
        <div className="select-cards-row">

          <div className="role-tile customer-tile" onClick={() => navigate('/home')}>
            <div className="tile-glow cust-glow"></div>
            <div className="tile-icon-wrap cust-icon-bg">
              <span>🛍️</span>
            </div>
            <div className="tile-content">
              <h2>Customer</h2>
              <p>Discover & shop premium products from our curated collections.</p>
              <ul>
                <li>✓ Browse all products</li>
                <li>✓ Add to cart & checkout</li>
                <li>✓ Track your orders</li>
              </ul>
            </div>
            <div className="tile-btn cust-btn">Continue as Customer →</div>
          </div>

          <div className="role-tile admin-tile" onClick={() => navigate('/admin')}>
            <div className="tile-glow admin-glow"></div>
            <div className="tile-icon-wrap admin-icon-bg">
              <span>⚙️</span>
            </div>
            <div className="tile-content">
              <h2>Admin</h2>
              <p>Manage your store, monitor orders and track sales performance.</p>
              <ul>
                <li>✓ Manage products</li>
                <li>✓ View all orders</li>
                <li>✓ Sales dashboard</li>
              </ul>
            </div>
            <div className="tile-btn admin-btn">Login as Admin →</div>
          </div>

        </div>
        <p className="select-footer">ShopEase · IST Islamabad · 2026</p>
      </div>

    </div>
  );
}

export default RoleSelection;
