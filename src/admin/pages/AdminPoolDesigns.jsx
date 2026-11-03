/**
 * ==============================================================================
 * ADMIN POOL DESIGNS MANAGEMENT (src/admin/pages/AdminPoolDesigns.jsx)
 * ==============================================================================
 * Student / Developer Guide:
 * Module C: Pool Designs Management CRUD
 * 
 * Capabilities:
 * - View all pool designs in a table with category relationship.
 * - Add new designs linked to an existing PoolCategory.
 * - Edit design details, photos, specs, and disclaimers.
 * - Activate or Deactivate designs.
 * - Delete designs with confirmation.
 * ==============================================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const INITIAL_FORM = {
  title: '',
  designId: '',
  categoryId: '',
  image: '/images/hero-pool-1.jpg',
  dimensions: '',
  description: '',
  specsText: '',
  inquiryMessage: '',
  isDisclaimerNotice: false,
  disclaimerText: '',
  isActive: true,
  order: 0
};

export default function AdminPoolDesigns() {
  const [designs, setDesigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});

  // Fetch designs and categories
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [designsRes, catsRes] = await Promise.all([
        api.get('/api/admin/pool-designs'),
        api.get('/api/admin/pool-categories')
      ]);

      if (designsRes && designsRes.success) {
        setDesigns(designsRes.data || []);
      }
      if (catsRes && catsRes.success) {
        setCategories(catsRes.data || []);
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.data?.message || err.message || 'Failed to load pool designs or categories.'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      ...INITIAL_FORM,
      categoryId: categories.length > 0 ? categories[0]._id : '',
      order: designs.length + 1
    });
    setFormErrors({});
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (design) => {
    setEditingId(design._id);
    const catId = typeof design.category === 'object' && design.category !== null
      ? design.category._id
      : design.category;

    setFormData({
      title: design.title || '',
      designId: design.designId || '',
      categoryId: catId || (categories.length > 0 ? categories[0]._id : ''),
      image: design.image || '/images/hero-pool-1.jpg',
      dimensions: design.dimensions || '',
      description: design.description || '',
      specsText: Array.isArray(design.specifications) ? design.specifications.join('\n') : '',
      inquiryMessage: design.inquiryMessage || '',
      isDisclaimerNotice: Boolean(design.isDisclaimerNotice),
      disclaimerText: design.disclaimerText || '',
      isActive: design.isActive !== undefined ? design.isActive : true,
      order: design.order || 0
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

  // Validation
  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Design title is required.';
    if (!formData.description.trim()) errors.description = 'Description is required.';
    if (!formData.categoryId) errors.categoryId = 'Please select a parent pool category.';
    return errors;
  };

  // Submit Add / Edit
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
        designId: formData.designId.trim(),
        categoryId: formData.categoryId,
        image: formData.image.trim(),
        dimensions: formData.dimensions.trim(),
        description: formData.description.trim(),
        specifications: formData.specsText,
        inquiryMessage: formData.inquiryMessage.trim(),
        isDisclaimerNotice: formData.isDisclaimerNotice,
        disclaimerText: formData.disclaimerText.trim(),
        isActive: formData.isActive,
        order: Number(formData.order) || 0
      };

      if (editingId) {
        const res = await api.put(`/api/admin/pool-designs/${editingId}`, payload);
        setMessage({ type: 'success', text: res.message || 'Pool design updated successfully!' });
      } else {
        const res = await api.post('/api/admin/pool-designs', payload);
        setMessage({ type: 'success', text: res.message || 'Pool design created successfully!' });
      }

      handleCloseModal();
      await fetchData();
    } catch (err) {
      setFormErrors({
        submit: err.data?.message || err.message || 'Failed to save pool design.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle Active Status
  const handleToggleStatus = async (design) => {
    try {
      const res = await api.patch(`/api/admin/pool-designs/${design._id}/toggle`);
      setMessage({ type: 'success', text: res.message });
      await fetchData();
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.data?.message || err.message || 'Failed to update status.'
      });
    }
  };

  // Delete Design
  const handleDelete = async (design) => {
    const confirmed = window.confirm(`Are you sure you want to delete pool design "${design.title}"?`);
    if (!confirmed) return;

    try {
      const res = await api.delete(`/api/admin/pool-designs/${design._id}`);
      setMessage({ type: 'success', text: res.message || 'Pool design deleted successfully.' });
      await fetchData();
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.data?.message || err.message || 'Failed to delete pool design.'
      });
    }
  };

  const activeCount = designs.filter((d) => d.isActive).length;

  return (
    <div className="admin-pool-designs-page">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1 small">
              Module C - Designs
            </span>
            <h1 className="h4 fw-bold text-dark mb-0">Pool Designs Showcase</h1>
          </div>
          <p className="text-secondary small mb-0">
            Manage individual swimming pool models, photographs, technical specifications, and feasibility notes.
          </p>
        </div>

        {/* Action Controls */}
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <Link to="/admin/pool-categories" className="btn btn-outline-secondary btn-sm px-3 py-2 fw-semibold rounded-3">
            ← Manage Categories
          </Link>
          <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 small">
            {activeCount} Active
          </span>
          <button
            type="button"
            className="btn btn-primary d-inline-flex align-items-center gap-2 px-3 py-2 fw-semibold rounded-3 shadow-sm"
            onClick={handleOpenAdd}
            disabled={categories.length === 0}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add New Design</span>
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

      {/* Designs Table Card */}
      <div className="admin-card overflow-hidden">
        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <h2 className="h6 fw-bold mb-0 text-dark">
            All Pool Designs ({designs.length})
          </h2>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={fetchData}
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
            <p className="text-muted small mb-0">Fetching designs from MongoDB Atlas...</p>
          </div>
        ) : designs.length === 0 ? (
          <div className="text-center py-5 p-4">
            <h3 className="h6 fw-bold text-dark mb-1">No pool designs found</h3>
            <p className="text-muted small mb-3">Add your first pool design or run the seed script to import default designs.</p>
            <button type="button" className="btn btn-sm btn-primary" onClick={handleOpenAdd}>
              Add Design Now
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-secondary small text-uppercase">
                <tr>
                  <th style={{ width: '60px' }}>Order</th>
                  <th style={{ width: '80px' }}>Photo</th>
                  <th>Pool Design Title &amp; Details</th>
                  <th style={{ width: '170px' }}>Category</th>
                  <th style={{ width: '130px' }} className="text-center">Specifications</th>
                  <th style={{ width: '110px' }}>Status</th>
                  <th style={{ width: '230px' }} className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {designs.map((design) => (
                  <tr key={design._id}>
                    <td className="fw-semibold text-muted text-center">
                      #{design.order}
                    </td>

                    <td>
                      <img
                        src={design.image}
                        alt={design.title}
                        className="rounded-2 border object-fit-cover"
                        style={{ width: '56px', height: '42px', backgroundColor: '#e2e8f0' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/hero-pool-1.jpg';
                        }}
                      />
                    </td>

                    <td>
                      <div className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                        <span>{design.title}</span>
                        <code className="text-muted small" style={{ fontSize: '0.75rem' }}>
                          {design.designId}
                        </code>
                      </div>
                      <p className="text-muted small mb-0 text-truncate" style={{ maxWidth: '380px' }}>
                        {design.description}
                      </p>
                      {design.isDisclaimerNotice && (
                        <span className="badge bg-warning bg-opacity-10 text-dark border border-warning small mt-1">
                          ⚠ Movable/Portable Notice
                        </span>
                      )}
                    </td>

                    <td>
                      <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1">
                        {design.categoryLabel || design.category?.label || 'General'}
                      </span>
                    </td>

                    <td className="text-center">
                      <span className="badge bg-light text-secondary border px-2 py-1">
                        {design.specifications?.length || 0} spec{design.specifications?.length === 1 ? '' : 's'}
                      </span>
                    </td>

                    <td>
                      {design.isActive ? (
                        <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1">
                          ● Active
                        </span>
                      ) : (
                        <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 px-2 py-1">
                          ○ Inactive
                        </span>
                      )}
                    </td>

                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className={`btn ${design.isActive ? 'btn-outline-warning' : 'btn-outline-success'}`}
                          onClick={() => handleToggleStatus(design)}
                          title={design.isActive ? 'Deactivate design on public gallery' : 'Activate design'}
                        >
                          {design.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={() => handleOpenEdit(design)}
                          title="Edit design"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => handleDelete(design)}
                          title="Delete design"
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
      {/* ADD / EDIT POOL DESIGN MODAL                                   */}
      {/* ============================================================== */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom px-4 py-3">
                <h3 className="modal-title h5 fw-bold text-dark mb-0">
                  {editingId ? 'Edit Pool Design' : 'Add New Pool Design'}
                </h3>
                <button type="button" className="btn-close" onClick={handleCloseModal} disabled={actionLoading} aria-label="Close" />
              </div>

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
                      <label htmlFor="designTitle" className="form-label small fw-semibold text-dark">
                        Design Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="designTitle"
                        name="title"
                        className={`form-control ${formErrors.title ? 'is-invalid' : ''}`}
                        placeholder="e.g. Modern Residential Villa Pool"
                        value={formData.title}
                        onChange={handleChange}
                        disabled={actionLoading}
                        required
                      />
                      {formErrors.title && <div className="invalid-feedback">{formErrors.title}</div>}
                    </div>

                    <div className="col-12 col-md-5">
                      <label htmlFor="designSlug" className="form-label small fw-semibold text-dark">
                        Identifier Slug (Unique)
                      </label>
                      <input
                        type="text"
                        id="designSlug"
                        name="designId"
                        className="form-control"
                        placeholder="e.g. residential-pool-1"
                        value={formData.designId}
                        onChange={handleChange}
                        disabled={actionLoading}
                      />
                    </div>
                  </div>

                  {/* Parent Category & Order & Active */}
                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-6">
                      <label htmlFor="designCat" className="form-label small fw-semibold text-dark">
                        Parent Pool Category <span className="text-danger">*</span>
                      </label>
                      <select
                        id="designCat"
                        name="categoryId"
                        className={`form-select ${formErrors.categoryId ? 'is-invalid' : ''}`}
                        value={formData.categoryId}
                        onChange={handleChange}
                        disabled={actionLoading}
                        required
                      >
                        <option value="">-- Select Category --</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.label} ({cat.categoryId})
                          </option>
                        ))}
                      </select>
                      {formErrors.categoryId && <div className="invalid-feedback">{formErrors.categoryId}</div>}
                    </div>

                    <div className="col-6 col-md-3">
                      <label htmlFor="designOrder" className="form-label small fw-semibold text-dark">
                        Display Order
                      </label>
                      <input
                        type="number"
                        id="designOrder"
                        name="order"
                        min="0"
                        className="form-control"
                        value={formData.order}
                        onChange={handleChange}
                        disabled={actionLoading}
                      />
                    </div>

                    <div className="col-6 col-md-3 d-flex align-items-end">
                      <div className="form-check form-switch mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="designIsActive"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleChange}
                          disabled={actionLoading}
                        />
                        <label className="form-check-label fw-semibold small text-dark" htmlFor="designIsActive">
                          Active in Gallery
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Image & Dimensions */}
                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-7">
                      <label htmlFor="designImage" className="form-label small fw-semibold text-dark">
                        Image File Path or URL
                      </label>
                      <input
                        type="text"
                        id="designImage"
                        name="image"
                        className="form-control"
                        placeholder="e.g. /images/hero-pool-1.jpg"
                        value={formData.image}
                        onChange={handleChange}
                        disabled={actionLoading}
                      />
                    </div>

                    <div className="col-12 col-md-5">
                      <label htmlFor="designDimensions" className="form-label small fw-semibold text-dark">
                        Approximate Dimensions (Optional)
                      </label>
                      <input
                        type="text"
                        id="designDimensions"
                        name="dimensions"
                        className="form-control"
                        placeholder="e.g. 10m x 5m x 1.5m"
                        value={formData.dimensions}
                        onChange={handleChange}
                        disabled={actionLoading}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <label htmlFor="designDesc" className="form-label small fw-semibold text-dark">
                      Detailed Architectural Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="designDesc"
                      name="description"
                      rows="3"
                      className={`form-control ${formErrors.description ? 'is-invalid' : ''}`}
                      placeholder="Comprehensive description of design aesthetics, decking, lighting, and suitable property types..."
                      value={formData.description}
                      onChange={handleChange}
                      disabled={actionLoading}
                      required
                    />
                    {formErrors.description && <div className="invalid-feedback">{formErrors.description}</div>}
                  </div>

                  {/* Specifications (one per line) */}
                  <div className="mb-3">
                    <label htmlFor="designSpecs" className="form-label small fw-semibold text-dark">
                      Technical Specifications (One per line)
                    </label>
                    <textarea
                      id="designSpecs"
                      name="specsText"
                      rows="3"
                      className="form-control"
                      placeholder="Type: In-ground Reinforced Concrete (RCC)&#10;Finish: Premium Porcelain Mosaic Tiles&#10;Filtration: High-rate Sand Filter&#10;Lighting: Flush Submerged LED"
                      value={formData.specsText}
                      onChange={handleChange}
                      disabled={actionLoading}
                    />
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                      Each line displays as a specification bullet point with an icon on the public pool card.
                    </small>
                  </div>

                  {/* Disclaimer Toggle for Portable/Movable variants */}
                  <div className="p-3 rounded-3 border bg-light mb-3">
                    <div className="form-check form-switch mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="designDisclaimer"
                        name="isDisclaimerNotice"
                        checked={formData.isDisclaimerNotice}
                        onChange={handleChange}
                        disabled={actionLoading}
                      />
                      <label className="form-check-label fw-bold small text-dark" htmlFor="designDisclaimer">
                        Attach Feasibility / Disclaimer Notice
                      </label>
                    </div>

                    {formData.isDisclaimerNotice && (
                      <div className="mt-2">
                        <label htmlFor="disclaimerText" className="form-label small fw-semibold text-dark">
                          Disclaimer Notice Text
                        </label>
                        <textarea
                          id="disclaimerText"
                          name="disclaimerText"
                          rows="2"
                          className="form-control"
                          placeholder="Notice: Portable and movable pools differ fundamentally in structure and longevity..."
                          value={formData.disclaimerText}
                          onChange={handleChange}
                          disabled={actionLoading}
                        />
                      </div>
                    )}
                  </div>

                  {/* Prefilled WhatsApp Message */}
                  <div className="mb-2">
                    <label htmlFor="designInquiry" className="form-label small fw-semibold text-dark">
                      Prefilled WhatsApp Inquiry Message
                    </label>
                    <input
                      type="text"
                      id="designInquiry"
                      name="inquiryMessage"
                      className="form-control"
                      placeholder="e.g. Hello, I am inquiring about the Modern Residential Villa Pool design..."
                      value={formData.inquiryMessage}
                      onChange={handleChange}
                      disabled={actionLoading}
                    />
                  </div>
                </div>

                <div className="modal-footer border-top px-4 py-3 bg-light">
                  <button type="button" className="btn btn-outline-secondary" onClick={handleCloseModal} disabled={actionLoading}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary px-4 fw-semibold" disabled={actionLoading}>
                    {actionLoading ? 'Saving...' : editingId ? 'Save Changes' : 'Create Pool Design'}
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

