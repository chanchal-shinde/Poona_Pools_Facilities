import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import { SiteContentProvider } from '../context/SiteContentContext';

/**
 * ==============================================================================
 * PUBLIC WEBSITE LAYOUT (src/components/PublicLayout.jsx)
 * ==============================================================================
 * Student / Developer Guide:
 * Renders the public layout (Navbar, Footer, and WhatsApp Button) exclusively
 * for customer-facing pages (/ , /services, /pools, /quote, /about, /contact).
 * 
 * In Phase 4D:
 * Wraps all customer pages with SiteContentProvider, providing live database-driven
 * business contact settings and website content with instant static fallbacks.
 * ==============================================================================
 */
export default function PublicLayout() {
  return (
    <SiteContentProvider>
      <div className="d-flex flex-column min-vh-100">
        {/* Persistent Responsive Customer Navigation Bar */}
        <Navbar />

        {/* Dynamic Route Content for Customer Pages */}
        <main className="flex-grow-1" id="main-content">
          <Outlet />
        </main>

        {/* Persistent Corporate Footer */}
        <Footer />

        {/* Floating WhatsApp Quick-Contact Button */}
        <WhatsAppButton />
      </div>
    </SiteContentProvider>
  );
}

