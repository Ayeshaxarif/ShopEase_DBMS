import React from 'react';

function Footer() {
  return (
    <footer style={{
      background: '#1a1a2e',
      color: 'rgba(255,255,255,0.6)',
      textAlign: 'center',
      padding: '28px 20px',
      fontSize: '14px'
    }}>
      <p style={{
        fontFamily: "'Playfair Display', serif",
        color: '#e94560',
        fontSize: '18px',
        marginBottom: '8px'
      }}>
        ShopEase
      </p>
      <p>© 2025 ShopEase DBMS — Institute of Space Technology, Islamabad</p>
    </footer>
  );
}

export default Footer;