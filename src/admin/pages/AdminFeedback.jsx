/**
 * ==============================================================================
 * ADMIN CUSTOMER FEEDBACK & REVIEWS MANAGEMENT (src/admin/pages/AdminFeedback.jsx)
 * ==============================================================================
 * Student / Developer Guide:
 * Administrative moderation dashboard for customer feedback.
 * 
 * Capabilities:
 * - View all customer reviews with date, customer name, email, rating, and message.
 * - Real-time KPI cards breakdown (Total, Pending, Reviewed, Approved, Rejected).
 * - Instant status filter pills and text search.
 * - One-click Approve (publishes to website), Mark Reviewed, or Reject actions.
 * - Permanent Delete with confirmation dialog.
 * - Connected to protected endpoints:
 *   - GET    /api/admin/feedback
 *   - PUT    /api/admin/feedback/:id
 *   - DELETE /api/admin/feedback/:id
 * ==============================================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

const STATUS_FILTERS = ['All', 'Pending', 'Reviewed', 'Approved', 'Rejected'];

export default function AdminFeedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    approved: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'danger', text: '' }

  // Filter & Search state
  const [activeStatus, setActiveStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Detail state
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [adminNotesText, setAdminNotesText] = useState('');
  const [modalStatus, setModalStatus] = useState('Pending');
  const [deletingId, setDeletingId] = useState(null);

  // Fetch feedback from backend
  const fetchFeedback = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeStatus !== 'All') {
        params.status = activeStatus;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const res = await api.get('/api/admin/feedback', { params });
      if (res && res.success) {
        setFeedbackList(res.data || []);
        if (res.stats) {
          setStats(res.stats);
        }
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.data?.message || err.message || 'Failed to load feedback records.'
      });
    } finally {
      setLoading(false);
    }
  }, [activeStatus, searchQuery]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  // Open Details Modal
  const handleOpenDetail = (item) => {
    setSelectedFeedback(item);
    setAdminNotesText(item.adminNotes || '');
    setModalStatus(item.status);
  };

  const handleCloseDetail = () => {
    setSelectedFeedback(null);
    setAdminNotesText('');
  };

  // Quick Status Update
  const handleUpdateStatus = async (id, newStatus, notes = undefined) => {
    try {
      setActionLoading(true);
      const payload = { status: newStatus };
      if (notes !== undefined) {
        payload.adminNotes = notes;
      }

      const res = await api.put(`/api/admin/feedback/${id}`, payload);
      if (res && res.success) {
        setMessage({
          type: 'success',
          text: `Feedback marked as "${newStatus}".`
        });

        // Update local list
        setFeedbackList((prev) =>
          prev.map((item) => (item._id === id ? res.data : item))
        );

        // Update modal state if open
        if (selectedFeedback && selectedFeedback._id === id) {
          setSelectedFeedback(res.data);
          setModalStatus(res.data.status);
        }

        // Refresh stats
        fetchFeedback();
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.data?.message || err.message || 'Failed to update feedback status.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Feedback
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this feedback review? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await api.delete(`/api/admin/feedback/${id}`);
      if (res && res.success) {
        setMessage({
          type: 'success',
          text: 'Feedback record deleted successfully.'
        });

        if (selectedFeedback && selectedFeedback._id === id) {
          setSelectedFeedback(null);
        }
        fetchFeedback();
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.data?.message || err.message || 'Failed to delete feedback record.'
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="badge bg-warning text-dark px-2.5 py-1.5 fw-semibold">Pending</span>;
      case 'Reviewed':
        return <span className="badge bg-info text-dark px-2.5 py-1.5 fw-semibold">Reviewed</span>;
      case 'Approved':
        return <span className="badge bg-success px-2.5 py-1.5 fw-semibold">Approved (Public)</span>;
      case 'Rejected':
        return <span className="badge bg-danger px-2.5 py-1.5 fw-semibold">Rejected</span>;
      default:
        return <span className="badge bg-light text-dark border px-2.5 py-1.5">{status}</span>;
    }
  };

  // Render Stars
  const renderStars = (rating) => {
    return (
      <div className="d-flex align-items-center gap-1" title={`${rating} Stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={star <= rating ? '#f59e0b' : 'none'}
            stroke={star <= rating ? '#f59e0b' : '#cbd5e1'}
            strokeWidth="2"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
    );
  };

  // Format Date
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="admin-feedback-page">
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
            <h1 className="h3 fw-bold text-dark mb-0">Customer Feedback &amp; Reviews</h1>
            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 small">
              Moderation
            </span>
          </div>
          <p className="text-secondary small mb-0">
            Moderate public customer ratings and reviews. Only feedback marked as <strong>Approved</strong> will be displayed on the public website.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary d-flex align-items-center gap-2 align-self-start align-self-md-auto"
          onClick={fetchFeedback}
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

      {/* KPI Cards Strip */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-4 col-xl-2.4 col-lg-3">
          <div
            className={`admin-card p-3 text-center ${activeStatus === 'All' ? 'border-primary shadow-sm bg-light' : ''}`}
            onClick={() => setActiveStatus('All')}
            style={{ cursor: 'pointer' }}
          >
            <div className="text-muted small fw-semibold text-uppercase">Total</div>
            <div className="fs-3 fw-bold text-dark">{stats.total || 0}</div>
          </div>
        </div>

        <div className="col-6 col-md-4 col-xl-2.4 col-lg-3">
          <div
            className={`admin-card p-3 text-center ${activeStatus === 'Pending' ? 'border-warning shadow-sm bg-warning bg-opacity-10' : ''}`}
            onClick={() => setActiveStatus('Pending')}
            style={{ cursor: 'pointer' }}
          >
            <div className="text-warning text-dark small fw-semibold text-uppercase">Pending Review</div>
            <div className="fs-3 fw-bold text-dark">{stats.pending || 0}</div>
          </div>
        </div>

        <div className="col-6 col-md-4 col-xl-2.4 col-lg-2">
          <div
            className={`admin-card p-3 text-center ${activeStatus === 'Reviewed' ? 'border-info shadow-sm bg-info bg-opacity-10' : ''}`}
            onClick={() => setActiveStatus('Reviewed')}
            style={{ cursor: 'pointer' }}
          >
            <div className="text-info text-dark small fw-semibold text-uppercase">Reviewed</div>
            <div className="fs-3 fw-bold text-dark">{stats.reviewed || 0}</div>
          </div>
        </div>

        <div className="col-6 col-md-4 col-xl-2.4 col-lg-2">
          <div
            className={`admin-card p-3 text-center ${activeStatus === 'Approved' ? 'border-success shadow-sm bg-success bg-opacity-10' : ''}`}
            onClick={() => setActiveStatus('Approved')}
            style={{ cursor: 'pointer' }}
          >
            <div className="text-success small fw-semibold text-uppercase">Approved (Live)</div>
            <div className="fs-3 fw-bold text-dark">{stats.approved || 0}</div>
          </div>
        </div>

        <div className="col-6 col-md-4 col-xl-2.4 col-lg-2">
          <div
            className={`admin-card p-3 text-center ${activeStatus === 'Rejected' ? 'border-danger shadow-sm bg-danger bg-opacity-10' : ''}`}
            onClick={() => setActiveStatus('Rejected')}
            style={{ cursor: 'pointer' }}
          >
            <div className="text-danger small fw-semibold text-uppercase">Rejected</div>
            <div className="fs-3 fw-bold text-dark">{stats.rejected || 0}</div>
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
                placeholder="Search by customer, email, service, or message..."
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
              {STATUS_FILTERS.map((status) => (
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

      {/* Feedback Table Card */}
      <div className="admin-card overflow-hidden">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading feedback...</span>
            </div>
            <p className="text-muted small mt-2">Loading feedback records from MongoDB Atlas...</p>
          </div>
        ) : feedbackList.length === 0 ? (
          <div className="text-center py-5 px-3">
            <div className="mb-3 text-muted">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <h5 className="fw-bold text-dark">No feedback records found</h5>
            <p className="text-muted small mb-0">
              {searchQuery || activeStatus !== 'All'
                ? 'Try adjusting your search criteria or status filter.'
                : 'Customer submissions from the website will appear here for your review.'}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-uppercase small" style={{ fontSize: '0.75rem', letterSpacing: '0.04em' }}>
                <tr>
                  <th scope="col" className="ps-4">Date</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Service</th>
                  <th scope="col">Rating</th>
                  <th scope="col" style={{ maxWidth: '300px' }}>Message Preview</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody className="border-top-0">
                {feedbackList.map((item) => (
                  <tr key={item._id}>
                    <td className="ps-4">
                      <span className="small text-muted">{formatDate(item.createdAt)}</span>
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{item.customerName}</div>
                      {item.email ? (
                        <a href={`mailto:${item.email}`} className="small text-muted text-decoration-none">
                          {item.email}
                        </a>
                      ) : (
                        <span className="small text-muted fst-italic">No email provided</span>
                      )}
                    </td>
                    <td>
                      <span className="badge bg-light text-secondary border small">
                        {item.serviceType}
                      </span>
                    </td>
                    <td>{renderStars(item.rating)}</td>
                    <td style={{ maxWidth: '300px' }}>
                      <p className="mb-0 text-secondary text-truncate small" title={item.message}>
                        "{item.message}"
                      </p>
                    </td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td className="text-end pe-4">
                      <div className="d-flex justify-content-end gap-1 flex-wrap">
                        {/* Quick Approve Button */}
                        {item.status !== 'Approved' && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleUpdateStatus(item._id, 'Approved')}
                            disabled={actionLoading}
                            title="Approve for public website display"
                          >
                            Approve
                          </button>
                        )}

                        {/* Quick Reviewed Button */}
                        {item.status === 'Pending' && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-info"
                            onClick={() => handleUpdateStatus(item._id, 'Reviewed')}
                            disabled={actionLoading}
                            title="Mark as reviewed (not public)"
                          >
                            Reviewed
                          </button>
                        )}

                        {/* Quick Reject Button */}
                        {item.status !== 'Rejected' && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => handleUpdateStatus(item._id, 'Rejected')}
                            disabled={actionLoading}
                            title="Reject review"
                          >
                            Reject
                          </button>
                        )}

                        {/* Details Modal Button */}
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleOpenDetail(item)}
                          title="View Details & Notes"
                        >
                          View
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(item._id)}
                          disabled={deletingId === item._id}
                          title="Delete permanently"
                        >
                          {deletingId === item._id ? (
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

      {/* Detail & Moderation Modal */}
      {selectedFeedback && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom px-4 py-3 bg-light rounded-top-4">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <h3 className="modal-title h5 fw-bold text-dark mb-0">
                    Review: {selectedFeedback.customerName}
                  </h3>
                  {getStatusBadge(selectedFeedback.status)}
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseDetail}
                  disabled={actionLoading}
                  aria-label="Close"
                />
              </div>

              <div className="modal-body px-4 py-4">
                {/* Review Details Card */}
                <div className="card border rounded-3 p-3 bg-white mb-4">
                  <div className="row g-3 mb-3">
                    <div className="col-12 col-sm-6">
                      <span className="text-secondary small d-block">Customer Name:</span>
                      <strong className="text-dark">{selectedFeedback.customerName}</strong>
                    </div>

                    <div className="col-12 col-sm-6">
                      <span className="text-secondary small d-block">Email Address:</span>
                      {selectedFeedback.email ? (
                        <a href={`mailto:${selectedFeedback.email}`} className="text-decoration-none">
                          {selectedFeedback.email}
                        </a>
                      ) : (
                        <span className="text-muted small fst-italic">None provided</span>
                      )}
                    </div>

                    <div className="col-12 col-sm-6">
                      <span className="text-secondary small d-block">Service Received:</span>
                      <span className="badge bg-light text-secondary border">
                        {selectedFeedback.serviceType}
                      </span>
                    </div>

                    <div className="col-12 col-sm-6">
                      <span className="text-secondary small d-block">Rating:</span>
                      <div className="d-flex align-items-center gap-2 mt-1">
                        {renderStars(selectedFeedback.rating)}
                        <span className="small fw-semibold text-secondary">
                          ({selectedFeedback.rating}/5)
                        </span>
                      </div>
                    </div>

                    <div className="col-12">
                      <span className="text-secondary small d-block">Submitted On:</span>
                      <span className="small text-muted">{formatDate(selectedFeedback.createdAt)}</span>
                    </div>
                  </div>

                  <div className="border-top pt-3">
                    <span className="text-secondary small d-block fw-semibold mb-1">Feedback Message:</span>
                    <div className="p-3 bg-light rounded-2 text-dark small border" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                      "{selectedFeedback.message}"
                    </div>
                  </div>
                </div>

                {/* Moderation Controls */}
                <div className="card border rounded-3 p-3 bg-white">
                  <h6 className="fw-bold text-dark mb-3">Moderation Actions</h6>

                  <div className="row g-3 mb-3">
                    <div className="col-12 col-sm-6">
                      <label htmlFor="modalStatusSelect" className="form-label small fw-semibold text-dark">
                        Change Publication Status
                      </label>
                      <select
                        id="modalStatusSelect"
                        className="form-select form-select-sm"
                        value={modalStatus}
                        onChange={(e) => setModalStatus(e.target.value)}
                        disabled={actionLoading}
                      >
                        <option value="Pending">Pending (Hidden from website)</option>
                        <option value="Reviewed">Reviewed (Inspected, hidden)</option>
                        <option value="Approved">Approved (Publicly displayed on website)</option>
                        <option value="Rejected">Rejected (Discarded, hidden)</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label htmlFor="modalAdminNotes" className="form-label small fw-semibold text-dark">
                        Internal Admin / Moderation Notes
                      </label>
                      <textarea
                        id="modalAdminNotes"
                        rows="2"
                        className="form-control form-control-sm"
                        placeholder="Internal notes (e.g. Verified residential villa construction client in Baner)..."
                        value={adminNotesText}
                        onChange={(e) => setAdminNotesText(e.target.value)}
                        disabled={actionLoading}
                        maxLength={500}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-primary px-3"
                      disabled={actionLoading}
                      onClick={() => handleUpdateStatus(selectedFeedback._id, modalStatus, adminNotesText)}
                    >
                      {actionLoading ? 'Saving...' : 'Save Moderation Updates'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-top px-4 py-2.5 bg-light rounded-bottom-4 justify-content-between">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(selectedFeedback._id)}
                  disabled={actionLoading}
                >
                  Delete Review
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

