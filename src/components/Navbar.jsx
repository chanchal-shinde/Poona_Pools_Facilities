import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { siteConfig, getWhatsAppLink, getPhoneLink } from '../config/siteConfig';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu on page transition
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Swimming Pools', path: '/pools' },
    { label: 'Get a Quote', path: '/quote' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact Us', path: '/contact' }
  ];

  return (
    <>
      {/* Top Utility Contact Bar */}
      <div className="top-contact-bar d-none d-md-block">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {siteConfig.contact.cityState}
            </span>
          </div>

          <div className="d-flex align-items-center">
            <a href={getPhoneLink()} className="me-3" title="Call directly">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Tel: {siteConfig.contact.displayPhone}
            </a>
            <span className="top-contact-divider" aria-hidden="true" />
            <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-blue)', fontWeight: 600 }}>
              WhatsApp Consultation
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <nav className={`main-navbar ${scrolled ? 'scrolled' : ''}`} aria-label="Main navigation">
        <div className="container d-flex align-items-center justify-content-between">
          {/* Text-based Logo */}
          <Link to="/" className="brand-logo-text" aria-label={`${siteConfig.organizationName} Home`}>
            <div className="brand-icon-box" aria-hidden="true">
              {/* Modern Swimming Pool Waves Icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M2 6c3-2 6 2 9 0s6-2 9 0" />
                <path d="M2 12c3-2 6 2 9 0s6-2 9 0" />
                <path d="M2 18c3-2 6 2 9 0s6-2 9 0" />
              </svg>
            </div>
            <div className="brand-title-wrap">
              <span className="brand-name">
                Poona <span>Pools</span> Facilities
              </span>
              <span className="brand-tagline">Construction &amp; Maintenance</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="d-none d-lg-flex align-items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
                end={item.path === '/'}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Quick Action */}
          <div className="d-none d-lg-block">
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-custom"
            >
              <span>Contact via WhatsApp</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            className="navbar-toggler-custom d-lg-none"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              // Close icon
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              // Hamburger menu icon
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="d-lg-none border-top mt-2 pt-3 pb-3 bg-white px-3 shadow-sm">
            <div className="d-flex flex-column gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
                  end={item.path === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}

              <div className="pt-3 border-top mt-2 d-flex flex-column gap-2">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp-custom text-center"
                >
                  Chat on WhatsApp
                </a>
                <a
                  href={getPhoneLink()}
                  className="btn-secondary-custom text-center"
                >
                  Call: {siteConfig.contact.displayPhone}
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
