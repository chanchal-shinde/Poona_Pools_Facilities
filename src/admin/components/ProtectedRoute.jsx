/**
 * ==============================================================================
 * PROTECTED ROUTE COMPONENT (src/admin/components/ProtectedRoute.jsx)
 * ==============================================================================
 * Student / Developer Guide:
 * This component guards administrative routes (/admin/*).
 * 
 * Logic:
 * 1. While the session check is in progress (`loading === true`), displays
 *    a clean loading indicator.
 * 2. If the user is NOT authenticated (`!admin`), redirects them to
 *    the admin login page (/admin/login) while preserving their intended location.
 * 3. If authenticated, renders the protected child components.
 * ==============================================================================
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center vh-100"
        style={{ backgroundColor: '#f8fafc' }}
      >
        <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="fw-semibold text-secondary mb-1">Verifying Admin Session</h5>
        <p className="text-muted small">Connecting securely to Poona Pools backend...</p>
      </div>
    );
  }

  if (!admin) {
    // Redirect to login page and remember where the user was trying to go
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}

