import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

const DEMO_USERS = [
  {
    email: 'ayesha@shopease.com',
    password: 'admin123',
    name: 'Ayesha',
    role: 'admin'
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('shopease_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    const found = DEMO_USERS.find(u => u.email === email && u.password === password);
    
    if (found) {
      const userData = { email: found.email, name: found.name, role: found.role };
      localStorage.setItem('shopease_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    }
    
    return { success: false, message: 'Invalid email or password' };
  };

  const logout = () => {
    localStorage.removeItem('shopease_user');
    setUser(null);
  };

  const isAdmin = () => user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);