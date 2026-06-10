import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 144px)',
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1040 50%, #0f2040 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(233,69,96,0.15), transparent)',
        borderRadius: '50%', top: '-100px', right: '-80px', filter: 'blur(60px)'
      }}></div>
      <div style={{
        position: 'absolute', width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(108,99,255,0.15), transparent)',
        borderRadius: '50%', bottom: '-60px', left: '-60px', filter: 'blur(60px)'
      }}></div>

      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '120px',
          color: '#e94560',
          lineHeight: 1,
          marginBottom: '16px'
        }}>404</div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '32px',
          color: '#fff',
          marginBottom: '16px'
        }}>Page Not Found</h2>
        <p style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: '16px',
          marginBottom: '40px',
          maxWidth: '400px'
        }}>
          This page doesnt exist!
        </p>
        <Link to="/home" style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #e94560, #c73652)',
          color: '#fff',
          padding: '14px 36px',
          borderRadius: '50px',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '15px',
          boxShadow: '0 8px 24px rgba(233,69,96,0.35)',
          transition: 'all 0.25s'
        }}>
          Go Home →
        </Link>
      </div>
    </div>
  );
}

export default NotFound;