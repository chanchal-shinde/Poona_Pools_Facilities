import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import PublicLayout from './components/PublicLayout';

// Dedicated Customer Application Pages
import Home from './pages/Home';
import Services from './pages/Services';
import SwimmingPools from './pages/SwimmingPools';
import GetQuote from './pages/GetQuote';
import About from './pages/About';
import Contact from './pages/Contact';

// Admin Subsystem
import { AdminAuthProvider } from './admin/context/AdminAuthContext';
import ProtectedRoute from './admin/components/ProtectedRoute';
import AdminLayout from './admin/components/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminServices from './admin/pages/AdminServices';
import AdminPoolCategories from './admin/pages/AdminPoolCategories';
import AdminPoolDesigns from './admin/pages/AdminPoolDesigns';
import AdminPricing from './admin/pages/AdminPricing';
import AdminInquiries from './admin/pages/AdminInquiries';
import AdminSettings from './admin/pages/AdminSettings';
import AdminContent from './admin/pages/AdminContent';
import AdminPlaceholder from './admin/pages/AdminPlaceholder';

export default function App() {
  return (
    <BrowserRouter>
      {/* Scroll window to top on route change */}
      <ScrollToTop />

      {/* Global Administrative Authentication Provider */}
      <AdminAuthProvider>
        <Routes>
          {/* ============================================================== */}
          {/* 1. PUBLIC CUSTOMER WEBSITE (Includes Navbar, Footer & WhatsApp) */}
          {/* ============================================================== */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/pools" element={<SwimmingPools />} />
            <Route path="/quote" element={<GetQuote />} />
            <Route path="/get-quote" element={<Navigate to="/quote" replace />} />
            <Route path="/get-a-quote" element={<Navigate to="/quote" replace />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* ============================================================== */}
          {/* 2. ADMIN LOGIN PORTAL (Isolated layout)                        */}
          {/* ============================================================== */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ============================================================== */}
          {/* 3. PROTECTED ADMIN DASHBOARD (Requires authenticated session)  */}
          {/* ============================================================== */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />

            {/* Module B: Services Management (Phase 4A) */}
            <Route path="services" element={<AdminServices />} />
            {/* Module C: Pool Categories & Designs (Phase 4B) */}
            <Route path="pool-categories" element={<AdminPoolCategories />} />
            <Route path="pool-designs" element={<AdminPoolDesigns />} />

            {/* Module D: Pricing Engine & Cost Estimator (Phase 4C) */}
            <Route path="pricing" element={<AdminPricing />} />
            {/* Module E: Inquiry Management (Phase 5) */}
            <Route path="inquiries" element={<AdminInquiries />} />
            {/* Module F: Business Settings (Phase 4D) */}
            <Route path="settings" element={<AdminSettings />} />

            {/* Module G: Website Content (Phase 4D) */}
            <Route path="content" element={<AdminContent />} />
          </Route>

          {/* ============================================================== */}
          {/* 4. CATCH-ALL ROUTE (Redirect unknown URLs to Home)             */}
          {/* ============================================================== */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
