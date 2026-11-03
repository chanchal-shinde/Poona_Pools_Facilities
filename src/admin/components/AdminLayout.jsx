/**
 * ==============================================================================
 * PROTECTED ADMIN LAYOUT (src/admin/components/AdminLayout.jsx)
 * ==============================================================================
 * Student / Developer Guide:
 * The shell container for all protected administrative pages.
 * Renders the persistent sidebar, top navigation bar, and the active route's
 * component via React Router's `<Outlet />`.
 * ==============================================================================
 */

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import '../admin.css';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="d-flex admin-body">
      {/* Persistent Left Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column min-vh-100" style={{ minWidth: 0 }}>
        {/* Top Navigation Bar */}
        <AdminNavbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        {/* Dynamic Route Content */}
        <main className="flex-grow-1 p-3 p-md-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

