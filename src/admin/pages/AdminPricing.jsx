/**
 * ==============================================================================
 * ADMIN PRICING & COST ESTIMATOR MANAGEMENT (src/admin/pages/AdminPricing.jsx)
 * ==============================================================================
 * Student / Developer Guide:
 * Module D: Pricing Engine & Cost Estimator Management
 * 
 * Capabilities:
 * - View and edit the base construction rate per cubic metre (₹/m³).
 * - Configure pool type complexity multipliers (Residential, Commercial, Infinity).
 * - Add or remove pool types dynamically.
 * - Customize the public quotation disclaimer and legal notice.
 * - Flag whether pricing is a demonstration placeholder or authentic company rates.
 * - Test calculations in real time using an embedded live preview calculator.
 * ==============================================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { formatCurrency, formatNumber } from '../../utils/costCalculator';

export default function AdminPricing() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'danger', text: '' }

  // Form State
  const [baseRate, setBaseRate] = useState(22000);
  const [currencySymbol, setCurrencySymbol] = useState('₹');
  const [currencyCode, setCurrencyCode] = useState('INR');
  const [poolTypes, setPoolTypes] = useState([
    { id: 'residential', label: 'Residential', multiplier: 1.0 },
    { id: 'commercial', label: 'Commercial', multiplier: 1.35 },
    { id: 'infinity', label: 'Infinity Pool', multiplier: 1.5 }
  ]);
  const [disclaimer, setDisclaimer] = useState('');
  const [isPlaceholder, setIsPlaceholder] = useState(true);
  const [lastUpdatedBy, setLastUpdatedBy] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');

  // New Pool Type Inline Modal/State
  const [newTypeLabel, setNewTypeLabel] = useState('');
  const [newTypeId, setNewTypeId] = useState('');
  const [newTypeMultiplier, setNewTypeMultiplier] = useState(1.2);
  const [showAddTypeModal, setShowAddTypeModal] = useState(false);
  const [addTypeError, setAddTypeError] = useState('');

  // Interactive Live Preview Calculator State
  const [testLength, setTestLength] = useState(10);
  const [testWidth, setTestWidth] = useState(5);
  const [testDepth, setTestDepth] = useState(1.5);
  const [testType, setTestType] = useState('residential');

  // Fetch Pricing Configuration from MongoDB Atlas
  const fetchPricing = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/pricing');
      if (res && res.success && res.data) {
        const d = res.data;
        setBaseRate(d.baseRatePerCubicMeter || 22000);
        setCurrencySymbol(d.currencySymbol || '₹');
        setCurrencyCode(d.currencyCode || 'INR');
        if (Array.isArray(d.poolTypes) && d.poolTypes.length > 0) {
          setPoolTypes(d.poolTypes);
          setTestType(d.poolTypes[0].id);
        }
        setDisclaimer(d.disclaimer || '');
        setIsPlaceholder(Boolean(d.isPlaceholder));
        setLastUpdatedBy(d.lastUpdatedBy || 'System');
        setUpdatedAt(d.updatedAt ? new Date(d.updatedAt).toLocaleString('en-IN') : '');
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.data?.message || err.message || 'Failed to load pricing configuration.'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPricing();
  }, [fetchPricing]);

  // Handle Multiplier Change for existing pool types
  const handleMultiplierChange = (id, newMultiplier) => {
    const val = parseFloat(newMultiplier);
    setPoolTypes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, multiplier: isNaN(val) ? 0 : val } : item))
    );
  };

  // Handle Label Change for existing pool types
  const handleLabelChange = (id, newLabel) => {
    setPoolTypes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, label: newLabel } : item))
    );
  };

  // Delete a pool type
  const handleDeleteType = (id) => {
    if (poolTypes.length <= 1) {
      setMessage({
        type: 'danger',
        text: 'At least one pool type configuration is required. You cannot delete the only pool type.'
      });
      return;
    }
    setPoolTypes((prev) => prev.filter((item) => item.id !== id));
    if (testType === id) {
      const remaining = poolTypes.filter((item) => item.id !== id);
      if (remaining.length > 0) setTestType(remaining[0].id);
    }
  };

  // Add new pool type
  const handleAddPoolType = (e) => {
    e.preventDefault();
    setAddTypeError('');

    const cleanLabel = newTypeLabel.trim();
    const cleanId = (newTypeId || cleanLabel.toLowerCase().replace(/[^a-z0-9]/g, '-')).trim();
    const cleanMultiplier = parseFloat(newTypeMultiplier);

    if (!cleanLabel) {
      setAddTypeError('Please enter a display label for the pool type.');
      return;
    }
    if (!cleanId) {
      setAddTypeError('Please enter a unique identifier / slug.');
      return;
    }
    if (poolTypes.some((t) => t.id === cleanId)) {
      setAddTypeError(`A pool type with ID "${cleanId}" already exists.`);
      return;
    }
    if (isNaN(cleanMultiplier) || cleanMultiplier < 0.1 || cleanMultiplier > 10.0) {
      setAddTypeError('Multiplier must be between 0.1x and 10.0x.');
      return;
    }

    setPoolTypes((prev) => [...prev, { id: cleanId, label: cleanLabel, multiplier: cleanMultiplier }]);
    setNewTypeLabel('');
    setNewTypeId('');
    setNewTypeMultiplier(1.2);
    setShowAddTypeModal(false);
  };

  // Save changes to backend
  const handleSave = async (e) => {
    e.preventDefault();
    setMessage(null);

    // Frontend validations
    const numBaseRate = Number(baseRate);
    if (isNaN(numBaseRate) || numBaseRate < 1000) {
      setMessage({
        type: 'danger',
        text: 'Base rate per cubic meter must be a valid number and at least ₹1,000 / m³.'
      });
      return;
    }

    if (!poolTypes || poolTypes.length === 0) {
      setMessage({
        type: 'danger',
        text: 'At least one pool type configuration is required.'
      });
      return;
    }

    for (const pt of poolTypes) {
      if (!pt.label || !pt.label.trim()) {
        setMessage({
          type: 'danger',
          text: `Pool type "${pt.id}" is missing a display label.`
        });
        return;
      }
      if (isNaN(pt.multiplier) || pt.multiplier < 0.1 || pt.multiplier > 10.0) {
        setMessage({
          type: 'danger',
          text: `Multiplier for "${pt.label}" must be between 0.1x and 10.0x.`
        });
        return;
      }
    }

    if (!disclaimer || disclaimer.trim().length < 10) {
      setMessage({
        type: 'danger',
        text: 'Quotation disclaimer notice is required and must be at least 10 characters long.'
      });
      return;
    }

    try {
      setSaving(true);
      const res = await api.put('/api/admin/pricing', {
        baseRatePerCubicMeter: numBaseRate,
        currencySymbol: currencySymbol.trim(),
        currencyCode: currencyCode.trim(),
        poolTypes,
        disclaimer: disclaimer.trim(),
        isPlaceholder
      });

      if (res && res.success) {
        setMessage({
          type: 'success',
          text: res.message || 'Pricing configuration saved successfully and published to live estimator.'
        });
        setLastUpdatedBy(res.data?.lastUpdatedBy || 'Admin');
        setUpdatedAt(res.data?.updatedAt ? new Date(res.data.updatedAt).toLocaleString('en-IN') : '');
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.data?.message || err.message || 'Failed to update pricing configuration.'
      });
    } finally {
      setSaving(false);
    }
  };

  // Live Test Estimator Calculations
  const testVolume = Math.max(0, (parseFloat(testLength) || 0) * (parseFloat(testWidth) || 0) * (parseFloat(testDepth) || 0));
  const testCapacity = testVolume * 1000;
  const activeTestTypeObj = poolTypes.find((t) => t.id === testType) || poolTypes[0] || { multiplier: 1.0, label: 'Standard' };
  const testCost = Math.round(testVolume * (parseFloat(baseRate) || 0) * (activeTestTypeObj?.multiplier || 1.0));

  return (
    <div className="admin-pricing-page">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h1 className="h3 fw-bold text-dark mb-0">Pricing & Cost Estimator</h1>
            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1 small">
              Module D
            </span>
            {isPlaceholder ? (
              <span className="badge bg-warning bg-opacity-10 text-warning-emphasis border border-warning px-2 py-1 small">
                Placeholder Rates Active
              </span>
            ) : (
              <span className="badge bg-success bg-opacity-10 text-success border border-success px-2 py-1 small">
                Production Rates
              </span>
            )}
          </div>
          <p className="text-secondary small mb-0">
            Configure the civil construction base rate per cubic metre, pool complexity multipliers, and quotation disclaimers.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <a
            href="/#estimator"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-2"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            <span>View Public Estimator</span>
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
            <span className="visually-hidden">Loading pricing configuration...</span>
          </div>
          <p className="text-secondary small mt-2">Loading pricing engine from MongoDB Atlas...</p>
        </div>
      ) : (
        <form onSubmit={handleSave}>
          <div className="row g-4">
            {/* Left Column: Form Settings */}
            <div className="col-12 col-xl-7">
              {/* Card 1: Base Rate & Currency */}
              <div className="card shadow-sm border-0 rounded-3 mb-4">
                <div className="card-header bg-white py-3 border-bottom">
                  <div className="d-flex align-items-center gap-2">
                    <span className="rounded-circle p-1 bg-primary bg-opacity-10 text-primary">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </span>
                    <h2 className="h6 fw-bold mb-0 text-dark">1. Civil Construction Base Rate</h2>
                  </div>
                </div>
                <div className="card-body p-4">
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-dark">
                        Base Rate Per Cubic Metre (m³) <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light fw-bold text-primary">{currencySymbol}</span>
                        <input
                          type="number"
                          min="1000"
                          step="500"
                          className="form-control form-control-lg fw-bold"
                          value={baseRate}
                          onChange={(e) => setBaseRate(e.target.value)}
                          required
                        />
                        <span className="input-group-text bg-light text-muted small">/ m³</span>
                      </div>
                      <small className="text-muted d-block mt-1">
                        Applies to standard RCC casting, excavation, waterproofing and standard mosaic tiling.
                      </small>
                    </div>

                    <div className="col-6 col-md-3">
                      <label className="form-label small fw-semibold text-dark">Currency Symbol</label>
                      <input
                        type="text"
                        className="form-control form-control-lg text-center"
                        value={currencySymbol}
                        onChange={(e) => setCurrencySymbol(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-6 col-md-3">
                      <label className="form-label small fw-semibold text-dark">Currency Code</label>
                      <input
                        type="text"
                        className="form-control form-control-lg text-center text-uppercase"
                        value={currencyCode}
                        onChange={(e) => setCurrencyCode(e.target.value)}
                        required
                      />
                    </div>

                    {/* Placeholder Status Checkbox */}
                    <div className="col-12 mt-3 pt-2 border-top">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="isPlaceholderSwitch"
                          checked={isPlaceholder}
                          onChange={(e) => setIsPlaceholder(e.target.checked)}
                        />
                        <label className="form-check-label fw-semibold text-dark small" htmlFor="isPlaceholderSwitch">
                          Demonstration / Indicative Placeholder Mode
                        </label>
                        <p className="text-muted small mb-0 mt-1">
                          When checked, the admin dashboard indicates that rates are sample placeholder values awaiting authentic company quotation rates.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Pool Types & Multipliers */}
              <div className="card shadow-sm border-0 rounded-3 mb-4">
                <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <span className="rounded-circle p-1 bg-info bg-opacity-10 text-info">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                    </span>
                    <h2 className="h6 fw-bold mb-0 text-dark">2. Pool Type Complexity Multipliers</h2>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                    onClick={() => {
                      setAddTypeError('');
                      setShowAddTypeModal(true);
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span>Add Pool Type</span>
                  </button>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table align-middle mb-0">
                      <thead className="table-light small text-uppercase">
                        <tr>
                          <th className="ps-4">Pool Type & Slug</th>
                          <th style={{ width: '180px' }}>Complexity Multiplier</th>
                          <th style={{ width: '180px' }}>Sample Cost (75 m³)</th>
                          <th className="text-end pe-4" style={{ width: '80px' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {poolTypes.map((pt) => {
                          const sampleCost = Math.round(75 * (parseFloat(baseRate) || 0) * (pt.multiplier || 1.0));
                          return (
                            <tr key={pt.id}>
                              <td className="ps-4">
                                <input
                                  type="text"
                                  className="form-control form-control-sm fw-semibold mb-1"
                                  value={pt.label}
                                  onChange={(e) => handleLabelChange(pt.id, e.target.value)}
                                  placeholder="Pool type name"
                                  required
                                />
                                <span className="badge bg-light text-secondary border small font-monospace">
                                  id: {pt.id}
                                </span>
                              </td>
                              <td>
                                <div className="input-group input-group-sm">
                                  <input
                                    type="number"
                                    min="0.1"
                                    max="10.0"
                                    step="0.05"
                                    className="form-control fw-bold"
                                    value={pt.multiplier}
                                    onChange={(e) => handleMultiplierChange(pt.id, e.target.value)}
                                    required
                                  />
                                  <span className="input-group-text bg-light text-muted">x</span>
                                </div>
                              </td>
                              <td>
                                <div className="fw-semibold text-dark small">
                                  {formatCurrency(sampleCost, { currencySymbol })}
                                </div>
                                <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                                  vs {formatCurrency(75 * (parseFloat(baseRate) || 0), { currencySymbol })} base
                                </span>
                              </td>
                              <td className="text-end pe-4">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger p-1"
                                  title="Delete pool type"
                                  disabled={poolTypes.length <= 1}
                                  onClick={() => handleDeleteType(pt.id)}
                                >
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Card 3: Quotation Disclaimer */}
              <div className="card shadow-sm border-0 rounded-3 mb-4">
                <div className="card-header bg-white py-3 border-bottom">
                  <div className="d-flex align-items-center gap-2">
                    <span className="rounded-circle p-1 bg-warning bg-opacity-10 text-warning-emphasis">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    </span>
                    <h2 className="h6 fw-bold mb-0 text-dark">3. Public Quotation Disclaimer</h2>
                  </div>
                </div>
                <div className="card-body p-4">
                  <label className="form-label small fw-semibold text-dark">
                    Estimator Notice & Legal Disclaimer <span className="text-danger">*</span>
                  </label>
                  <textarea
                    rows="4"
                    className="form-control"
                    value={disclaimer}
                    onChange={(e) => setDisclaimer(e.target.value)}
                    placeholder="Enter the official notice shown to clients on the cost estimator..."
                    required
                  />
                  <div className="alert alert-light border small text-muted mt-3 mb-0 p-3 rounded-2">
                    <strong>Engineering Note:</strong> Civil swimming pool projects depend heavily on site soil conditions, bedrock excavation, water table depth, pump room distance, and specialized filtration systems. Maintaining a clear disclaimer protects the company from client misunderstandings.
                  </div>
                </div>
              </div>

              {/* Action Buttons & Audit Bar */}
              <div className="card shadow-sm border-0 rounded-3 p-3 bg-light d-flex flex-row justify-content-between align-items-center">
                <div className="small text-muted">
                  {lastUpdatedBy && (
                    <span>
                      Last saved by <strong>{lastUpdatedBy}</strong> {updatedAt && `on ${updatedAt}`}
                    </span>
                  )}
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={fetchPricing}
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
                        <span>Saving to Atlas...</span>
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                          <polyline points="17 21 17 13 7 13 7 21" />
                          <polyline points="7 3 7 8 15 8" />
                        </svg>
                        <span>Save Pricing Configuration</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Calculator Preview */}
            <div className="col-12 col-xl-5">
              <div className="card shadow-sm border-0 rounded-3 sticky-top" style={{ top: '20px' }}>
                <div className="card-header bg-primary text-white py-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="4" y="2" width="16" height="20" rx="2" />
                        <line x1="8" y1="6" x2="16" y2="6" />
                        <line x1="16" y1="14" x2="16" y2="18" />
                        <path d="M16 10h.01" />
                        <path d="M12 10h.01" />
                        <path d="M8 10h.01" />
                        <path d="M12 14h.01" />
                        <path d="M8 14h.01" />
                        <path d="M12 18h.01" />
                        <path d="M8 18h.01" />
                      </svg>
                      <h2 className="h6 fw-bold mb-0 text-white">Live Estimator Preview</h2>
                    </div>
                    <span className="badge bg-light text-primary small">Simulated</span>
                  </div>
                </div>

                <div className="card-body p-4">
                  <p className="small text-muted mb-4">
                    Test how prospective clients will experience the estimator based on your current inputs above.
                  </p>

                  {/* Simulator Inputs */}
                  <div className="row g-2 mb-3">
                    <div className="col-4">
                      <label className="form-label small fw-semibold text-muted mb-1">Length (m)</label>
                      <input
                        type="number"
                        min="1"
                        step="0.5"
                        className="form-control form-control-sm"
                        value={testLength}
                        onChange={(e) => setTestLength(e.target.value)}
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label small fw-semibold text-muted mb-1">Width (m)</label>
                      <input
                        type="number"
                        min="1"
                        step="0.5"
                        className="form-control form-control-sm"
                        value={testWidth}
                        onChange={(e) => setTestWidth(e.target.value)}
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label small fw-semibold text-muted mb-1">Depth (m)</label>
                      <input
                        type="number"
                        min="0.5"
                        step="0.1"
                        className="form-control form-control-sm"
                        value={testDepth}
                        onChange={(e) => setTestDepth(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Pool Type Selection in Preview */}
                  <div className="mb-4">
                    <label className="form-label small fw-semibold text-muted mb-1">Select Pool Type</label>
                    <select
                      className="form-select form-select-sm"
                      value={testType}
                      onChange={(e) => setTestType(e.target.value)}
                    >
                      {poolTypes.map((pt) => (
                        <option key={pt.id} value={pt.id}>
                          {pt.label} ({pt.multiplier}x complexity index)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Simulation Metrics Box */}
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <div className="p-3 bg-light rounded-3 text-center border">
                        <span className="small text-muted text-uppercase d-block mb-1">Volume</span>
                        <span className="h5 fw-bold text-dark mb-0">{formatNumber(testVolume, 2)}</span>
                        <small className="text-secondary d-block">m³</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-3 bg-light rounded-3 text-center border">
                        <span className="small text-muted text-uppercase d-block mb-1">Capacity</span>
                        <span className="h5 fw-bold text-primary mb-0">{formatNumber(testCapacity, 0)}</span>
                        <small className="text-secondary d-block">Litres</small>
                      </div>
                    </div>
                  </div>

                  {/* Calculated Project Cost Box */}
                  <div
                    className="p-3 rounded-3 text-center mb-4 border"
                    style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}
                  >
                    <span className="small fw-semibold text-muted text-uppercase d-block mb-1">
                      Indicative Estimated Cost
                    </span>
                    <div className="h3 fw-bold text-primary mb-1">
                      {formatCurrency(testCost, { currencySymbol })}
                    </div>
                    <small className="text-muted d-block">
                      {formatNumber(testVolume, 1)} m³ × {formatCurrency(baseRate, { currencySymbol })} × {activeTestTypeObj?.multiplier}x
                    </small>
                  </div>

                  {/* Simulated Disclaimer Display */}
                  <div className="alert alert-light border small text-muted p-2 rounded-2 mb-0">
                    <div className="d-flex gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary flex-shrink-0 mt-1">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                      <span style={{ fontSize: '0.8rem' }}>
                        {disclaimer || 'Quotation disclaimer preview...'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Add Pool Type Modal */}
      {showAddTypeModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Add Pool Complexity Type</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddTypeModal(false)}
                />
              </div>
              <form onSubmit={handleAddPoolType}>
                <div className="modal-body p-4">
                  {addTypeError && (
                    <div className="alert alert-danger py-2 small mb-3">{addTypeError}</div>
                  )}

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">
                      Display Label <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Rooftop Pool, Plunge Pool"
                      value={newTypeLabel}
                      onChange={(e) => {
                        setNewTypeLabel(e.target.value);
                        if (!newTypeId) {
                          setNewTypeId(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                        }
                      }}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">
                      Unique ID / Slug <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control font-monospace"
                      placeholder="e.g. rooftop, plunge"
                      value={newTypeId}
                      onChange={(e) => setNewTypeId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">
                      Complexity Multiplier <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        type="number"
                        min="0.1"
                        max="10.0"
                        step="0.05"
                        className="form-control"
                        value={newTypeMultiplier}
                        onChange={(e) => setNewTypeMultiplier(e.target.value)}
                        required
                      />
                      <span className="input-group-text">x</span>
                    </div>
                    <small className="text-muted d-block mt-1">
                      Multiplier relative to standard base rate (e.g. 1.25x = 25% higher cost).
                    </small>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowAddTypeModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary fw-semibold">
                    Add Type
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

