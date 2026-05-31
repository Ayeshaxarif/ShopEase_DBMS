const API_URL = 'http://localhost:5000/api';

export const getProducts = async (category = '') => {
  const url = category ? `${API_URL}/products?category=${category}` : `${API_URL}/products`;
  const res = await fetch(url);
  const data = await res.json();
  return data.products;
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return await res.json();
};

export const signupUser = async (name, email, password) => {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  return await res.json();
};

export const placeOrder = async (orderData) => {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  return await res.json();
};