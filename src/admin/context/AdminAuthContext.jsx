/**
 * ==============================================================================
 * ADMIN AUTHENTICATION CONTEXT (src/admin/context/AdminAuthContext.jsx)
 * ==============================================================================
 * Student / Developer Guide:
 * This context manages the global state of the logged-in administrator.
 * 
 * Features:
 * - On initial app load or page refresh, it automatically calls `GET /api/auth/me`
 *   to check if the user has an active HttpOnly session cookie.
 * - If valid, sets `admin` state with their profile.
 * - Provides `login(email, password)` and `logout()` methods.
 * - Exposes `useAdminAuth()` hook for easy access in any admin component.
 * ==============================================================================
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Verifies existing session with backend via HttpOnly cookie.
   */
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get('/api/auth/me');
      if (data && data.success && data.admin) {
        setAdmin(data.admin);
      } else {
        setAdmin(null);
      }
    } catch {
      // 401 or network error means user is not authenticated
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check authentication status on initial mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * Log in with email and password
   * @param {string} email
   * @param {string} password
   */
  const login = async (email, password) => {
    try {
      setError(null);
      const data = await api.post('/api/auth/login', { email, password });
      if (data && data.success && data.admin) {
        setAdmin(data.admin);
        return { success: true, message: data.message };
      }
      return { success: false, message: 'Login failed' };
    } catch (err) {
      const message = err.data?.message || err.message || 'Login failed. Please check your credentials.';
      setError(message);
      return { success: false, message };
    }
  };

  /**
   * Log out and clear session cookie
   */
  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      console.warn('Logout request warning:', err.message);
    } finally {
      setAdmin(null);
      setError(null);
    }
  };

  const value = {
    admin,
    isAuthenticated: Boolean(admin),
    loading,
    error,
    login,
    logout,
    checkAuth
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

/**
 * Custom hook to consume the AdminAuthContext
 */
export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

export default AdminAuthContext;

