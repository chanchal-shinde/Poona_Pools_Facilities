/**
 * ==============================================================================
 * ADMIN MODULE PLACEHOLDER (src/admin/pages/AdminPlaceholder.jsx)
 * ==============================================================================
 * Student / Developer Guide:
 * Serves as an informative placeholder for modules to be built in Phase 4 & 5.
 * ==============================================================================
 */

import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminPlaceholder({ title, moduleName, description }) {
  return (
    <div className="admin-card p-4 p-md-5 text-center">
      <div
        className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary"
        style={{ width: '64px', height: '64px' }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <span className="badge bg-light text-primary border mb-2 px-3 py-2 fw-semibold">
        {moduleName || 'Upcoming Module'}
      </span>
      <h1 className="h3 fw-bold text-dark mb-2">{title}</h1>
      <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '520px' }}>
        {description || 'This management module will be connected to MongoDB Atlas in Phase 4.'}
      </p>

      <div className="d-flex justify-content-center gap-2">
        <Link to="/admin/dashboard" className="btn btn-primary px-4 py-2">
          Back to Dashboard Overview
        </Link>
      </div>
    </div>
  );
}

