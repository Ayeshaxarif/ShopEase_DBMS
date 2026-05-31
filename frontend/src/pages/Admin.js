import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [productList, setProductList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', originalPrice: '', category: 'Electronics', icon: '📦', stock: 100 });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (loggedIn) fetchProducts();
  }, [loggedIn]);

  const fetchProducts = async () => {
    const res = await fetch(`${API_URL}/products`);
    const data = await res.json();
    setProductList(data.products || []);
  };

  const handleLogin = () => {
    if (loginForm.email === 'admin@shopease.com' && loginForm.password === 'admin123') {
      setLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid email or password!');
    }
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
    setDeleteConfirm(null);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setEditForm({ ...product });
  };

  const handleSave = async () => {
    await fetch(`${API_URL}/products/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm)
    });
    setEditingId(null);
    fetchProducts();
  };

  const handleAddProduct = async () => {
    await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newProduct,
        price: parseFloat(newProduct.price),
        originalPrice: parseFloat(newProduct.originalPrice),
        stock: parseInt(newProduct.stock),
        rating: 4,
        reviews: 0,
        isActive: true
      })
    });
    setShowAddForm(false);
    setNewProduct({ name: '', price: '', originalPrice: '', category: 'Electronics', icon: '📦', stock: 100 });
    fetchProducts();
  };

  if (!loggedIn) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 144px)',
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1040 50%, #0f2040 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 20px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', width: '350px', height: '350px',
          background: 'radial-gradient(circle, rgba(233,69,96,0.2), transparent)',
          borderRadius: '50%', top: '-80px', right: '-60px', filter: 'blur(60px)'
        }}></div>
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1.5px solid rgba(255,255,255,0.12)',
          borderRadius: '28px', padding: '48px', width: '100%', maxWidth: '420px',
          backdropFilter: 'blur(20px)', position: 'relative', zIndex: 1
        }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{
              width: '72px', height: '72px',
              background: 'rgba(233,69,96,0.15)',
              border: '1.5px solid rgba(233,69,96,0.3)',
              borderRadius: '20px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '36px', margin: '0 auto 20px'
            }}>⚙️</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#fff', marginBottom: '8px' }}>Admin Login</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>ShopEase Dashboard</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '8px' }}>EMAIL</label>
              <input type="email" placeholder="admin@shopease.com" value={loginForm.email}
                onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                style={{ width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '8px' }}>PASSWORD</label>
              <input type="password" placeholder="Enter password" value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                style={{ width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' }} />
            </div>
            {loginError && (
              <div style={{ background: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.3)', color: '#e94560', padding: '12px 16px', borderRadius: '10px', fontSize: '13px' }}>{loginError}</div>
            )}
            <button onClick={handleLogin} style={{ background: 'linear-gradient(135deg, #e94560, #c73652)', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 8px 24px rgba(233,69,96,0.35)' }}>
              Login to Dashboard →
            </button>
            <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.25)', marginTop: '4px' }}>
              Hint: admin@shopease.com / admin123
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 144px)', background: 'linear-gradient(160deg, #fdf6ff 0%, #fff0f5 40%, #f0f4ff 100%)', padding: '40px 48px' }}>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '40px', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: '#1a1a2e', marginBottom: '12px' }}>Are you sure?</h3>
            <p style={{ color: '#6b7280', marginBottom: '28px', fontSize: '14px' }}>
              "<strong>{deleteConfirm.name}</strong>" will be permanently deleted!
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ padding: '12px 24px', borderRadius: '10px', border: '1px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm._id)} style={{ padding: '12px 24px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #e94560, #c73652)', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                Yes, Delete!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '40px', maxWidth: '480px', width: '90%' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#1a1a2e', marginBottom: '24px' }}>Add New Product</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Product Name', key: 'name', type: 'text', placeholder: 'e.g. Gaming Mouse' },
                { label: 'Icon (Emoji)', key: 'icon', type: 'text', placeholder: 'e.g. 🖱️' },
                { label: 'Price ($)', key: 'price', type: 'number', placeholder: 'e.g. 49.99' },
                { label: 'Original Price ($)', key: 'originalPrice', type: 'number', placeholder: 'e.g. 79.99' },
                { label: 'Stock', key: 'stock', type: 'number', placeholder: 'e.g. 100' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '6px' }}>{field.label}</label>
                  <input type={field.type} placeholder={field.placeholder} value={newProduct[field.key]}
                    onChange={e => setNewProduct({ ...newProduct, [field.key]: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '6px' }}>Category</label>
                <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none' }}>
                  <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Home</option>
                  <option>Sports</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button onClick={() => setShowAddForm(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
                <button onClick={handleAddProduct} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #1a1a2e, #2d2060)', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Add Product ✓</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#1a1a2e', marginBottom: '6px' }}>
            Admin <span style={{ color: '#e94560' }}>Dashboard</span>
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>Manage your ShopEase products</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setShowAddForm(true)} style={{ background: 'linear-gradient(135deg, #1a1a2e, #2d2060)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
            + Add Product
          </button>
          <button onClick={() => setLoggedIn(false)} style={{ background: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.3)', color: '#e94560', padding: '12px 20px', borderRadius: '12px', cursor: 'pointer', fontSize: '14px' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #f0e8ff', boxShadow: '0 4px 24px rgba(108,99,255,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '24px 28px', borderBottom: '1px solid #f3f4f6' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#1a1a2e' }}>
            Products ({productList.length})
          </h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#faf9ff' }}>
              {['Icon', 'Name', 'Price', 'Category', 'Stock', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid #f3f4f6' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {productList.map((p, i) => (
              <tr key={p._id} style={{ borderBottom: '1px solid #f9f9f9', background: i % 2 === 0 ? '#fff' : '#fefefe' }}>
                {editingId === p._id ? (
                  <>
                    <td style={{ padding: '12px 20px', fontSize: '28px' }}>{p.icon}</td>
                    <td style={{ padding: '12px 20px' }}>
                      <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                        style={{ padding: '8px 12px', border: '1.5px solid #e94560', borderRadius: '8px', fontSize: '14px', width: '160px' }} />
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <input value={editForm.price} type="number" onChange={e => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
                        style={{ padding: '8px 12px', border: '1.5px solid #e94560', borderRadius: '8px', fontSize: '14px', width: '90px' }} />
                    </td>
                    <td style={{ padding: '12px 20px', color: '#6b7280', fontSize: '14px' }}>{p.category}</td>
                    <td style={{ padding: '12px 20px' }}>
                      <input value={editForm.stock} type="number" onChange={e => setEditForm({ ...editForm, stock: parseInt(e.target.value) })}
                        style={{ padding: '8px 12px', border: '1.5px solid #e94560', borderRadius: '8px', fontSize: '14px', width: '80px' }} />
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <button onClick={handleSave} style={{ background: 'linear-gradient(135deg, #43e97b, #38f9d7)', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', marginRight: '8px' }}>Save</button>
                      <button onClick={() => setEditingId(null)} style={{ background: '#f3f4f6', color: '#6b7280', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ padding: '12px 20px', fontSize: '28px' }}>{p.icon}</td>
                    <td style={{ padding: '12px 20px', fontWeight: '500', color: '#1a1a2e', fontSize: '14px' }}>{p.name}</td>
                    <td style={{ padding: '12px 20px', color: '#1a1a2e', fontSize: '14px', fontWeight: '600' }}>${p.price}</td>
                    <td style={{ padding: '12px 20px' }}>
                      <span style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.1), rgba(233,69,96,0.1))', color: '#6c63ff', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>{p.category}</span>
                    </td>
                    <td style={{ padding: '12px 20px', color: '#1a1a2e', fontSize: '14px' }}>{p.stock}</td>
                    <td style={{ padding: '12px 20px' }}>
                      <button onClick={() => handleEdit(p)} style={{ background: 'linear-gradient(135deg, #f5a623, #e8920f)', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', marginRight: '8px' }}>Edit</button>
                      <button onClick={() => setDeleteConfirm(p)} style={{ background: 'linear-gradient(135deg, #e94560, #c73652)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;