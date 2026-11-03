/**
 * ==============================================================================
 * ADMIN SERVICES MANAGEMENT (src/admin/pages/AdminServices.jsx)
 * ==============================================================================
 * Student / Developer Guide:
 * Module B: Services Management CRUD
 * 
 * Capabilities:
 * - View all services in a clean, responsive table.
 * - Add a new service with validation.
 * - Edit an existing service.
 * - Activate or Deactivate a service (instant toggle).
 * - Delete a service with confirmation.
 * - Connected to /api/admin/services REST endpoints with HttpOnly cookie authentication.
 * ==============================================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

const AVAILABLE_ICONS = [
  { id: 'hammer', label: 'Hammer (Construction)' },
  { id: 'water-sparkle', label: 'Water Sparkle (Maintenance)' },
  { id: 'filter', label: 'Filter (Filtration Systems)' },
  { id: 'refresh', label: 'Refresh (Renovation)' },
  { id: 'shield', label: 'Shield (Waterproofing)' },
  { id: 'gear', label: 'Gear (Equipment)' },
  { id: 'sparkles', label: 'Sparkles (Custom Consulting)' }
];

const INITIAL_FORM = {
  title: '',
  serviceId: '',
  shortDescription: '',
  fullDescription: '',
  image: '/images/pool-construction.jpg',
  icon: 'hammer',
  keyPointsText: '',
  inquiryMessage: '',
  isActive: true,
  order: 0
};

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'danger', text: '' }

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});

  // Fetch all services from backend
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/services');
      if (res && res.success) {
        setServices(res.data || []);
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.data?.message || err.message || 'Failed to load services.'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Handle open Add Modal
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      ...INITIAL_FORM,
      order: services.length + 1
    });
    setFormErrors({});
    setShowModal(true);
  };

  // Handle open Edit Modal
  const handleOpenEdit = (service) => {
    setEditingId(service._id);
    setFormData({
      title: service.title || '',
      serviceId: service.serviceId || '',
      shortDescription: service.shortDescription || '',
      fullDescription: service.fullDescription || '',
      image: service.image || '/images/pool-construction.jpg',
      icon: service.icon || 'hammer',
      keyPointsText: Array.isArray(service.keyPoints) ? service.keyPoints.join('\n') : '',
      inquiryMessage: service.inquiryMessage || '',
      isActive: service.isActive !== undefined ? service.isActive : true,
      order: service.order || 0
    });
    setFormErrors({});
    setShowModal(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    if (!actionLoading) {
      setShowModal(false);
      setEditingId(null);
      setFormData(INITIAL_FORM);
      setFormErrors({});
    }
  };

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Validate Modal Inputs
  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Service title is required.';
    if (!formData.shortDescription.trim()) errors.shortDescription = 'Short description is required.';
    if (!formData.fullDescription.trim()) errors.fullDescription = 'Full detailed description is required.';
    return errors;
  };

  // Handle Submit Form (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setActionLoading(true);
      const payload = {
        title: formData.title.trim(),
        serviceId: formData.serviceId.trim(),
        shortDescription: formData.shortDescription.trim(),
        fullDescription: formData.fullDescription.trim(),
        image: formData.image.trim(),
        icon: formData.icon,
        keyPoints: formData.keyPointsText,
        inquiryMessage: formData.inquiryMessage.trim(),
        isActive: formData.isActive,
        order: Number(formData.order) || 0
      };

      if (editingId) {
        // Update existing service
        const res = await api.put(`/api/admin/services/${editingId}`, payload);
        setMessage({ type: 'success', text: res.message || 'Service updated successfully!' });
      } else {
        // Create new service
        const res = await api.post('/api/admin/services', payload);
        setMessage({ type: 'success', text: res.message || 'Service created successfully!' });
      }

      handleCloseModal();
      await fetchServices();
    } catch (err) {
      setFormErrors({
        submit: err.data?.message || err.message || 'Failed to save service. Check inputs.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle Active/Inactive Status
  const handleToggleStatus = async (service) => {
    try {
      const res = await api.patch(`/api/admin/services/${service._id}/toggle`);
      setMessage({
        type: 'success',
        text: res.message || `Service status updated.`
      });
      await fetchServices();
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.data?.message || err.message || 'Failed to update status.'
      });
    }
  };

  // Delete Service
  const handleDelete = async (service) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the service "${service.title}"?\n\nThis cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const res = await api.delete(`/api/admin/services/${service._id}`);
      setMessage({ type: 'success', text: res.message || 'Service deleted successfully.' });
      await fetchServices();
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.data?.message || err.message || 'Failed to delete service.'
      });
    }
  };

  const activeCount = services.filter((s) => s.isActive).length;
  const inactiveCount = services.length - activeCount;

  return (
    <div className="admin-services-page">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1 small">
              Module B
            </span>
            <h1 className="h4 fw-bold text-dark mb-0">Services Management</h1>
          </div>
          <p className="text-secondary small mb-0">
            Create, update, and manage swimming pool services shown on the public website and quote form.
          </p>
        </div>

        {/* Action Button & Badges */}
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 small">
            {activeCount} Active
          </span>
          {inactiveCount > 0 && (
            <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 px-3 py-2 small">
              {inactiveCount} Inactive
            </span>
          )}
          <button
            type="button"
            className="btn btn-primary d-inline-flex align-items-center gap-2 px-3 py-2 fw-semibold rounded-3 shadow-sm"
            onClick={handleOpenAdd}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add New Service</span>
          </button>
        </div>
      </div>

      {/* Global Status Banner */}
      {message && (
        <div
          className={`alert alert-${message.type} alert-dismissible fade show d-flex align-items-center gap-2 py-2 px-3 rounded-3 mb-4`}
          role="alert"
        >
          <span>{message.text}</span>
          <button
            type="button"
            className="btn-close ms-auto p-2"
            onClick={() => setMessage(null)}
            aria-label="Close"
          />
        </div>
      )}

      {/* Services Table Card */}
      <div className="admin-card overflow-hidden">
        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <h2 className="h6 fw-bold mb-0 text-dark">
            All Services ({services.length})
          </h2>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={fetchServices}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh List'}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted small mb-0">Fetching services from MongoDB Atlas...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-5 p-4">
            <div
              className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center bg-light text-muted"
              style={{ width: '56px', height: '56px' }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <h3 className="h6 fw-bold text-dark mb-1">No services found in database</h3>
            <p className="text-muted small mb-3">Add your first service or run the seed script to import default services.</p>
            <button type="button" className="btn btn-sm btn-primary" onClick={handleOpenAdd}>
              Add Service Now
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-secondary small text-uppercase">
                <tr>
                  <th style={{ width: '60px' }}>Order</th>
                  <th style={{ width: '80px' }}>Image</th>
                  <th>Service Title &amp; Details</th>
                  <th style={{ width: '130px' }}>Icon</th>
                  <th style={{ width: '110px' }}>Status</th>
                  <th style={{ width: '230px' }} className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service._id}>
                    {/* Sort Order */}
                    <td className="fw-semibold text-muted text-center">
                      #{service.order}
                    </td>

                    {/* Image Thumbnail */}
                    <td>
                      <img
                        src={service.image}
                        alt={service.title}
                        className="rounded-2 border object-fit-cover"
                        style={{ width: '56px', height: '42px', backgroundColor: '#e2e8f0' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/pool-construction.jpg';
                        }}
                      />
                    </td>

                    {/* Title & Short Description */}
                    <td>
                      <div className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                        <span>{service.title}</span>
                        <code className="text-muted small" style={{ fontSize: '0.75rem' }}>
                          {service.serviceId}
                        </code>
                      </div>
                      <p className="text-muted small mb-0 text-truncate" style={{ maxWidth: '420px' }}>
                        {service.shortDescription}
                      </p>
                    </td>

                    {/* Icon */}
                    <td>
                      <span className="badge bg-light text-dark border px-2 py-1 small">
                        {service.icon}
                      </span>
                    </td>

                    {/* Status Pill */}
                    <td>
                      {service.isActive ? (
                        <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1">
                          ● Active
                        </span>
                      ) : (
                        <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 px-2 py-1">
                          ○ Inactive
                        </span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        {/* Toggle Status Button */}
                        <button
                          type="button"
                          className={`btn ${service.isActive ? 'btn-outline-warning' : 'btn-outline-success'}`}
                          onClick={() => handleToggleStatus(service)}
                          title={service.isActive ? 'Deactivate service (hide on public site)' : 'Activate service (show on public site)'}
                        >
                          {service.isActive ? 'Deactivate' : 'Activate'}
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={() => handleOpenEdit(service)}
                          title="Edit service details"
                        >
                          Edit
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => handleDelete(service)}
                          title="Delete service"
                        >
                          Delete
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
      {/* ADD / EDIT SERVICE MODAL                                       */}
      {/* ============================================================== */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content rounded-4 border-0 shadow">
              {/* Modal Header */}
              <div className="modal-header border-bottom px-4 py-3">
                <h3 className="modal-title h5 fw-bold text-dark mb-0">
                  {editingId ? 'Edit Service' : 'Add New Service'}
                </h3>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  disabled={actionLoading}
                  aria-label="Close"
                />
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit}>
                <div className="modal-body px-4 py-3">
                  {formErrors.submit && (
                    <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3">
                      {formErrors.submit}
                    </div>
                  )}

                  {/* Title & Slug */}
                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-7">
                      <label htmlFor="serviceTitle" className="form-label small fw-semibold text-dark">
                        Service Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="serviceTitle"
                        name="title"
                        className={`form-control ${formErrors.title ? 'is-invalid' : ''}`}
                        placeholder="e.g. Swimming Pool Construction"
                        value={formData.title}
                        onChange={handleChange}
                        disabled={actionLoading}
                        required
                      />
                      {formErrors.title && <div className="invalid-feedback">{formErrors.title}</div>}
                    </div>

                    <div className="col-12 col-md-5">
                      <label htmlFor="serviceSlug" className="form-label small fw-semibold text-dark">
                        Identifier Slug (Unique)
                      </label>
                      <input
                        type="text"
                        id="serviceSlug"
                        name="serviceId"
                        className="form-control"
                        placeholder="e.g. pool-construction"
                        value={formData.serviceId}
                        onChange={handleChange}
                        disabled={actionLoading}
                      />
                      <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                        Auto-generated from title if left blank.
                      </small>
                    </div>
                  </div>

                  {/* Icon, Order, and Active Status */}
                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-5">
                      <label htmlFor="serviceIcon" className="form-label small fw-semibold text-dark">
                        Icon Symbol
                      </label>
                      <select
                        id="serviceIcon"
                        name="icon"
                        className="form-select"
                        value={formData.icon}
                        onChange={handleChange}
                        disabled={actionLoading}
                      >
                        {AVAILABLE_ICONS.map((icon) => (
                          <option key={icon.id} value={icon.id}>
                            {icon.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-6 col-md-3">
                      <label htmlFor="serviceOrder" className="form-label small fw-semibold text-dark">
                        Display Order
                      </label>
                      <input
                        type="number"
                        id="serviceOrder"
                        name="order"
                        min="0"
                        className="form-control"
                        value={formData.order}
                        onChange={handleChange}
                        disabled={actionLoading}
                      />
                    </div>

                    <div className="col-6 col-md-4 d-flex align-items-end">
                      <div className="form-check form-switch mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="serviceIsActive"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleChange}
                          disabled={actionLoading}
                        />
                        <label className="form-check-label fw-semibold small text-dark" htmlFor="serviceIsActive">
                          Active on Website
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Image Path */}
                  <div className="mb-3">
                    <label htmlFor="serviceImage" className="form-label small fw-semibold text-dark">
                      Image Path or URL
                    </label>
                    <input
                      type="text"
                      id="serviceImage"
                      name="image"
                      className="form-control"
                      placeholder="e.g. /images/pool-construction.jpg"
                      value={formData.image}
                      onChange={handleChange}
                      disabled={actionLoading}
                    />
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                      References images inside the public/images folder or an external image link.
                    </small>
                  </div>

                  {/* Short Description */}
                  <div className="mb-3">
                    <label htmlFor="serviceShortDesc" className="form-label small fw-semibold text-dark">
                      Short Description (Summary Card) <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="serviceShortDesc"
                      name="shortDescription"
                      rows="2"
                      className={`form-control ${formErrors.shortDescription ? 'is-invalid' : ''}`}
                      placeholder="Brief 1-2 sentence overview shown on homepage and summary cards..."
                      value={formData.shortDescription}
                      onChange={handleChange}
                      disabled={actionLoading}
                      required
                    />
                    {formErrors.shortDescription && (
                      <div className="invalid-feedback">{formErrors.shortDescription}</div>
                    )}
                  </div>

                  {/* Full Description */}
                  <div className="mb-3">
                    <label htmlFor="serviceFullDesc" className="form-label small fw-semibold text-dark">
                      Full Detailed Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="serviceFullDesc"
                      name="fullDescription"
                      rows="3"
                      className={`form-control ${formErrors.fullDescription ? 'is-invalid' : ''}`}
                      placeholder="Comprehensive engineering and scope description rendered on the dedicated Services page..."
                      value={formData.fullDescription}
                      onChange={handleChange}
                      disabled={actionLoading}
                      required
                    />
                    {formErrors.fullDescription && (
                      <div className="invalid-feedback">{formErrors.fullDescription}</div>
                    )}
                  </div>

                  {/* Key Highlights / Points */}
                  <div className="mb-3">
                    <label htmlFor="serviceKeyPoints" className="form-label small fw-semibold text-dark">
                      Key Service Deliverables (One per line)
                    </label>
                    <textarea
                      id="serviceKeyPoints"
                      name="keyPointsText"
                      rows="3"
                      className="form-control"
                      placeholder="High-grade steel rebar reinforcement&#10;Premium mosaic tile installation&#10;Integrated steps and lighting conduits"
                      value={formData.keyPointsText}
                      onChange={handleChange}
                      disabled={actionLoading}
                    />
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                      Each line becomes a bullet point with a checkmark on the public Services page.
                    </small>
                  </div>

                  {/* WhatsApp Inquiry Message */}
                  <div className="mb-2">
                    <label htmlFor="serviceInquiryMsg" className="form-label small fw-semibold text-dark">
                      Prefilled WhatsApp Inquiry Message
                    </label>
                    <input
                      type="text"
                      id="serviceInquiryMsg"
                      name="inquiryMessage"
                      className="form-control"
                      placeholder="e.g. Hello, I would like to inquire about Swimming Pool Construction services..."
                      value={formData.inquiryMessage}
                      onChange={handleChange}
                      disabled={actionLoading}
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer border-top px-4 py-3 bg-light">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCloseModal}
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-4 fw-semibold"
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                        Saving to MongoDB...
                      </>
                    ) : (
                      editingId ? 'Save Changes' : 'Create Service'
                    )}
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

