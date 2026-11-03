/**
 * ==============================================================================
 * ADMIN BUSINESS SETTINGS (src/admin/pages/AdminSettings.jsx)
 * ==============================================================================
 * Student / Developer Guide:
 * Module F: Business Settings Management
 * 
 * Capabilities:
 * - Update telephone and display phone formatting.
 * - Configure WhatsApp click-to-chat number and custom greeting message.
 * - Manage official contact email address.
 * - Edit physical business address, city/state, and service area summary.
 * - Configure Google Maps iframe embed URL with a live interactive preview.
 * ==============================================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'danger', text: '' }

  // Form State
  const [formData, setFormData] = useState({
    phone: '',
    displayPhone: '',
    whatsapp: '',
    whatsappPrefilledMessage: '',
    email: '',
    address: '',
    cityState: '',
    googleMapsEmbedUrl: '',
    locationSummary: ''
  });

  const [lastUpdatedBy, setLastUpdatedBy] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');

  // Fetch Business Settings from MongoDB Atlas
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/settings');
      if (res && res.success && res.data) {
        const d = res.data;
        setFormData({
          phone: d.phone || '',
          displayPhone: d.displayPhone || '',
          whatsapp: d.whatsapp || '',
          whatsappPrefilledMessage: d.whatsappPrefilledMessage || '',
          email: d.email || '',
          address: d.address || '',
          cityState: d.cityState || '',
          googleMapsEmbedUrl: d.googleMapsEmbedUrl || '',
          locationSummary: d.locationSummary || ''
        });
        setLastUpdatedBy(d.lastUpdatedBy || 'System');
        setUpdatedAt(d.updatedAt ? new Date(d.updatedAt).toLocaleString('en-IN') : '');
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.data?.message || err.message || 'Failed to load business settings.'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (!formData.phone.trim()) {
      setMessage({ type: 'danger', text: 'Telephone number is required.' });
      return;
    }

    const cleanWhatsapp = formData.whatsapp.replace(/[^0-9]/g, '');
    if (!cleanWhatsapp || cleanWhatsapp.length < 7) {
      setMessage({
        type: 'danger',
        text: 'A valid WhatsApp phone number with country code is required (e.g. 919923176194).'
      });
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setMessage({ type: 'danger', text: 'A valid email address is required.' });
      return;
    }

    try {
      setSaving(true);
      const res = await api.put('/api/admin/settings', {
        ...formData,
        whatsapp: cleanWhatsapp
      });

      if (res && res.success) {
        setMessage({
          type: 'success',
          text: res.message || 'Business settings saved and updated across the public website.'
        });
        setLastUpdatedBy(res.data?.lastUpdatedBy || 'Admin');
        setUpdatedAt(res.data?.updatedAt ? new Date(res.data.updatedAt).toLocaleString('en-IN') : '');
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.data?.message || err.message || 'Failed to update business settings.'
      });
    } finally {
      setSaving(false);
    }
  };

  // Build live WhatsApp test link
  const testWhatsappUrl = `https://wa.me/${formData.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    formData.whatsappPrefilledMessage
  )}`;

  return (
    <div className="admin-settings-page">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h1 className="h3 fw-bold text-dark mb-0">Business Settings</h1>
            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1 small">
              Module F
            </span>
          </div>
          <p className="text-secondary small mb-0">
            Manage public telephone numbers, WhatsApp click-to-chat, official email, and corporate location.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <a
            href="/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-2"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            <span>View Public Contact Page</span>
          </a>
        </div>
      </div>

      {/* Alert Banner */}
      {message && (
        <div
          className={`alert alert-${message.type} alert-dismissible fade show d-flex align-items-center justify-content-between shadow-sm`}
          role="alert"
        >
          <div className="d-flex align-items-center gap-2">
            {message.type === 'success' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-danger">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
            <span>{message.text}</span>
          </div>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setMessage(null)}
          />
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading settings...</span>
          </div>
          <p className="text-secondary small mt-2">Loading business settings from MongoDB Atlas...</p>
        </div>
      ) : (
        <form onSubmit={handleSave}>
          <div className="row g-4">
            {/* Left Column: Contact Channels */}
            <div className="col-12 col-lg-6">
              {/* Card 1: Phone & WhatsApp */}
              <div className="card shadow-sm border-0 rounded-3 mb-4">
                <div className="card-header bg-white py-3 border-bottom">
                  <div className="d-flex align-items-center gap-2">
                    <span className="rounded-circle p-1 bg-success bg-opacity-10 text-success">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </span>
                    <h2 className="h6 fw-bold mb-0 text-dark">1. Telephony &amp; WhatsApp Channels</h2>
                  </div>
                </div>

                <div className="card-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">
                      Dialable Phone Number (tel: link) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +91 99231 76194"
                      required
                    />
                    <small className="text-muted">Used for clickable phone call buttons on mobile.</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">
                      Display Phone Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="displayPhone"
                      value={formData.displayPhone}
                      onChange={handleChange}
                      placeholder="e.g. +91 99231 76194"
                      required
                    />
                    <small className="text-muted">Formatted text shown in header, footer, and contact cards.</small>
                  </div>

                  <hr className="my-4 text-muted opacity-25" />

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">
                      WhatsApp Number (Digits with Country Code) <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-success bg-opacity-10 text-success fw-bold">wa.me/</span>
                      <input
                        type="text"
                        className="form-control fw-semibold"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        placeholder="e.g. 919923176194"
                        required
                      />
                    </div>
                    <small className="text-muted">Include country code without '+' or dashes (India: 91...).</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">
                      WhatsApp Default Prefilled Greeting
                    </label>
                    <textarea
                      rows="3"
                      className="form-control"
                      name="whatsappPrefilledMessage"
                      value={formData.whatsappPrefilledMessage}
                      onChange={handleChange}
                      placeholder="Message automatically inserted into customer's chat box..."
                    />
                  </div>

                  {formData.whatsapp && (
                    <div className="p-3 bg-light rounded-2 border d-flex align-items-center justify-content-between">
                      <span className="small text-muted">Test your live WhatsApp integration:</span>
                      <a
                        href={testWhatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-success d-inline-flex align-items-center gap-1"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.031 2C6.495 2 2 6.495 2 12.031c0 1.967.574 3.864 1.66 5.485L2 22l4.636-1.616a9.98 9.98 0 0 0 5.395 1.564h.005c5.534 0 10.029-4.495 10.029-10.031 0-2.679-1.043-5.197-2.937-7.091A9.96 9.96 0 0 0 12.031 2z"/>
                        </svg>
                        <span>Test Click-to-Chat</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Card 2: Email Address */}
              <div className="card shadow-sm border-0 rounded-3 mb-4">
                <div className="card-header bg-white py-3 border-bottom">
                  <div className="d-flex align-items-center gap-2">
                    <span className="rounded-circle p-1 bg-primary bg-opacity-10 text-primary">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </span>
                    <h2 className="h6 fw-bold mb-0 text-dark">2. Official Email Address</h2>
                  </div>
                </div>
                <div className="card-body p-4">
                  <label className="form-label small fw-semibold text-dark">
                    Contact Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. poonapools@gmail.com"
                    required
                  />
                  <small className="text-muted">Displayed in footer and contact page; receives customer inquiries.</small>
                </div>
              </div>
            </div>

            {/* Right Column: Physical Address & Google Maps */}
            <div className="col-12 col-lg-6">
              {/* Card 3: Address & Coverage */}
              <div className="card shadow-sm border-0 rounded-3 mb-4">
                <div className="card-header bg-white py-3 border-bottom">
                  <div className="d-flex align-items-center gap-2">
                    <span className="rounded-circle p-1 bg-info bg-opacity-10 text-info">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </span>
                    <h2 className="h6 fw-bold mb-0 text-dark">3. Physical Office &amp; Service Coverage</h2>
                  </div>
                </div>

                <div className="card-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">Physical Address</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="e.g. Karve Nagar, Pune, Maharashtra"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">City &amp; State</label>
                    <input
                      type="text"
                      className="form-control"
                      name="cityState"
                      value={formData.cityState}
                      onChange={handleChange}
                      placeholder="e.g. Pune, Maharashtra, India"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">Service Area Summary</label>
                    <textarea
                      rows="2"
                      className="form-control"
                      name="locationSummary"
                      value={formData.locationSummary}
                      onChange={handleChange}
                      placeholder="e.g. Serving Pune, Pimpri-Chinchwad, and surrounding regions in Maharashtra."
                    />
                  </div>
                </div>
              </div>

              {/* Card 4: Google Maps Embed URL */}
              <div className="card shadow-sm border-0 rounded-3 mb-4">
                <div className="card-header bg-white py-3 border-bottom">
                  <div className="d-flex align-items-center gap-2">
                    <span className="rounded-circle p-1 bg-danger bg-opacity-10 text-danger">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </span>
                    <h2 className="h6 fw-bold mb-0 text-dark">4. Google Maps Embed URL</h2>
                  </div>
                </div>

                <div className="card-body p-4">
                  <label className="form-label small fw-semibold text-dark">
                    Google Maps Iframe Embed Source (src URL)
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    name="googleMapsEmbedUrl"
                    value={formData.googleMapsEmbedUrl}
                    onChange={handleChange}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                  />
                  <small className="text-muted d-block mt-1">
                    To embed: Go to Google Maps &rarr; Search business &rarr; Click Share &rarr; Embed a map &rarr; Copy the <code>src="..."</code> URL. Leave empty to display the clean location placeholder card.
                  </small>

                  {/* Live Map Preview */}
                  <div className="mt-3">
                    <span className="small fw-semibold text-muted d-block mb-2">Map Preview:</span>
                    {formData.googleMapsEmbedUrl && formData.googleMapsEmbedUrl.startsWith('https://') ? (
                      <div className="rounded-3 overflow-hidden border" style={{ height: '200px' }}>
                        <iframe
                          title="Google Maps Location Preview"
                          src={formData.googleMapsEmbedUrl}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                    ) : (
                      <div className="p-4 bg-light text-center rounded-3 border text-muted small">
                        No embed URL provided. Public contact page will display the stylized service coverage card.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="col-12">
              <div className="card shadow-sm border-0 rounded-3 p-3 bg-light d-flex flex-row justify-content-between align-items-center">
                <div className="small text-muted">
                  {lastUpdatedBy && (
                    <span>
                      Last updated by <strong>{lastUpdatedBy}</strong> {updatedAt && `on ${updatedAt}`}
                    </span>
                  )}
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={fetchSettings}
                    disabled={saving}
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 shadow-sm fw-semibold"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                          <polyline points="17 21 17 13 7 13 7 21" />
                          <polyline points="7 3 7 8 15 8" />
                        </svg>
                        <span>Save Business Settings</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

