/**
 * ==============================================================================
 * ADMIN LOGIN PAGE (src/admin/pages/AdminLogin.jsx)
 * ==============================================================================
 * Student / Developer Guide:
 * The dedicated, secure login portal for the business owner.
 * 
 * Features:
 * - Email & Password validation.
 * - Show/Hide password toggle.
 * - Loading indicator while waiting for backend verification.
 * - Displays clear, user-friendly error banners on invalid credentials.
 * - Redirects to /admin/dashboard on successful login.
 * - If already logged in, automatically redirects to /admin/dashboard.
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import '../admin.css';

export default function AdminLogin() {
  const { admin, login, loading: authLoading } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Target destination after successful login
  const from = location.state?.from?.pathname || '/admin/dashboard';

  // If already authenticated, redirect straight to dashboard
  useEffect(() => {
    if (!authLoading && admin) {
      navigate(from, { replace: true });
    }
  }, [admin, authLoading, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // 1. Client-Side Validation
    if (!email.trim()) {
      setFormError('Please enter your administrator email address.');
      return;
    }
    if (!password) {
      setFormError('Please enter your account password.');
      return;
    }

    // 2. Perform Login Request
    setSubmitting(true);
    const result = await login(email.trim(), password);
    setSubmitting(false);

    if (result.success) {
      // Redirect to dashboard on success
      navigate(from, { replace: true });
    } else {
      setFormError(result.message || 'Invalid credentials. Please verify your email and password.');
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 p-3"
      style={{ backgroundColor: '#0f172a' }}
    >
      <div className="w-100" style={{ maxWidth: '440px' }}>
        {/* Brand Header */}
        <div className="text-center mb-4">
          <div
            className="rounded-4 mx-auto mb-3 d-flex align-items-center justify-content-center shadow"
            style={{ width: '60px', height: '60px', backgroundColor: '#0284c7', color: '#fff' }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M2 6c3-2 6 2 9 0s6-2 9 0" />
              <path d="M2 12c3-2 6 2 9 0s6-2 9 0" />
              <path d="M2 18c3-2 6 2 9 0s6-2 9 0" />
            </svg>
          </div>
          <h1 className="h4 fw-bold text-white mb-1">Poona Pools Facilities</h1>
          <p className="text-secondary small mb-0">Secure Administrator Portal</p>
        </div>

        {/* Login Card */}
        <div className="card shadow-lg border-0 rounded-4 p-4 p-sm-5 bg-white">
          <div className="mb-4">
            <h2 className="h5 fw-bold text-dark mb-1">Sign In to Dashboard</h2>
            <p className="text-muted small mb-0">
              Enter your credentials to manage site content, inquiries, and pricing.
            </p>
          </div>

          {/* Error Alert Banner */}
          {formError && (
            <div className="alert alert-danger d-flex align-items-start gap-2 py-2 px-3 rounded-3 mb-4" role="alert">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-1">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div className="small">{formError}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <div className="mb-3">
              <label htmlFor="adminEmail" className="form-label fw-semibold text-dark small">
                Email Address
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted border-end-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  type="email"
                  id="adminEmail"
                  className="form-control form-control-lg border-start-0 fs-6"
                  placeholder="admin@poonapools.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (formError) setFormError('');
                  }}
                  autoComplete="email"
                  disabled={submitting}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label htmlFor="adminPassword" className="form-label fw-semibold text-dark small">
                Password
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted border-end-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="adminPassword"
                  className="form-control form-control-lg border-start-0 border-end-0 fs-6"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (formError) setFormError('');
                  }}
                  autoComplete="current-password"
                  disabled={submitting}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary border-start-0 bg-white"
                  onClick={() => setShowPassword((prev) => !prev)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
              style={{ backgroundColor: '#0284c7', borderColor: '#0284c7' }}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Security Note */}
          <div className="mt-4 pt-3 border-top text-center">
            <small className="text-muted d-block">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Protected by encrypted HttpOnly session cookies.
            </small>
          </div>
        </div>

        {/* Return to Public Website */}
        <div className="text-center mt-4">
          <Link to="/" className="text-secondary text-decoration-none small hover-underline d-inline-flex align-items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Return to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

