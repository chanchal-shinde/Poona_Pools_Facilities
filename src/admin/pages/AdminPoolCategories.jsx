/**
 * ==============================================================================
 * ADMIN POOL CATEGORIES MANAGEMENT (src/admin/pages/AdminPoolCategories.jsx)
 * ==============================================================================
 * Student / Developer Guide:
 * Module C: Pool Categories Management
 * 
 * Capabilities:
 * - View all pool categories in a table with associated design count.
 * - Add a new pool category.
 * - Edit an existing pool category.
 * - Activate or Deactivate categories (toggles visibility on public filter tabs).
 * - Safe Deletion: Prevents deleting categories that have linked pool designs!
 * ==============================================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const INITIAL_FORM = {
  label: '',
  categoryId: '',
  description: '',
  isActive: true,
  order: 0
};

export default function AdminPoolCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'danger', text: '' }

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});

  // Fetch all categories from backend
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/pool-categories');
      if (res && res.success) {
        setCategories(res.data || []);
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.data?.message || err.message || 'Failed to load pool categories.'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      ...INITIAL_FORM,
      order: categories.length + 1
    });
    setFormErrors({});
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (cat) => {
    setEditingId(cat._id);
    setFormData({
      label: cat.label || '',
      categoryId: cat.categoryId || '',
      description: cat.description || '',
      isActive: cat.isActive !== undefined ? cat.isActive : true,
      order: cat.order || 0
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
    if (!formData.label.trim()) errors.label = 'Category label / name is required.';
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
        label: formData.label.trim(),
        categoryId: formData.categoryId.trim(),
        description: formData.description.trim(),
        isActive: formData.isActive,
        order: Number(formData.order) || 0
      };

      if (editingId) {
        const res = await api.put(`/api/admin/pool-categories/${editingId}`, payload);
        setMessage({ type: 'success', text: res.message || 'Category updated successfully!' });
      } else {
        const res = await api.post('/api/admin/pool-categories', payload);
        setMessage({ type: 'success', text: res.message || 'Category created successfully!' });
      }

      handleCloseModal();
      await fetchCategories();
    } catch (err) {
      setFormErrors({
        submit: err.data?.message || err.message || 'Failed to save category.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle Category Active Status
  const handleToggleStatus = async (cat) => {
    try {
      const res = await api.patch(`/api/admin/pool-categories/${cat._id}/toggle`);
      setMessage({ type: 'success', text: res.message });
      await fetchCategories();
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.data?.message || err.message || 'Failed to update category status.'
      });
    }
  };

  // Delete Category (Safe Deletion)
  const handleDelete = async (cat) => {
    if (cat.designCount > 0) {
      alert(
        `Cannot delete "${cat.label}" because it currently has ${cat.designCount} associated pool design(s).\n\nPlease reassign or delete those designs in the Pool Designs tab first, or toggle this category to Inactive.`
      );
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete category "${cat.label}"?`);
    if (!confirmed) return;

    try {
      const res = await api.delete(`/api/admin/pool-categories/${cat._id}`);
      setMessage({ type: 'success', text: res.message || 'Category deleted successfully.' });
      await fetchCategories();
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.data?.message || err.message || 'Failed to delete category.'
      });
    }
  };

  const activeCount = categories.filter((c) => c.isActive).length;

  return (
    <div className="admin-pool-categories-page">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1 small">
              Module C - Categories
            </span>
            <h1 className="h4 fw-bold text-dark mb-0">Pool Categories Management</h1>
          </div>
          <p className="text-secondary small mb-0">
            Configure swimming pool gallery categories and public filter tabs (e.g. Residential, Luxury, Commercial).
          </p>
        </div>

        {/* Action Controls */}
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <Link to="/admin/pool-designs" className="btn btn-outline-secondary btn-sm px-3 py-2 fw-semibold rounded-3">
            Switch to Pool Designs →
          </Link>
          <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 small">
            {activeCount} Active
          </span>
          <button
            type="button"
            className="btn btn-primary d-inline-flex align-items-center gap-2 px-3 py-2 fw-semibold rounded-3 shadow-sm"
            onClick={handleOpenAdd}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add New Category</span>
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

      {/* Categories Table Card */}
      <div className="admin-card overflow-hidden">
        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <h2 className="h6 fw-bold mb-0 text-dark">
            All Pool Categories ({categories.length})
          </h2>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={fetchCategories}
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
            <p className="text-muted small mb-0">Fetching categories from MongoDB Atlas...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-5 p-4">
            <h3 className="h6 fw-bold text-dark mb-1">No pool categories found</h3>
            <p className="text-muted small mb-3">Create your first category or run the seed script.</p>
            <button type="button" className="btn btn-sm btn-primary" onClick={handleOpenAdd}>
              Add Category Now
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-secondary small text-uppercase">
                <tr>
                  <th style={{ width: '60px' }}>Order</th>
                  <th>Category Name &amp; Description</th>
                  <th style={{ width: '160px' }}>Slug / ID</th>
                  <th style={{ width: '140px' }} className="text-center">Associated Designs</th>
                  <th style={{ width: '110px' }}>Status</th>
                  <th style={{ width: '230px' }} className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat._id}>
                    <td className="fw-semibold text-muted text-center">
                      #{cat.order}
                    </td>

                    <td>
                      <div className="fw-bold text-dark mb-0">
                        {cat.label}
                      </div>
                      {cat.description && (
                        <p className="text-muted small mb-0 text-truncate" style={{ maxWidth: '380px' }}>
                          {cat.description}
                        </p>
                      )}
                    </td>

                    <td>
                      <code className="text-secondary small bg-light px-2 py-1 rounded">
                        {cat.categoryId}
                      </code>
                    </td>

                    <td className="text-center">
                      <span className={`badge ${cat.designCount > 0 ? 'bg-primary bg-opacity-10 text-primary border' : 'bg-light text-muted border'} px-2 py-1`}>
                        {cat.designCount} design{cat.designCount === 1 ? '' : 's'}
                      </span>
                    </td>

                    <td>
                      {cat.isActive ? (
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
                          className={`btn ${cat.isActive ? 'btn-outline-warning' : 'btn-outline-success'}`}
                          onClick={() => handleToggleStatus(cat)}
                          title={cat.isActive ? 'Deactivate category tab on public site' : 'Activate category tab'}
                        >
                          {cat.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={() => handleOpenEdit(cat)}
                          title="Edit category"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => handleDelete(cat)}
                          title={cat.designCount > 0 ? 'Cannot delete category with associated designs' : 'Delete category'}
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
      {/* ADD / EDIT CATEGORY MODAL                                      */}
      {/* ============================================================== */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom px-4 py-3">
                <h3 className="modal-title h5 fw-bold text-dark mb-0">
                  {editingId ? 'Edit Pool Category' : 'Add New Pool Category'}
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

                  {/* Label / Name */}
                  <div className="mb-3">
                    <label htmlFor="catLabel" className="form-label small fw-semibold text-dark">
                      Category Name / Label <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="catLabel"
                      name="label"
                      className={`form-control ${formErrors.label ? 'is-invalid' : ''}`}
                      placeholder="e.g. Residential Pools"
                      value={formData.label}
                      onChange={handleChange}
                      disabled={actionLoading}
                      required
                    />
                    {formErrors.label && <div className="invalid-feedback">{formErrors.label}</div>}
                  </div>

                  {/* Identifier Slug */}
                  <div className="mb-3">
                    <label htmlFor="catId" className="form-label small fw-semibold text-dark">
                      Identifier Slug (Unique)
                    </label>
                    <input
                      type="text"
                      id="catId"
                      name="categoryId"
                      className="form-control"
                      placeholder="e.g. residential"
                      value={formData.categoryId}
                      onChange={handleChange}
                      disabled={actionLoading}
                    />
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                      Auto-generated if left blank. Used as internal reference.
                    </small>
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <label htmlFor="catDesc" className="form-label small fw-semibold text-dark">
                      Description (Optional)
                    </label>
                    <textarea
                      id="catDesc"
                      name="description"
                      rows="2"
                      className="form-control"
                      placeholder="Brief note about the scope of this category..."
                      value={formData.description}
                      onChange={handleChange}
                      disabled={actionLoading}
                    />
                  </div>

                  {/* Order & Active Switch */}
                  <div className="row g-3">
                    <div className="col-6">
                      <label htmlFor="catOrder" className="form-label small fw-semibold text-dark">
                        Sort Order
                      </label>
                      <input
                        type="number"
                        id="catOrder"
                        name="order"
                        min="0"
                        className="form-control"
                        value={formData.order}
                        onChange={handleChange}
                        disabled={actionLoading}
                      />
                    </div>

                    <div className="col-6 d-flex align-items-end">
                      <div className="form-check form-switch mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="catIsActive"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleChange}
                          disabled={actionLoading}
                        />
                        <label className="form-check-label fw-semibold small text-dark" htmlFor="catIsActive">
                          Active Tab
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top px-4 py-3 bg-light">
                  <button type="button" className="btn btn-outline-secondary" onClick={handleCloseModal} disabled={actionLoading}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary px-4 fw-semibold" disabled={actionLoading}>
                    {actionLoading ? 'Saving...' : editingId ? 'Save Changes' : 'Create Category'}
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

