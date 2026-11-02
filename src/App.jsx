import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';

// Dedicated Application Pages
import Home from './pages/Home';
import Services from './pages/Services';
import SwimmingPools from './pages/SwimmingPools';
import GetQuote from './pages/GetQuote';
import About from './pages/About';
import Contact from './pages/Contact';

export default function App() {
  return (
    <BrowserRouter>
      {/* Scroll window to top on route change */}
      <ScrollToTop />

      <div className="d-flex flex-column min-vh-100">
        {/* Persistent Responsive Navigation Bar */}
        <Navbar />

        {/* Dynamic Route Content */}
        <main className="flex-grow-1" id="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/pools" element={<SwimmingPools />} />
            <Route path="/quote" element={<GetQuote />} />
            <Route path="/get-quote" element={<Navigate to="/quote" replace />} />
            <Route path="/get-a-quote" element={<Navigate to="/quote" replace />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            {/* Catch-all redirect to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Persistent Corporate Footer */}
        <Footer />

        {/* Floating WhatsApp Quick-Contact Button (Visible across all pages) */}
        <WhatsAppButton />
      </div>
    </BrowserRouter>
  );
}
