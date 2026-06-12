import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const S = {
  input: { width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' },
  card: { background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #f0e8ff', boxShadow: '0 2px 12px rgba(108,99,255,0.06)' },
};

function Admin() {
  const [loggedIn,     setLoggedIn]     = useState(false);
  const [loginForm,    setLoginForm]    = useState({ email: '', password: '' });
  const [loginError,   setLoginError]   = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab,    setActiveTab]    = useState('products');
  const [productList,  setProductList]  = useState([]);
  const [orderList,    setOrderList]    = useState([]);
  const [analytics,    setAnalytics]    = useState(null);
  const [userList,     setUserList]     = useState([]);
  const [productStats, setProductStats] = useState(null);
  const [editingId,    setEditingId]    = useState(null);
  const [editForm,     setEditForm]     = useState({});
  const [showAddForm,  setShowAddForm]  = useState(false);
  const [newProduct,   setNewProduct]   = useState({ name: '', price: '', originalPrice: '', category: 'Electronics', icon: '📦', stock: 100 });
  const [deleteConfirm,setDeleteConfirm]= useState(null);

  useEffect(() => {
    if (loggedIn) {
      fetchProducts();
      fetchOrders();
      fetchAnalytics();
      fetchUsers();
      fetchProductStats();
    }
  }, [loggedIn]);

  const fetchProducts = async () => {
    const res  = await fetch(`${API_URL}/products?limit=50`);
    const data = await res.json();
    setProductList(data.products || []);
  };

  const fetchOrders = async () => {
    const res  = await fetch(`${API_URL}/orders`);
    const data = await res.json();
    setOrderList(data.orders || []);
  };

  const fetchAnalytics = async () => {
    try {
      const res  = await fetch(`${API_URL}/orders/analytics`);
      const data = await res.json();
      if (data.success) setAnalytics(data.analytics);
    } catch (e) { console.error('Analytics fetch error:', e); }
  };

  // Fetch all registered users from MongoDB
  const fetchUsers = async () => {
    try {
      const res  = await fetch(`${API_URL}/auth/users`);
      const data = await res.json();
      if (data.success) setUserList(data.users || []);
    } catch (e) { console.error('Users fetch error:', e); }
  };

  // Fetch product stats aggregation pipeline results
  const fetchProductStats = async () => {
    try {
      const res  = await fetch(`${API_URL}/products/stats`);
      const data = await res.json();
      if (data.success) setProductStats(data);
    } catch (e) { console.error('Product stats error:', e); }
  };

  // FIX (Bug): Admin login now calls backend API instead of hardcoded check
  const handleLogin = async () => {
    setLoginLoading(true);
    setLoginError('');
    try {
      const res  = await fetch(`${API_URL}/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: loginForm.email, password: loginForm.password }),
      });
      const data = await res.json();
      if (data.success && data.user.role === 'admin') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setLoggedIn(true);
        setLoginError('');
      } else if (data.success && data.user.role !== 'admin') {
        setLoginError('Access denied — admin account required!');
      } else {
        setLoginError(data.message || 'Invalid email or password!');
      }
    } catch (e) {
      setLoginError('Server se connection nahi ho raha!');
    } finally {
      setLoginLoading(false);
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
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(editForm),
    });
    setEditingId(null);
    fetchProducts();
  };

  const handleAddProduct = async () => {
    await fetch(`${API_URL}/products`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        ...newProduct,
        price:         parseFloat(newProduct.price),
        originalPrice: parseFloat(newProduct.originalPrice),
        stock:         parseInt(newProduct.stock),
        rating: 4, reviews: 0, isActive: true,
      }),
    });
    setShowAddForm(false);
    setNewProduct({ name: '', price: '', originalPrice: '', category: 'Electronics', icon: '📦', stock: 100 });
    fetchProducts();
  };

  const handleUpdateOrderStatus = async (id, status) => {
    await fetch(`${API_URL}/orders/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status }),
    });
    fetchOrders();
    fetchAnalytics();
  };

  // ── Login Screen ───────────────────────────────────────────
  if (!loggedIn) {
    return (
      <div style={{ minHeight: 'calc(100vh - 144px)', background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1040 50%, #0f2040 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(233,69,96,0.2), transparent)', borderRadius: '50%', top: '-80px', right: '-60px', filter: 'blur(60px)' }}></div>
        <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(108,99,255,0.2), transparent)', borderRadius: '50%', bottom: '-60px', left: '-60px', filter: 'blur(60px)' }}></div>
        <div style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: '28px', padding: '48px', width: '100%', maxWidth: '420px', backdropFilter: 'blur(20px)', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{ width: '72px', height: '72px', background: 'rgba(233,69,96,0.15)', border: '1.5px solid rgba(233,69,96,0.3)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '0 auto 20px' }}>⚙️</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#fff', marginBottom: '8px' }}>Admin Login</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>ShopEase Dashboard</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '8px' }}>EMAIL</label>
              <input type="email" placeholder="admin@shopease.com" value={loginForm.email}
                onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                style={S.input} />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '8px' }}>PASSWORD</label>
              <input type="password" placeholder="Enter password" value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                style={S.input} />
            </div>
            {loginError && (
              <div style={{ background: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.3)', color: '#e94560', padding: '12px 16px', borderRadius: '10px', fontSize: '13px' }}>{loginError}</div>
            )}
            <button onClick={handleLogin} disabled={loginLoading} style={{ background: 'linear-gradient(135deg, #e94560, #c73652)', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 8px 24px rgba(233,69,96,0.35)', opacity: loginLoading ? 0.7 : 1 }}>
              {loginLoading ? 'Logging in...' : 'Login to Dashboard →'}
            </button>
            <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.25)', marginTop: '4px' }}>
              admin@shopease.com / admin123
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Dashboard ──────────────────────────────────────────────
  const totalRevenue = analytics?.totals?.totalRevenue || 0;

  return (
    <div style={{ minHeight: 'calc(100vh - 144px)', background: 'linear-gradient(160deg, #fdf6ff 0%, #fff0f5 40%, #f0f4ff 100%)', padding: '40px 48px' }}>

      {/* Delete Modal */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '40px', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: '#1a1a2e', marginBottom: '12px' }}>Are you sure?</h3>
            <p style={{ color: '#6b7280', marginBottom: '28px', fontSize: '14px' }}>
              "<strong>{deleteConfirm.name}</strong>" will be permanently deleted!
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ padding: '12px 24px', borderRadius: '10px', border: '1px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm._id)} style={{ padding: '12px 24px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #e94560, #c73652)', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Yes, Delete!</button>
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
                { label: 'Product Name',       key: 'name',          type: 'text',   placeholder: 'e.g. Gaming Mouse' },
                { label: 'Icon (Emoji)',        key: 'icon',          type: 'text',   placeholder: 'e.g. 🖱️' },
                { label: 'Price ($)',           key: 'price',         type: 'number', placeholder: 'e.g. 49.99' },
                { label: 'Original Price ($)',  key: 'originalPrice', type: 'number', placeholder: 'e.g. 79.99' },
                { label: 'Stock',               key: 'stock',         type: 'number', placeholder: 'e.g. 100' },
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
                  <option>Electronics</option><option>Fashion</option><option>Home</option><option>Sports</option>
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

      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#1a1a2e', marginBottom: '6px' }}>
            Admin <span style={{ color: '#e94560' }}>Dashboard</span>
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>Manage your ShopEase store</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {activeTab === 'products' && (
            <button onClick={() => setShowAddForm(true)} style={{ background: 'linear-gradient(135deg, #1a1a2e, #2d2060)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
              + Add Product
            </button>
          )}
          <button onClick={() => setLoggedIn(false)} style={{ background: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.3)', color: '#e94560', padding: '12px 20px', borderRadius: '12px', cursor: 'pointer', fontSize: '14px' }}>
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total Products',   value: productList.length,                                          icon: '📦', color: '#6c63ff' },
          { label: 'Total Orders',     value: orderList.length,                                            icon: '🛒', color: '#e94560' },
          { label: 'Total Revenue',    value: `$${totalRevenue.toFixed(2)}`,                               icon: '💰', color: '#10b981' },
          { label: 'Pending Orders',   value: orderList.filter(o => o.status === 'pending').length,        icon: '⏳', color: '#f5a623' },
        ].map(stat => (
          <div key={stat.label} style={S.card}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: stat.color, fontFamily: "'Playfair Display', serif" }}>{stat.value}</div>
            <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {['products', 'orders', 'analytics', 'users'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '10px 24px', borderRadius: '30px', border: 'none', cursor: 'pointer',
            fontSize: '14px', fontWeight: '600', fontFamily: "'DM Sans', sans-serif",
            background: activeTab === tab ? 'linear-gradient(135deg, #1a1a2e, #2d2060)' : '#fff',
            color:      activeTab === tab ? '#fff' : '#6b7280',
            boxShadow:  activeTab === tab ? '0 4px 14px rgba(26,26,46,0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
            textTransform: 'capitalize',
          }}>
            {tab === 'products'  && `📦 Products (${productList.length})`}
            {tab === 'orders'    && `🛒 Orders (${orderList.length})`}
            {tab === 'analytics' && `📊 Analytics`}
            {tab === 'users'     && `👥 Users (${userList.length})`}
          </button>
        ))}
      </div>

      {/* ── Products Tab ─────────────────────────────────────── */}
      {activeTab === 'products' && (
        <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #f0e8ff', boxShadow: '0 4px 24px rgba(108,99,255,0.06)', overflow: 'hidden' }}>
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
                      <td style={{ padding: '12px 20px' }}>
                        <span style={{ color: p.stock < 10 ? '#e94560' : '#059669', fontWeight: '600', fontSize: '14px' }}>{p.stock}</span>
                      </td>
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
      )}

      {/* ── Orders Tab ───────────────────────────────────────── */}
      {activeTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orderList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px', background: '#fff', borderRadius: '20px', color: '#9ca3af' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
              <p style={{ fontSize: '18px' }}>No orders yet!</p>
            </div>
          ) : (
            orderList.map(order => (
              <div key={order._id} style={{ background: '#fff', borderRadius: '20px', border: '1px solid #f0e8ff', boxShadow: '0 2px 12px rgba(108,99,255,0.06)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: 'linear-gradient(135deg, #faf9ff, #fff5f8)', borderBottom: '1px solid #f3f4f6' }}>
                  <div>
                    <p style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '15px', marginBottom: '4px' }}>
                      Order #{order._id.toString().slice(-8).toUpperCase()}
                    </p>
                    <p style={{ fontSize: '13px', color: '#9ca3af' }}>{order.customerName} — {order.customerEmail}</p>
                    <p style={{ fontSize: '12px', color: '#9ca3af' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a2e', marginBottom: '8px' }}>
                      ${order.totalAmount?.toFixed(2)}
                    </p>
                    <select value={order.status} onChange={e => handleUpdateOrderStatus(order._id, e.target.value)}
                      style={{ padding: '6px 12px', borderRadius: '20px', border: '1.5px solid #e5e7eb', fontSize: '13px', fontWeight: '600', cursor: 'pointer', outline: 'none',
                        background: order.status === 'delivered' ? '#d1fae5' : order.status === 'shipped' ? '#dbeafe' : order.status === 'processing' ? '#fef3c7' : order.status === 'cancelled' ? '#fee2e2' : '#f3f4f6',
                        color:      order.status === 'delivered' ? '#065f46' : order.status === 'shipped' ? '#1e40af' : order.status === 'processing' ? '#92400e' : order.status === 'cancelled' ? '#991b1b' : '#374151',
                      }}>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div style={{ padding: '16px 24px' }}>
                  {order.items?.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', borderBottom: '1px solid #f9f9f9' }}>
                      <span style={{ fontSize: '24px' }}>{item.icon}</span>
                      <span style={{ flex: 1, fontSize: '14px', color: '#1a1a2e', fontWeight: '500' }}>{item.name}</span>
                      <span style={{ fontSize: '13px', color: '#9ca3af' }}>x{item.quantity}</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e' }}>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '12px 24px', background: '#faf9ff', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '24px', fontSize: '13px', color: '#6b7280' }}>
                  <span>📍 {order.shippingAddress?.street}, {order.shippingAddress?.city}</span>
                  <span>💳 {order.paymentMethod?.replace(/_/g, ' ')}</span>
                  <span>📞 {order.customerPhone}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Analytics Tab (NEW) ──────────────────────────────── */}
      {activeTab === 'analytics' && analytics && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              { label: 'Total Revenue',    value: `$${(analytics.totals?.totalRevenue || 0).toFixed(2)}`,   icon: '💰', color: '#10b981' },
              { label: 'Total Orders',     value: analytics.totals?.totalOrders || 0,                        icon: '🛒', color: '#6c63ff' },
              { label: 'Avg Order Value',  value: `$${(analytics.totals?.avgOrderValue || 0).toFixed(2)}`,  icon: '📈', color: '#e94560' },
              { label: 'Paid Orders',      value: analytics.totals?.paidOrders || 0,                         icon: '✅', color: '#f5a623' },
            ].map(s => (
              <div key={s.label} style={S.card}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{s.icon}</div>
                <div style={{ fontSize: '22px', fontWeight: '700', color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

            {/* Orders by Status */}
            <div style={S.card}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#1a1a2e', marginBottom: '16px' }}>📊 Orders by Status</h3>
              {analytics.statusStats?.map(s => {
                const maxCount = Math.max(...analytics.statusStats.map(x => x.count));
                const pct = maxCount > 0 ? (s.count / maxCount) * 100 : 0;
                const colors = { pending: '#f5a623', processing: '#6c63ff', shipped: '#3b82f6', delivered: '#10b981', cancelled: '#e94560' };
                return (
                  <div key={s._id} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: '#374151', textTransform: 'capitalize' }}>{s._id}</span>
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>{s.count} orders — ${s.totalRevenue.toFixed(2)}</span>
                    </div>
                    <div style={{ height: '8px', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: colors[s._id] || '#6c63ff', borderRadius: '4px', transition: 'width 0.5s ease' }}></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Top Products */}
            <div style={S.card}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#1a1a2e', marginBottom: '16px' }}>🏆 Top Selling Products</h3>
              {analytics.topProducts?.length === 0 && (
                <p style={{ color: '#9ca3af', fontSize: '14px' }}>No sales data yet — place some orders!</p>
              )}
              {analytics.topProducts?.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ width: '28px', height: '28px', background: i === 0 ? '#fef3c7' : i === 1 ? '#f3f4f6' : '#fde8d8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: i === 0 ? '#d97706' : i === 1 ? '#6b7280' : '#c2410c' }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a2e', margin: 0 }}>{p.productName}</p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{p.totalSold} units sold</p>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#10b981' }}>${p.totalRevenue}</span>
                </div>
              ))}
            </div>

            {/* Payment Methods */}
            <div style={S.card}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#1a1a2e', marginBottom: '16px' }}>💳 Payment Methods</h3>
              {analytics.paymentStats?.map(p => {
                const labels = { cash_on_delivery: '💵 Cash on Delivery', card: '💳 Card', jazzcash: '📱 JazzCash', easypaisa: '📱 EasyPaisa' };
                const total  = analytics.paymentStats.reduce((s, x) => s + x.count, 0);
                const pct    = total > 0 ? Math.round((p.count / total) * 100) : 0;
                return (
                  <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{ fontSize: '14px', color: '#374151' }}>{labels[p._id] || p._id}</span>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: '#9ca3af' }}>{p.count} orders</span>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#6c63ff', background: 'rgba(108,99,255,0.1)', padding: '2px 8px', borderRadius: '20px' }}>{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Category Stats from products */}
            <div style={S.card}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#1a1a2e', marginBottom: '16px' }}>📦 Category Overview</h3>
              {['Electronics', 'Fashion', 'Home', 'Sports'].map(cat => {
                const catProducts = productList.filter(p => p.category === cat);
                const lowStock    = catProducts.filter(p => p.stock < 10).length;
                return (
                  <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a2e' }}>{cat}</span>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#9ca3af' }}>{catProducts.length} products</span>
                      {lowStock > 0 && (
                        <span style={{ fontSize: '11px', background: '#fee2e2', color: '#dc2626', padding: '2px 6px', borderRadius: '10px', fontWeight: '600' }}>
                          {lowStock} low stock
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && !analytics && (
        <div style={{ textAlign: 'center', padding: '80px', background: '#fff', borderRadius: '20px', color: '#9ca3af' }}>
          Loading analytics...
        </div>
      )}

      {/* ── Users Tab ────────────────────────────────────────── */}
      {activeTab === 'users' && (
        <div>
          {/* Product Stats from aggregation pipeline */}
          {productStats && (
            <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #f0e8ff', boxShadow: '0 4px 24px rgba(108,99,255,0.06)', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#1a1a2e', marginBottom: '16px' }}>
                📊 Product Stats <span style={{ fontSize: '13px', fontWeight: '400', color: '#9ca3af' }}>(MongoDB Aggregation Pipeline)</span>
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
                {[
                  { label: 'Total Products',    value: productStats.summary?.totalProducts || 0,          color: '#6c63ff' },
                  { label: 'Avg Price',          value: `$${productStats.summary?.avgPrice || 0}`,         color: '#e94560' },
                  { label: 'Stock Value',        value: `$${productStats.summary?.totalStockValue || 0}`,  color: '#10b981' },
                  { label: 'Low Stock Items',    value: productStats.summary?.lowStockCount || 0,          color: '#f5a623' },
                ].map(s => (
                  <div key={s.label} style={{ background: '#faf9ff', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#faf9ff' }}>
                    {['Category', 'Products', 'Avg Price', 'Total Stock', 'Avg Rating'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid #f3f4f6' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(productStats.categoryStats || []).map((cat, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f9f9f9' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: 'rgba(108,99,255,0.1)', color: '#6c63ff', fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px' }}>{cat.category}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#1a1a2e' }}>{cat.totalProducts}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#10b981', fontWeight: '600' }}>${cat.avgPrice}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#1a1a2e' }}>{cat.totalStock}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ color: '#f5a623' }}>{'★'.repeat(Math.round(cat.avgRating))}</span>
                        <span style={{ fontSize: '12px', color: '#9ca3af', marginLeft: '4px' }}>{cat.avgRating}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Users Table */}
          <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #f0e8ff', boxShadow: '0 4px 24px rgba(108,99,255,0.06)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#1a1a2e', margin: 0 }}>
                👥 Registered Users
              </h3>
              <span style={{ fontSize: '13px', color: '#9ca3af' }}>{userList.length} total users</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#faf9ff' }}>
                  {['#', 'Name', 'Email', 'Role', 'Joined'].map(h => (
                    <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#9ca3af', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid #f3f4f6' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {userList.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>No users found</td></tr>
                ) : userList.map((u, i) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: '#9ca3af' }}>{i + 1}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #6c63ff, #e94560)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '13px' }}>
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a2e' }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: '#6b7280' }}>{u.email}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px',
                        background: u.role === 'admin' ? 'rgba(233,69,96,0.1)' : 'rgba(108,99,255,0.1)',
                        color:      u.role === 'admin' ? '#e94560' : '#6c63ff',
                      }}>
                        {u.role === 'admin' ? '⚙️ Admin' : '👤 Customer'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: '#9ca3af' }}>
                      {new Date(u.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
