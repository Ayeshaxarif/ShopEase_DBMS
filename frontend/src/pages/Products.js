import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import './Products.css';

const API_URL = 'http://localhost:5000/api';

function Products({ addToCart }) {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [search,         setSearch]         = useState('');
  const [searchInput,    setSearchInput]    = useState('');
  const [products,       setProducts]       = useState([]);
  const [loading,        setLoading]        = useState(true);


  const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Sports'];

  // FIX: fetch from backend with category AND search params
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeCategory !== 'All') params.set('category', activeCategory);
      // FIX: send search to backend for MongoDB $text search
      if (search.trim()) params.set('search', search.trim());

      const res  = await fetch(`${API_URL}/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Debounce search: wait 400ms after user stops typing before calling backend
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>All <span style={{ color: '#e94560' }}>Products</span></h1>
        <input
          className="search-input"
          placeholder="Search products..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
        />
      </div>

      <div className="filter-tabs">
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Show result count when searching */}
      {search && !loading && (
        <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '16px', paddingLeft: '4px' }}>
          {products.length} result{products.length !== 1 ? 's' : ''} for "<strong>{search}</strong>"
        </p>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px', color: '#9ca3af' }}>
          Loading products...
        </div>
      ) : (
        <div className="products-grid-page">
          {products.length > 0 ? products.map(p => (
            <ProductCard key={p._id} product={p} addToCart={addToCart} />
          )) : (
            <p className="no-results">No products found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Products;

