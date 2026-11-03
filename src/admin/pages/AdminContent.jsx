/**
 * ==============================================================================
 * ADMIN WEBSITE CONTENT MANAGEMENT (src/admin/pages/AdminContent.jsx)
 * ==============================================================================
 * Student / Developer Guide:
 * Module G: Website Content Management
 * 
 * Capabilities:
 * - Update Owner Credentials (strictly name, designation, and experience).
 * - Edit established year and company branding statements.
 * - Manage core Mission, Vision, and Commitment statements.
 * - Configure Key Statistics & Operational Milestones shown across the site.
 * - Edit "Why Choose Us" core strength pillars.
 * ==============================================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

export default function AdminContent() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'danger', text: '' }

  // Form State
  const [organizationName, setOrganizationName] = useState('Poona Pools Facilities');
  const [tagline, setTagline] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [owner, setOwner] = useState({
    name: 'Sunil Shinde',
    designation: 'CEO',
    experience: '12+ Years'
  });
  const [establishedYear, setEstablishedYear] = useState('2017');
  const [missionVision, setMissionVision] = useState({
    mission: '',
    vision: '',
    commitment: ''
  });
  const [statistics, setStatistics] = useState([]);
  const [whyChooseUs, setWhyChooseUs] = useState([]);

  const [lastUpdatedBy, setLastUpdatedBy] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');

  // Fetch Website Content from Atlas
  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/content');
      if (res && res.success && res.data) {
        const d = res.data;
        setOrganizationName(d.organizationName || 'Poona Pools Facilities');
        setTagline(d.tagline || '');
        setShortDescription(d.shortDescription || '');
        setOwner({
          name: d.owner?.name || 'Sunil Shinde',
          designation: d.owner?.designation || 'CEO',
          experience: d.owner?.experience || '12+ Years'
        });
        setEstablishedYear(d.establishedYear || '2017');
        setMissionVision({
          mission: d.missionVision?.mission || '',
          vision: d.missionVision?.vision || '',
          commitment: d.missionVision?.commitment || ''
        });
        setStatistics(Array.isArray(d.statistics) ? d.statistics : []);
        setWhyChooseUs(Array.isArray(d.whyChooseUs) ? d.whyChooseUs : []);
        setLastUpdatedBy(d.lastUpdatedBy || 'System');
        setUpdatedAt(d.updatedAt ? new Date(d.updatedAt).toLocaleString('en-IN') : '');
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.data?.message || err.message || 'Failed to load website content.'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Statistics Handlers
  const handleStatChange = (index, field, value) => {
    setStatistics((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddStat = () => {
    setStatistics((prev) => [
      ...prev,
      { label: 'New Metric', value: '100+', suffix: '', description: 'Description of milestone' }
    ]);
  };

  const handleDeleteStat = (index) => {
    setStatistics((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Why Choose Us Handlers
  const handlePillarChange = (index, field, value) => {
    setWhyChooseUs((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddPillar = () => {
    setWhyChooseUs((prev) => [
      ...prev,
      { title: 'New Strength Pillar', description: 'Describe why clients choose your company' }
    ]);
  };

  const handleDeletePillar = (index) => {
    setWhyChooseUs((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Save Content to Backend
  const handleSave = async (e) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (!owner.name.trim() || !owner.designation.trim() || !owner.experience.trim()) {
      setMessage({
        type: 'danger',
        text: 'Owner name, designation, and years of experience are required.'
      });
      return;
    }

    if (!missionVision.mission.trim() || !missionVision.vision.trim()) {
      setMessage({
        type: 'danger',
        text: 'Both Mission and Vision statements are required.'
      });
      return;
    }

    try {
      setSaving(true);
      const res = await api.put('/api/admin/content', {
        organizationName,
        tagline,
        shortDescription,
        owner,
        establishedYear,
        missionVision,
        statistics,
        whyChooseUs
      });

      if (res && res.success) {
        setMessage({
          type: 'success',
          text: res.message || 'Website content updated successfully and published live.'
        });
        setLastUpdatedBy(res.data?.lastUpdatedBy || 'Admin');
        setUpdatedAt(res.data?.updatedAt ? new Date(res.data.updatedAt).toLocaleString('en-IN') : '');
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.data?.message || err.message || 'Failed to update website content.'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-content-page">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h1 className="h3 fw-bold text-dark mb-0">Website Content</h1>
            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1 small">
              Module G
            </span>
          </div>
          <p className="text-secondary small mb-0">
            Manage company leadership credentials, mission and vision, key statistics, and Why Choose Us pillars.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <a
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-2"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            <span>View Public About Page</span>
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
            <span className="visually-hidden">Loading website content...</span>
          </div>
          <p className="text-secondary small mt-2">Loading website content from MongoDB Atlas...</p>
        </div>
      ) : (
        <form onSubmit={handleSave}>
          <div className="row g-4">
            {/* Left Column: Leadership & Mission/Vision */}
            <div className="col-12 col-xl-6">
              {/* Card 1: Owner Credentials */}
              <div className="card shadow-sm border-0 rounded-3 mb-4">
                <div className="card-header bg-white py-3 border-bottom">
                  <div className="d-flex align-items-center gap-2">
                    <span className="rounded-circle p-1 bg-primary bg-opacity-10 text-primary">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    <h2 className="h6 fw-bold mb-0 text-dark">1. Leadership &amp; Owner Credentials</h2>
                  </div>
                </div>

                <div className="card-body p-4">
                  <div className="alert alert-light border small text-muted mb-3 py-2 px-3 rounded-2">
                    <strong>Note:</strong> Strict boundary applied: Only official owner credentials (name, designation, experience) are stored. No personal photographs or unnecessary biography are utilized.
                  </div>

                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-dark">
                        Owner's Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={owner.name}
                        onChange={(e) => setOwner((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Sunil Shinde"
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-dark">
                        Designation <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={owner.designation}
                        onChange={(e) => setOwner((prev) => ({ ...prev, designation: e.target.value }))}
                        placeholder="e.g. CEO, Founder"
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-dark">
                        Industry Experience <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={owner.experience}
                        onChange={(e) => setOwner((prev) => ({ ...prev, experience: e.target.value }))}
                        placeholder="e.g. 12+ Years"
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-dark">Established Year</label>
                      <input
                        type="text"
                        className="form-control"
                        value={establishedYear}
                        onChange={(e) => setEstablishedYear(e.target.value)}
                        placeholder="e.g. 2017"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Mission, Vision & Commitment */}
              <div className="card shadow-sm border-0 rounded-3 mb-4">
                <div className="card-header bg-white py-3 border-bottom">
                  <div className="d-flex align-items-center gap-2">
                    <span className="rounded-circle p-1 bg-success bg-opacity-10 text-success">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </span>
                    <h2 className="h6 fw-bold mb-0 text-dark">2. Mission, Vision &amp; Commitment</h2>
                  </div>
                </div>

                <div className="card-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">
                      Mission Statement <span className="text-danger">*</span>
                    </label>
                    <textarea
                      rows="3"
                      className="form-control"
                      value={missionVision.mission}
                      onChange={(e) =>
                        setMissionVision((prev) => ({ ...prev, mission: e.target.value }))
                      }
                      placeholder="Organization core mission..."
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">
                      Vision Statement <span className="text-danger">*</span>
                    </label>
                    <textarea
                      rows="3"
                      className="form-control"
                      value={missionVision.vision}
                      onChange={(e) =>
                        setMissionVision((prev) => ({ ...prev, vision: e.target.value }))
                      }
                      placeholder="Organization long-term vision..."
                      required
                    />
                  </div>

                  <div className="mb-0">
                    <label className="form-label small fw-semibold text-dark">Commitment Statement</label>
                    <textarea
                      rows="3"
                      className="form-control"
                      value={missionVision.commitment}
                      onChange={(e) =>
                        setMissionVision((prev) => ({ ...prev, commitment: e.target.value }))
                      }
                      placeholder="Engineering and quality commitment..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Statistics & Why Choose Us */}
            <div className="col-12 col-xl-6">
              {/* Card 3: Key Statistics */}
              <div className="card shadow-sm border-0 rounded-3 mb-4">
                <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <span className="rounded-circle p-1 bg-info bg-opacity-10 text-info">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="20" x2="18" y2="10" />
                        <line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                      </svg>
                    </span>
                    <h2 className="h6 fw-bold mb-0 text-dark">3. Key Operational Statistics</h2>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                    onClick={handleAddStat}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span>Add Stat</span>
                  </button>
                </div>

                <div className="card-body p-3">
                  <div className="d-flex flex-column gap-3">
                    {statistics.map((st, idx) => (
                      <div key={idx} className="p-3 border rounded-3 bg-light position-relative">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-2 p-1"
                          onClick={() => handleDeleteStat(idx)}
                          title="Remove statistic"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>

                        <div className="row g-2 mb-2 pe-4">
                          <div className="col-7">
                            <label className="form-label small fw-semibold text-dark mb-1">Label</label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={st.label}
                              onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                              placeholder="e.g. Projects Completed"
                              required
                            />
                          </div>
                          <div className="col-5">
                            <label className="form-label small fw-semibold text-dark mb-1">Value</label>
                            <input
                              type="text"
                              className="form-control form-control-sm fw-bold text-primary"
                              value={st.value}
                              onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                              placeholder="e.g. 150+"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="form-label small fw-semibold text-muted mb-1">Description</label>
                          <input
                            type="text"
                            className="form-control form-control-sm text-secondary"
                            value={st.description}
                            onChange={(e) => handleStatChange(idx, 'description', e.target.value)}
                            placeholder="Brief context..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 4: Why Choose Us Pillars */}
              <div className="card shadow-sm border-0 rounded-3 mb-4">
                <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <span className="rounded-circle p-1 bg-warning bg-opacity-10 text-warning-emphasis">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </span>
                    <h2 className="h6 fw-bold mb-0 text-dark">4. Why Choose Us (Pillars)</h2>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                    onClick={handleAddPillar}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span>Add Pillar</span>
                  </button>
                </div>

                <div className="card-body p-3">
                  <div className="d-flex flex-column gap-3">
                    {whyChooseUs.map((pillar, idx) => (
                      <div key={idx} className="p-3 border rounded-3 bg-light position-relative">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-2 p-1"
                          onClick={() => handleDeletePillar(idx)}
                          title="Remove pillar"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>

                        <div className="mb-2 pe-4">
                          <label className="form-label small fw-semibold text-dark mb-1">
                            Pillar #{idx + 1} Title
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm fw-semibold"
                            value={pillar.title}
                            onChange={(e) => handlePillarChange(idx, 'title', e.target.value)}
                            placeholder="e.g. Quality Workmanship"
                            required
                          />
                        </div>

                        <div>
                          <label className="form-label small fw-semibold text-muted mb-1">Description</label>
                          <textarea
                            rows="2"
                            className="form-control form-control-sm text-secondary"
                            value={pillar.description}
                            onChange={(e) => handlePillarChange(idx, 'description', e.target.value)}
                            placeholder="Description of craftsmanship..."
                            required
                          />
                        </div>
                      </div>
                    ))}
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
                    onClick={fetchContent}
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
                        <span>Save Website Content</span>
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

