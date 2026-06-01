import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer style={{
      background: '#1a1a2e',
      color: 'rgba(255,255,255,0.6)',
      padding: '40px 64px 28px',
      fontSize: '14px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            color: '#fff',
            fontSize: '24px',
            marginBottom: '8px'
          }}>
            Shop<span style={{ color: '#e94560' }}>Ease</span>
          </p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', maxWidth: '260px', lineHeight: '1.6' }}>
            A modern e-commerce platform built with MongoDB, Express, React & Node.js.
          </p>
        </div>

        <div>
          <p style={{ color: '#fff', fontWeight: '600', marginBottom: '12px', fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase' }}>Quick Links</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { to: '/home', label: 'Home' },
              { to: '/products', label: 'Products' },
              { to: '/cart', label: 'Cart' },
              { to: '/login', label: 'Login' },
            ].map(link => (
              <Link key={link.to} to={link.to} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}
                onMouseOver={e => e.target.style.color = '#e94560'}
                onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.5)'}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p style={{ color: '#fff', fontWeight: '600', marginBottom: '12px', fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase' }}>Technologies</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['MongoDB', 'Express.js', 'React.js', 'Node.js'].map(tech => (
              <span key={tech} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>⚡ {tech}</span>
            ))}
          </div>
        </div>

        <div>
          <p style={{ color: '#fff', fontWeight: '600', marginBottom: '12px', fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase' }}>Project Team</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { name: 'Ayesha Arif', id: '240201039' },
              { name: 'Rabia Sohail', id: '240201059' },
              { name: 'Minahil Khan', id: '240201087' },
            ].map(member => (
              <div key={member.id}>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '500' }}>{member.name}</p>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>{member.id}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingTop: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <p>© 2026 ShopEase DBMS — Institute of Space Technology, Islamabad</p>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
          Built with ❤️ using MERN Stack
        </p>
      </div>
    </footer>
  );
}

export default Footer;