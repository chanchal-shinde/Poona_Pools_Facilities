import React from 'react';
import { Link } from 'react-router-dom';
import { siteConfig, getPhoneLink } from '../config/siteConfig';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row g-4">
          {/* Column 1: Organization Overview */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="brand-icon-box" style={{ width: '38px', height: '38px' }} aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M2 6c3-2 6 2 9 0s6-2 9 0" />
                  <path d="M2 12c3-2 6 2 9 0s6-2 9 0" />
                  <path d="M2 18c3-2 6 2 9 0s6-2 9 0" />
                </svg>
              </div>
              <h3 className="h5 mb-0" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-deep-blue)' }}>
                {siteConfig.organizationName}
              </h3>
            </div>

            <p className="text-secondary" style={{ fontSize: '0.925rem', lineHeight: '1.6' }}>
              Specialized swimming pool engineering, durable concrete shell construction, multi-stage water filtration plants, waterproofing, and preventative maintenance solutions.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links-list">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/services">Services Overview</Link>
              </li>
              <li>
                <Link to="/pools">Pool Gallery &amp; Types</Link>
              </li>
              <li>
                <Link to="/quote">Get a Quote</Link>
              </li>
              <li>
                <Link to="/about">About Us &amp; Leadership</Link>
              </li>
              <li>
                <Link to="/contact">Contact Information</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Specialized Services */}
          <div className="col-lg-3 col-md-6">
            <h4 className="footer-heading">Services</h4>
            <ul className="footer-links-list">
              <li>
                <Link to="/services">Pool Construction</Link>
              </li>
              <li>
                <Link to="/services">Filtration Systems</Link>
              </li>
              <li>
                <Link to="/services">Routine Maintenance</Link>
              </li>
              <li>
                <Link to="/services">Pool Renovation &amp; Tiling</Link>
              </li>
              <li>
                <Link to="/services">Structural Waterproofing</Link>
              </li>
              <li>
                <Link to="/services">Pool Equipment &amp; Accessories</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Location */}
          <div className="col-lg-3 col-md-6">
            <h4 className="footer-heading">Business Office</h4>

            <div className="footer-contact-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <strong className="d-block" style={{ color: 'var(--color-deep-blue)' }}>Location:</strong>
                <span>{siteConfig.contact.address}</span>
                <span className="d-block text-secondary">{siteConfig.contact.cityState}</span>
              </div>
            </div>

            <div className="footer-contact-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <div>
                <strong className="d-block" style={{ color: 'var(--color-deep-blue)' }}>Telephone:</strong>
                <a href={getPhoneLink()}>{siteConfig.contact.displayPhone}</a>
              </div>
            </div>

            <div className="footer-contact-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <div>
                <strong className="d-block" style={{ color: 'var(--color-deep-blue)' }}>Email:</strong>
                <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Copyright & Configurable Notice */}
        <div className="footer-bottom-bar d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <p className="mb-0 text-secondary">
            &copy; {currentYear} {siteConfig.organizationName}. All rights reserved.
          </p>
          <p className="mb-0 text-secondary text-center text-md-end" style={{ fontSize: '0.8rem' }}>
            Built for professional swimming pool engineering &amp; maintenance facilities.
          </p>
        </div>
      </div>
    </footer>
  );
}
