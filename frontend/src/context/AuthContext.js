import React, { createContext, useState, useContext } from 'react';
import { loginUser, signupUser } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Read from localStorage on startup (same key as Login.js uses)
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // FIX: login now calls the real backend API instead of hardcoded DEMO_USERS
  const login = async (email, password) => {
    const data = await loginUser(email, password);
    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
    }
    return data;
  };

  // FIX: signup also calls the real backend API
  const signup = async (name, email, password) => {
    const data = await signupUser(name, email, password);
    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const isAdmin    = () => user?.role === 'admin';
  const isLoggedIn = () => !!user;

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAdmin, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
