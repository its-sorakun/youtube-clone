import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ytclone_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('ytclone_token', token);
      
      // Restore cached user profile on page refresh to avoid an extra /me API request.
      const savedUser = localStorage.getItem('ytclone_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('ytclone_token');
      localStorage.removeItem('ytclone_user');
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = (tokenData, userData) => {
    setToken(tokenData);
    setUser(userData);
    localStorage.setItem('ytclone_user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
