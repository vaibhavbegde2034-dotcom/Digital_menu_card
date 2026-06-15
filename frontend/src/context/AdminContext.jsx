import { createContext, useState, useContext } from 'react';
import api from '../api/axios';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const fetchAllData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setLoading(true);
      const [adminRes, foodsRes, catRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/foods'),
        api.get('/categories')
      ]);
      setAdmin(adminRes.data);
      setFoods(foodsRes.data);
      setCategories(catRes.data);
      setInitialLoadDone(true);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        setAdmin(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshFoods = async () => {
    try {
      const res = await api.get('/foods');
      setFoods(res.data);
    } catch (err) {
      console.error('Error refreshing foods:', err);
    }
  };

  const refreshCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Error refreshing categories:', err);
    }
  };

  const refreshAdmin = async () => {
    try {
      const res = await api.get('/auth/me');
      setAdmin(res.data);
    } catch (err) {
      console.error('Error refreshing admin:', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAdmin(null);
    setFoods([]);
    setCategories([]);
    setInitialLoadDone(false);
  };

  // Check if subscription is valid
  const isSubscriptionActive = () => {
    if (!admin) return false;
    if (admin.isSuperAdmin) return true;
    const expired = admin.subscriptionEndDate && new Date() > new Date(admin.subscriptionEndDate);
    return admin.isActive && !expired;
  };

  return (
    <AdminContext.Provider value={{ 
      admin, foods, categories, loading, initialLoadDone, isSubscriptionActive,
      fetchAllData, refreshFoods, refreshCategories, refreshAdmin, logout 
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
