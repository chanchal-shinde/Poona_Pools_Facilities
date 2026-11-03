/**
 * ==============================================================================
 * ADMIN CUSTOMER INQUIRIES MANAGEMENT (src/admin/pages/AdminInquiries.jsx)
 * ==============================================================================
 * Student / Developer Guide:
 * Module E: Lead & Inquiry Management System
 * 
 * Features:
 * - Search customer inquiries by name, phone, email, or site location.
 * - Filter inquiries by status: All, New, In Progress, Contacted, Completed, Archived.
 * - View full project specifications (pool dimensions, service, budget, customer message).
 * - Direct WhatsApp and phone call triggers for instant customer follow-up.
 * - Transition inquiry status (New -> In Progress -> Contacted -> Completed -> Archived).
 * - Append timestamped engineering and inspection notes with admin author tracking.
 * - Delete inquiries with confirmation.
 * ==============================================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

const STATUS_OPTIONS = ['All', 'New', 'In Progress', 'Contacted', 'Completed', 'Archived'];

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    inProgress: 0,
    contacted: 0,
    completed: 0,
    archived: 0
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'danger', text: '' }

  // Filter & Search state
  const [activeStatus, setActiveStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Detail Modal state
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);

  // Delete confirmation
  const [deletingId, setDeletingId] = useState(null);

  // Fetch inquiries and stats
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeStatus !== 'All') {
        params.status = activeStatus;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const [inquiriesRes, statsRes] = await Promise.all([
        api.get('/api/admin/inquiries', { params }),
        api.get('/api/admin/inquiries/stats')
      ]);

      if (inquiriesRes && inquiriesRes.success) {
        setInquiries(inquiriesRes.data || []);
      }
      if (statsRes && statsRes.success) {
        setStats(statsRes.data || {});
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.data?.message || err.message || 'Failed to load inquiries.'
      });
    } finally {
      setLoading(false);
    }
  }, [activeStatus, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Open Inquiry Details Modal
  const handleOpenDetail = (inquiry) => {
    setSelectedInquiry(inquiry);
    setNewNoteText('');
  };

  const handleCloseDetail = () => {
    setSelectedInquiry(null);
    setNewNoteText('');
  };

  // Status Change Handler
  const handleStatusChange = async (inquiryId, newStatus) => {
    try {
      setActionLoading(true);
      const res = await api.patch(`/api/admin/inquiries/${inquiryId}/status`, { status: newStatus });
      if (res && res.success) {
        setMessage({
          type: 'success',
          text: `Inquiry status changed to "${newStatus}".`
        });
        // Update local list
        setInquiries((prev) =>
          prev.map((item) => (item._id === inquiryId ? res.data : item))
        );
        // If modal is currently open with this inquiry, update modal state
        if (selectedInquiry && selectedInquiry._id === inquiryId) {
          setSelectedInquiry(res.data);
        }
        // Refresh stats
        const statsRes = await api.get('/api/admin/inquiries/stats');
        if (statsRes && statsRes.success) {
          setStats(statsRes.data);
        }
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.data?.message || err.message || 'Failed to update status.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Add Follow-Up Note Handler
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedInquiry) return;

    try {
      setNoteLoading(true);
      const res = await api.post(`/api/admin/inquiries/${selectedInquiry._id}/notes`, {
        text: newNoteText.trim()
      });

      if (res && res.success) {
        setSelectedInquiry(res.data);
        setInquiries((prev) =>
          prev.map((item) => (item._id === selectedInquiry._id ? res.data : item))
        );
        setNewNoteText('');
        setMessage({
          type: 'success',
          text: 'Follow-up note added successfully.'
        });
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.data?.message || err.message || 'Failed to add follow-up note.'
      });
    } finally {
      setNoteLoading(false);
    }
  };

  // Delete Inquiry Handler
  const handleDelete = async (inquiryId) => {
    if (!window.confirm('Are you sure you want to delete this customer inquiry? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(inquiryId);
      const res = await api.delete(`/api/admin/inquiries/${inquiryId}`);
      if (res && res.success) {
        setMessage({
          type: 'success',
          text: 'Inquiry record deleted successfully.'
        });
        if (selectedInquiry && selectedInquiry._id === inquiryId) {
          setSelectedInquiry(null);
        }
        fetchData();
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.data?.message || err.message || 'Failed to delete inquiry.'
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Helper for Status Badge Styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return <span className="badge bg-warning text-dark px-2.5 py-1.5 fw-semibold">New</span>;
      case 'In Progress':
        return <span className="badge bg-info text-dark px-2.5 py-1.5 fw-semibold">In Progress</span>;
      case 'Contacted':
        return <span className="badge bg-primary px-2.5 py-1.5 fw-semibold">Contacted</span>;
      case 'Completed':
        return <span className="badge bg-success px-2.5 py-1.5 fw-semibold">Completed</span>;
      case 'Archived':
        return <span className="badge bg-secondary px-2.5 py-1.5 fw-semibold">Archived</span>;
      default:
        return <span className="badge bg-light text-dark border px-2.5 py-1.5">{status}</span>;
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Clean WhatsApp Link Generator
  const getWhatsAppLink = (inquiry) => {
    if (!inquiry || !inquiry.phone) return '#';
    const digits = inquiry.phone.replace(/[^0-9]/g, '');
    const cleanPhone = digits.length === 10 ? `91${digits}` : digits;
    const text = encodeURIComponent(
      `Hello ${inquiry.customerName}, this is Poona Pools Facilities. We received your quote inquiry for ${inquiry.poolType || 'swimming pool'} construction/services in ${inquiry.location || 'Pune'}. We would be glad to discuss your project specifications and schedule a site evaluation.`
    );
    return `https://wa.me/${cleanPhone}?text=${text}`;
  };

  return (
    <div className="admin-inquiries-page">
      {/* Toast Alert Message */}
      {message && (
        <div className={`alert alert-${message.type} alert-dismissible fade show rounded-3 mb-4`} role="alert">
          {message.text}
          <button
            type="button"
            className="btn-close"
            onClick={() => setMessage(null)}
            aria-label="Close"
          />
        </div>
      )}

      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h1 className="h3 fw-bold text-dark mb-0">Customer Inquiries</h1>
            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 small">
              Module E
            </span>
          </div>
          <p className="text-secondary small mb-0">
            Review incoming quote requests from the public website, update project status, and track consultation notes.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary d-flex align-items-center gap-2 align-self-start align-self-md-auto"
          onClick={fetchData}
          disabled={loading}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={loading ? 'spinner-border spinner-border-sm' : ''}
          >
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      {/* Status KPI Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-4 col-xl-2">
          <div
            className={`admin-card p-3 text-center cursor-pointer ${activeStatus === 'All' ? 'border-primary shadow-sm bg-light' : ''}`}
            onClick={() => setActiveStatus('All')}
            style={{ cursor: 'pointer' }}
          >
            <div className="text-muted small fw-semibold text-uppercase">Total</div>
            <div className="fs-3 fw-bold text-dark">{stats.total || 0}</div>
          </div>
        </div>
        <div className="col-6 col-md-4 col-xl-2">
          <div
            className={`admin-card p-3 text-center ${activeStatus === 'New' ? 'border-warning shadow-sm bg-warning bg-opacity-10' : ''}`}
            onClick={() => setActiveStatus('New')}
            style={{ cursor: 'pointer' }}
          >
            <div className="text-warning text-dark small fw-semibold text-uppercase">New</div>
            <div className="fs-3 fw-bold text-dark">{stats.new || 0}</div>
          </div>
        </div>
        <div className="col-6 col-md-4 col-xl-2">
          <div
            className={`admin-card p-3 text-center ${activeStatus === 'In Progress' ? 'border-info shadow-sm bg-info bg-opacity-10' : ''}`}
            onClick={() => setActiveStatus('In Progress')}
            style={{ cursor: 'pointer' }}
          >
            <div className="text-info text-dark small fw-semibold text-uppercase">In Progress</div>
            <div className="fs-3 fw-bold text-dark">{stats.inProgress || 0}</div>
          </div>
        </div>
        <div className="col-6 col-md-4 col-xl-2">
          <div
            className={`admin-card p-3 text-center ${activeStatus === 'Contacted' ? 'border-primary shadow-sm bg-primary bg-opacity-10' : ''}`}
            onClick={() => setActiveStatus('Contacted')}
            style={{ cursor: 'pointer' }}
          >
            <div className="text-primary small fw-semibold text-uppercase">Contacted</div>
            <div className="fs-3 fw-bold text-dark">{stats.contacted || 0}</div>
          </div>
        </div>
        <div className="col-6 col-md-4 col-xl-2">
          <div
            className={`admin-card p-3 text-center ${activeStatus === 'Completed' ? 'border-success shadow-sm bg-success bg-opacity-10' : ''}`}
            onClick={() => setActiveStatus('Completed')}
            style={{ cursor: 'pointer' }}
          >
            <div className="text-success small fw-semibold text-uppercase">Completed</div>
            <div className="fs-3 fw-bold text-dark">{stats.completed || 0}</div>
          </div>
        </div>
        <div className="col-6 col-md-4 col-xl-2">
          <div
            className={`admin-card p-3 text-center ${activeStatus === 'Archived' ? 'border-secondary shadow-sm bg-secondary bg-opacity-10' : ''}`}
            onClick={() => setActiveStatus('Archived')}
            style={{ cursor: 'pointer' }}
          >
            <div className="text-secondary small fw-semibold text-uppercase">Archived</div>
            <div className="fs-3 fw-bold text-dark">{stats.archived || 0}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-card p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-6 col-lg-5">
            <div className="input-group">
              <span className="input-group-text bg-white text-muted border-end-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search by customer, phone, location, service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setSearchQuery('')}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-7">
            <div className="d-flex flex-wrap gap-2 justify-content-md-end">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 ${
                    activeStatus === status ? 'btn-primary shadow-sm' : 'btn-outline-secondary'
                  }`}
                  onClick={() => setActiveStatus(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Inquiries Table Card */}
      <div className="admin-card overflow-hidden">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading inquiries...</span>
            </div>
            <p className="text-muted small mt-2">Loading inquiries from MongoDB Atlas...</p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="text-center py-5 px-3">
            <div className="mb-3 text-muted">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h5 className="fw-bold text-dark">No inquiries found</h5>
            <p className="text-muted small mb-0">
              {searchQuery || activeStatus !== 'All'
                ? 'Try adjusting your search criteria or status filter.'
                : 'Customer submissions from the quote form will appear here automatically.'}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-uppercase small" style={{ fontSize: '0.75rem', letterSpacing: '0.04em' }}>
                <tr>
                  <th scope="col" className="ps-4">Date / Ref</th>
                  <th scope="col">Customer Contact</th>
                  <th scope="col">Location</th>
                  <th scope="col">Pool &amp; Service</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody className="border-top-0">
                {inquiries.map((inq) => (
                  <tr key={inq._id}>
                    <td className="ps-4">
                      <div className="fw-semibold text-dark small">{formatDate(inq.createdAt)}</div>
                      <span className="badge bg-light text-secondary border small font-monospace">
                        #{inq._id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{inq.customerName}</div>
                      <div className="small text-muted">
                        <a href={`tel:${inq.phone}`} className="text-decoration-none text-secondary">
                          {inq.phone}
                        </a>
                      </div>
                      {inq.email && (
                        <div className="small text-muted font-monospace" style={{ fontSize: '0.8rem' }}>
                          {inq.email}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="small text-dark fw-medium">{inq.location}</span>
                    </td>
                    <td>
                      <div className="small fw-semibold text-dark">{inq.poolType || 'Residential'}</div>
                      <div className="small text-muted">{inq.service || 'Construction'}</div>
                      {inq.dimensions && (inq.dimensions.length > 0 || inq.dimensions.width > 0) && (
                        <span className="badge bg-light text-dark border small mt-1">
                          {inq.dimensions.length}×{inq.dimensions.width}×{inq.dimensions.depth} {inq.dimensions.unit}
                        </span>
                      )}
                    </td>
                    <td>{getStatusBadge(inq.status)}</td>
                    <td className="text-end pe-4">
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleOpenDetail(inq)}
                          title="View Details & Follow-up Notes"
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(inq._id)}
                          disabled={deletingId === inq._id}
                          title="Delete Inquiry"
                        >
                          {deletingId === inq._id ? (
                            <span className="spinner-border spinner-border-sm" role="status" />
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* INQUIRY DETAIL & FOLLOW-UP MODAL                               */}
      {/* ============================================================== */}
      {selectedInquiry && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content rounded-4 border-0 shadow">
              {/* Modal Header */}
              <div className="modal-header border-bottom px-4 py-3 bg-light rounded-top-4">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <h3 className="modal-title h5 fw-bold text-dark mb-0">
                    Inquiry: {selectedInquiry.customerName}
                  </h3>
                  <span className="badge bg-light text-secondary border font-monospace">
                    #{selectedInquiry._id.slice(-6).toUpperCase()}
                  </span>
                  {getStatusBadge(selectedInquiry.status)}
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseDetail}
                  disabled={actionLoading || noteLoading}
                  aria-label="Close"
                />
              </div>

              {/* Modal Body */}
              <div className="modal-body px-4 py-3">
                {/* Status Transition Control */}
                <div className="p-3 bg-light rounded-3 border mb-4">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <div>
                      <span className="fw-semibold text-dark small d-block">Current Inquiry Status</span>
                      <small className="text-muted">Transitioning status automatically records an audit entry.</small>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <select
                        className="form-select form-select-sm"
                        style={{ minWidth: '150px' }}
                        value={selectedInquiry.status}
                        onChange={(e) => handleStatusChange(selectedInquiry._id, e.target.value)}
                        disabled={actionLoading}
                      >
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Completed">Completed</option>
                        <option value="Archived">Archived</option>
                      </select>
                      {actionLoading && <span className="spinner-border spinner-border-sm text-primary" />}
                    </div>
                  </div>
                </div>

                {/* Customer Contact & Quick Actions */}
                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-7">
                    <div className="card h-100 border rounded-3 p-3 bg-white">
                      <h6 className="fw-bold text-dark mb-2">Customer Information</h6>
                      <ul className="list-unstyled small mb-0">
                        <li className="mb-1.5">
                          <strong className="text-secondary">Full Name:</strong>{' '}
                          <span className="text-dark fw-semibold">{selectedInquiry.customerName}</span>
                        </li>
                        <li className="mb-1.5">
                          <strong className="text-secondary">Phone:</strong>{' '}
                          <a href={`tel:${selectedInquiry.phone}`} className="text-decoration-none fw-semibold">
                            {selectedInquiry.phone}
                          </a>
                        </li>
                        {selectedInquiry.email && (
                          <li className="mb-1.5">
                            <strong className="text-secondary">Email:</strong>{' '}
                            <a href={`mailto:${selectedInquiry.email}`} className="text-decoration-none">
                              {selectedInquiry.email}
                            </a>
                          </li>
                        )}
                        <li className="mb-1.5">
                          <strong className="text-secondary">Project Site:</strong>{' '}
                          <span className="text-dark">{selectedInquiry.location}</span>
                        </li>
                        <li className="mb-1.5">
                          <strong className="text-secondary">Submitted On:</strong>{' '}
                          <span className="text-muted">{formatDate(selectedInquiry.createdAt)}</span>
                        </li>
                        <li>
                          <strong className="text-secondary">Source:</strong>{' '}
                          <span className="text-muted">{selectedInquiry.submissionSource || 'Website Quote Form'}</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="col-12 col-md-5">
                    <div className="card h-100 border rounded-3 p-3 bg-white d-flex flex-column justify-content-between">
                      <h6 className="fw-bold text-dark mb-2">Direct Contact Actions</h6>
                      <div className="d-grid gap-2">
                        <a
                          href={getWhatsAppLink(selectedInquiry)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-success fw-bold d-flex align-items-center justify-content-center gap-2 py-2"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.031 2C6.495 2 2 6.495 2 12.031c0 1.967.574 3.864 1.66 5.485L2 22l4.636-1.616a9.98 9.98 0 0 0 5.395 1.564h.005c5.534 0 10.029-4.495 10.029-10.031 0-2.679-1.043-5.197-2.937-7.091A9.96 9.96 0 0 0 12.031 2zm0 18.25c-1.69 0-3.32-.47-4.737-1.353l-.339-.21-2.75.958.975-2.68-.225-.357A8.204 8.204 0 0 1 3.78 12.03c0-4.55 3.702-8.25 8.251-8.25 2.203 0 4.275.859 5.834 2.417a8.21 8.21 0 0 1 2.417 5.834c0 4.55-3.701 8.25-8.251 8.25zm4.516-6.195c-.247-.123-1.464-.722-1.692-.804-.227-.082-.393-.123-.558.123-.165.247-.64 1.05-.785 1.215-.144.165-.289.185-.536.062-.247-.123-1.042-.384-1.986-1.226-.735-.656-1.232-1.465-1.376-1.712-.144-.247-.015-.38.109-.503.111-.111.247-.289.37-.433.123-.144.165-.247.247-.412.083-.165.042-.309-.02-.433-.062-.123-.558-1.344-.764-1.84-.2-.484-.403-.418-.557-.426-.144-.008-.309-.01-.474-.01-.165 0-.433.062-.66.309-.227.247-.866.845-.866 2.062s.887 2.392 1.01 2.557c.124.165 1.745 2.664 4.227 3.737.591.255 1.053.407 1.413.521.594.189 1.135.162 1.562.098.477-.071 1.464-.598 1.67-1.175.207-.577.207-1.072.145-1.175-.062-.103-.227-.165-.474-.288z"/>
                          </svg>
                          <span>Chat on WhatsApp</span>
                        </a>
                        <a
                          href={`tel:${selectedInquiry.phone}`}
                          className="btn btn-sm btn-outline-primary fw-semibold d-flex align-items-center justify-content-center gap-2 py-2"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                          <span>Direct Phone Call</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pool & Project Specifications */}
                <div className="card border rounded-3 p-3 bg-white mb-4">
                  <h6 className="fw-bold text-dark mb-2">Project Specifications</h6>
                  <div className="row g-3 small">
                    <div className="col-12 col-sm-6 col-md-3">
                      <span className="text-secondary d-block">Pool Category:</span>
                      <strong className="text-dark">{selectedInquiry.poolType || 'Residential'}</strong>
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                      <span className="text-secondary d-block">Requested Service:</span>
                      <strong className="text-dark">{selectedInquiry.service || 'Construction'}</strong>
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                      <span className="text-secondary d-block">Dimensions:</span>
                      <strong className="text-dark">
                        {selectedInquiry.dimensions && (selectedInquiry.dimensions.length > 0 || selectedInquiry.dimensions.width > 0)
                          ? `${selectedInquiry.dimensions.length} × ${selectedInquiry.dimensions.width} × ${selectedInquiry.dimensions.depth} ${selectedInquiry.dimensions.unit}`
                          : 'Not specified'}
                      </strong>
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                      <span className="text-secondary d-block">Estimated Budget:</span>
                      <strong className="text-dark">{selectedInquiry.budget || 'Open / Discussion'}</strong>
                    </div>
                  </div>

                  {selectedInquiry.message && (
                    <div className="mt-3 pt-3 border-top">
                      <span className="text-secondary d-block small mb-1 fw-semibold">Customer Message / Remarks:</span>
                      <div className="p-2.5 bg-light rounded-2 text-dark small border">
                        {selectedInquiry.message}
                      </div>
                    </div>
                  )}
                </div>

                {/* Follow-Up Notes Timeline & Add Form */}
                <div className="card border rounded-3 p-3 bg-white mb-2">
                  <h6 className="fw-bold text-dark mb-2">Follow-Up &amp; Inspection Notes</h6>
                  <p className="text-muted small mb-3">
                    Record site visit observations, soil survey results, engineering quotation estimates, and customer call logs.
                  </p>

                  {/* Notes Timeline */}
                  {Array.isArray(selectedInquiry.adminNotes) && selectedInquiry.adminNotes.length > 0 ? (
                    <div className="mb-3" style={{ maxHeight: '220px', overflowY: 'auto' }}>
                      <div className="list-group list-group-flush border rounded-2">
                        {selectedInquiry.adminNotes.map((note, idx) => (
                          <div key={idx} className="list-group-item py-2 px-3 small">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span className="fw-semibold text-dark">{note.author || 'Admin'}</span>
                              <span className="text-muted font-monospace" style={{ fontSize: '0.75rem' }}>
                                {formatDate(note.createdAt)}
                              </span>
                            </div>
                            <p className="mb-0 text-secondary">{note.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="alert alert-light border small text-muted mb-3 py-2">
                      No follow-up notes recorded yet. Add your first note below.
                    </div>
                  )}

                  {/* Add Note Form */}
                  <form onSubmit={handleAddNote}>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Write a follow-up note (e.g. Called client, scheduled site visit for Friday)..."
                        value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                        disabled={noteLoading}
                      />
                      <button
                        type="submit"
                        className="btn btn-sm btn-primary"
                        disabled={noteLoading || !newNoteText.trim()}
                      >
                        {noteLoading ? (
                          <span className="spinner-border spinner-border-sm" role="status" />
                        ) : (
                          'Add Note'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer border-top px-4 py-2.5 bg-light rounded-bottom-4 justify-content-between">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(selectedInquiry._id)}
                  disabled={actionLoading}
                >
                  Delete Inquiry
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={handleCloseDetail}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

