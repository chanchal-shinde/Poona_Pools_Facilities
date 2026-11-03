/**
 * ==============================================================================
 * ADMIN TOP NAVIGATION BAR (src/admin/components/AdminNavbar.jsx)
 * ==============================================================================
 * Student / Developer Guide:
 * Renders the top navigation bar with:
 * - Hamburger menu toggle for mobile devices.
 * - Current logged-in admin indicator.
 * - Logout button that invalidates the HttpOnly cookie.
 * ==============================================================================
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminNavbar({ onToggleSidebar }) {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out of the admin panel?')) {
      setLoggingOut(true);
      await logout();
      navigate('/admin/login', { replace: true });
    }
  };

  return (
    <header className="admin-topbar d-flex align-items-center justify-content-between">
      {/* Left: Mobile Toggle & Portal Title */}
      <div className="d-flex align-items-center gap-3">
        <button
          type="button"
          className="btn btn-outline-secondary d-lg-none p-2 lh-1"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className="d-none d-sm-block">
          <span className="text-muted small">Poona Pools Facilities</span>
          <span className="mx-2 text-muted">•</span>
          <strong className="text-dark small">Business Management Dashboard</strong>
        </div>
      </div>

      {/* Right: Authenticated Admin Profile & Logout */}
      <div className="d-flex align-items-center gap-3">
        {/* Admin Badge */}
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-circle bg-primary bg-opacity-10 text-primary fw-bold d-flex align-items-center justify-content-center"
            style={{ width: '36px', height: '36px', fontSize: '0.9rem' }}
          >
            {admin?.email ? admin.email.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="d-none d-md-block text-start lh-sm">
            <div className="fw-semibold text-dark small">{admin?.name || 'Administrator'}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>{admin?.email}</div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="btn btn-sm btn-outline-danger d-flex align-items-center gap-2 px-3 py-1 rounded-3"
          title="Sign out of administrative account"
        >
          {loggingOut ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          )}
          <span className="d-none d-sm-inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

