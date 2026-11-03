/**
 * ==============================================================================
 * ADMIN SIDEBAR NAVIGATION (src/admin/components/AdminSidebar.jsx)
 * ==============================================================================
 * Student / Developer Guide:
 * Renders the persistent side navigation for the Admin Dashboard.
 * Supports desktop sticky layout and mobile off-canvas drawer.
 * ==============================================================================
 */

import React from 'react';
import { NavLink } from 'react-router-dom';

export default function AdminSidebar({ isOpen, onClose }) {
  const navItems = [
    {
      to: '/admin/dashboard',
      label: 'Overview',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      )
    },
    {
      to: '/admin/inquiries',
      label: 'Customer Inquiries',
      badge: 'Module E',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )
    },
    {
      to: '/admin/feedback',
      label: 'Customer Feedback',
      badge: 'Reviews',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )
    },
    {
      to: '/admin/services',
      label: 'Services',
      badge: 'Module B',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      )
    },
    {
      to: '/admin/pool-categories',
      label: 'Pool Categories',
      badge: 'Module C',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      )
    },
    {
      to: '/admin/pool-designs',
      label: 'Pool Designs',
      badge: 'Module C',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      )
    },
    {
      to: '/admin/pricing',
      label: 'Pricing & Multipliers',
      badge: 'Module D',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      )
    },
    {
      to: '/admin/settings',
      label: 'Business Settings',
      badge: 'Module F',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
    },
    {
      to: '/admin/content',
      label: 'Website Content',
      badge: 'Module G',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="admin-sidebar-backdrop d-lg-none"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar */}
      <aside className={`admin-sidebar d-flex flex-column ${isOpen ? 'show' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div
            className="rounded-3 d-flex align-items-center justify-content-center"
            style={{ width: '36px', height: '36px', backgroundColor: '#0284c7', color: '#fff' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M2 6c3-2 6 2 9 0s6-2 9 0" />
              <path d="M2 12c3-2 6 2 9 0s6-2 9 0" />
              <path d="M2 18c3-2 6 2 9 0s6-2 9 0" />
            </svg>
          </div>
          <div className="lh-sm">
            <div className="fw-bold fs-6">Poona Pools</div>
            <small className="text-secondary" style={{ fontSize: '0.75rem' }}>Admin Control Panel</small>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="section-label">Management Modules</div>
        <nav className="nav flex-column py-2 flex-grow-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span className="flex-grow-1">{item.label}</span>
              {item.badge && (
                <span className="badge rounded-pill bg-dark text-secondary border border-secondary border-opacity-25" style={{ fontSize: '0.65rem' }}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Quick Links */}
        <div className="p-3 border-top border-secondary border-opacity-25 mt-auto">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline-light w-100 d-flex align-items-center justify-content-center gap-2 py-2"
            style={{ fontSize: '0.85rem' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            <span>View Live Customer Site</span>
          </a>
        </div>
      </aside>
    </>
  );
}

