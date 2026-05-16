import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [foodPartner, setFoodPartner] = useState(null);
  const [role, setRole] = useState(null); // 'user' | 'food-partner' | null

  
  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        { withCredentials: true }
      );
      const { role: r, user: u, foodPartner: fp } = res.data;
      setRole(r || null);
      setUser(u || null);
      setFoodPartner(fp || null);
    } catch {
      
      setRole(null);
      setUser(null);
      setFoodPartner(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  
  const setAuth = ({ role: r, user: u, foodPartner: fp }) => {
    setRole(r || null);
    setUser(u || null);
    setFoodPartner(fp || null);
  };

  
  const logout = () => {
    setRole(null);
    setUser(null);
    setFoodPartner(null);
  };

  return (
    <AuthContext.Provider value={{ isLoading, user, foodPartner, role, setAuth, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;