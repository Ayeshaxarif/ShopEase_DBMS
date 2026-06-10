import React from 'react';
import { Link } from 'react-router-dom';

function OrderConfirmation({ orderId }) {
  const id = orderId || localStorage.getItem('lastOrderId') || 'N/A';

  return (
    <div style={{
      minHeight: 'calc(100vh - 144px)',
      background: 'linear-gradient(135deg, #0f0f1a, #1a1040)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1.5px solid rgba(255,255,255,0.12)',
        borderRadius: '28px', padding: '56px 48px',
        maxWidth: '520px', width: '100%',
        textAlign: 'center', backdropFilter: 'blur(20px)',
      }}>
        {/* Success Icon */}
        <div style={{
          width: '96px', height: '96px',
          background: 'rgba(16,185,129,0.15)',
          border: '2px solid rgba(16,185,129,0.4)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '48px', margin: '0 auto 28px',
        }}>✅</div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '36px', color: '#fff',
          marginBottom: '12px',
        }}>Order Confirmed!</h1>

        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', marginBottom: '32px' }}>
          Thankyou Your order has been placed successfully....
        </p>

        {/* Order ID Box */}
        <div style={{
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '16px', padding: '20px', marginBottom: '32px',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Order ID
          </p>
          <p style={{ color: '#fff', fontSize: '18px', fontWeight: '700', fontFamily: 'monospace', margin: 0 }}>
            #{typeof id === 'string' ? id.slice(-12).toUpperCase() : 'CONFIRMED'}
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '36px', textAlign: 'left' }}>
          {[
            { icon: '📦', label: 'Order Received',    sub: 'Your order is being processed',   done: true },
            { icon: '🔄', label: 'Processing',         sub: 'We are preparing your items',     done: false },
            { icon: '🚚', label: 'Out for Delivery',   sub: 'Your order is on the way',        done: false },
            { icon: '🎉', label: 'Delivered',           sub: 'Enjoy your purchase!',            done: false },
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', borderRadius: '12px', background: step.done ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${step.done ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}` }}>
              <span style={{ fontSize: '24px' }}>{step.icon}</span>
              <div>
                <p style={{ color: step.done ? '#10b981' : 'rgba(255,255,255,0.7)', fontWeight: '600', fontSize: '14px', margin: 0 }}>{step.label}</p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', margin: 0 }}>{step.sub}</p>
              </div>
              {step.done && <span style={{ marginLeft: 'auto', color: '#10b981', fontWeight: '700' }}>✓</span>}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/orders" style={{ flex: 1, padding: '14px', borderRadius: '14px', background: 'linear-gradient(135deg, #e94560, #c73652)', color: '#fff', textDecoration: 'none', fontWeight: '600', fontSize: '15px', display: 'block', textAlign: 'center' }}>
            View My Orders
          </Link>
          <Link to="/products" style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1.5px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontWeight: '600', fontSize: '15px', display: 'block', textAlign: 'center' }}>
            Shop More
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
