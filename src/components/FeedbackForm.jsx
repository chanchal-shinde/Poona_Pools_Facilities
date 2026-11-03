/**
 * ==============================================================================
 * CUSTOMER FEEDBACK FORM COMPONENT (src/components/FeedbackForm.jsx)
 * ==============================================================================
 * Student / Developer Guide:
 * Allows public customers to submit honest ratings and testimonials for
 * Poona Pools Facilities without needing to create an account or log in.
 * 
 * Features:
 * - Interactive 1-5 Star Rating with hover preview.
 * - Service category selection.
 * - Client-side validation with real-time error messages.
 * - Loading indicator and anti-duplicate click protection.
 * - Connects to POST /api/feedback.
 * - No browser alert() calls.
 * ==============================================================================
 */

import React, { useState } from 'react';
import api from '../services/api';

const SERVICE_OPTIONS = [
  'Swimming Pool Construction',
  'Pool Maintenance',
  'Pool Renovation',
  'Other'
];

export default function FeedbackForm({ onFeedbackSubmitted, onCancel }) {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    serviceType: 'Swimming Pool Construction',
    rating: 5,
    message: ''
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState(null);

  // Handle standard text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear inline error on change
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim() || formData.customerName.trim().length < 2) {
      newErrors.customerName = 'Please enter your full name (minimum 2 characters).';
    } else if (formData.customerName.trim().length > 80) {
      newErrors.customerName = 'Name cannot exceed 80 characters.';
    }

    if (formData.email.trim()) {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address (or leave blank).';
      }
    }

    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Please select a star rating between 1 and 5.';
    }

    if (!formData.message.trim() || formData.message.trim().length < 5) {
      newErrors.message = 'Please share a brief comment about your experience (at least 5 characters).';
    } else if (formData.message.trim().length > 1000) {
      newErrors.message = 'Feedback message cannot exceed 1000 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const res = await api.post('/api/feedback', {
        customerName: formData.customerName.trim(),
        email: formData.email.trim(),
        serviceType: formData.serviceType,
        rating: Number(formData.rating),
        message: formData.message.trim()
      });

      if (res && res.success) {
        setSubmitSuccess(true);
        // Reset form
        setFormData({
          customerName: '',
          email: '',
          serviceType: 'Swimming Pool Construction',
          rating: 5,
          message: ''
        });

        if (onFeedbackSubmitted) {
          onFeedbackSubmitted(res.data);
        }
      } else {
        setServerError(res?.message || 'Failed to submit feedback. Please try again.');
      }
    } catch (err) {
      console.error('Feedback submission error:', err);
      setServerError(
        err.data?.message || err.message || 'Unable to submit feedback. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentDisplayRating = hoverRating || formData.rating;

  return (
    <div className="card shadow-sm border rounded-4 p-4 p-md-5 bg-white">
      {/* Success Notification Banner */}
      {submitSuccess && (
        <div className="alert alert-success border-success rounded-3 mb-4 d-flex align-items-start gap-3" role="alert">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-success flex-shrink-0 mt-0.5" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <div>
            <strong className="d-block mb-1 fs-6">Thank you for sharing your feedback!</strong>
            <p className="mb-0 small text-success-emphasis">
              Your response has been submitted successfully and sent to our management team for review. Approved testimonials will appear on our website.
            </p>
          </div>
        </div>
      )}

      {/* Server Error Banner */}
      {serverError && (
        <div className="alert alert-danger border-danger rounded-3 mb-4 d-flex align-items-start gap-3" role="alert">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-danger flex-shrink-0 mt-0.5" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <strong className="d-block mb-1">Submission Failed</strong>
            <p className="mb-0 small">{serverError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Customer Name */}
        <div className="mb-3">
          <label htmlFor="feedbackCustomerName" className="form-label fw-semibold" style={{ color: 'var(--color-deep-blue)' }}>
            Your Full Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="feedbackCustomerName"
            name="customerName"
            className={`form-control form-control-lg rounded-3 ${errors.customerName ? 'is-invalid' : ''}`}
            placeholder="e.g. Rajesh Patil"
            value={formData.customerName}
            onChange={handleChange}
            disabled={isSubmitting}
            maxLength={80}
            required
          />
          {errors.customerName && (
            <div className="invalid-feedback d-block text-danger small mt-1">
              {errors.customerName}
            </div>
          )}
        </div>

        {/* Email Address (Optional) */}
        <div className="mb-3">
          <label htmlFor="feedbackEmail" className="form-label fw-semibold" style={{ color: 'var(--color-deep-blue)' }}>
            Email Address <span className="text-muted fw-normal small">(Optional - kept confidential)</span>
          </label>
          <input
            type="email"
            id="feedbackEmail"
            name="email"
            className={`form-control form-control-lg rounded-3 ${errors.email ? 'is-invalid' : ''}`}
            placeholder="e.g. rajesh@example.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.email && (
            <div className="invalid-feedback d-block text-danger small mt-1">
              {errors.email}
            </div>
          )}
        </div>

        {/* Service Received Dropdown */}
        <div className="mb-3">
          <label htmlFor="feedbackServiceType" className="form-label fw-semibold" style={{ color: 'var(--color-deep-blue)' }}>
            Service Received <span className="text-danger">*</span>
          </label>
          <select
            id="feedbackServiceType"
            name="serviceType"
            className="form-select form-select-lg rounded-3"
            value={formData.serviceType}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            {SERVICE_OPTIONS.map((srv) => (
              <option key={srv} value={srv}>
                {srv}
              </option>
            ))}
          </select>
        </div>

        {/* Interactive Star Rating */}
        <div className="mb-4">
          <label className="form-label fw-semibold d-block" style={{ color: 'var(--color-deep-blue)' }}>
            Your Overall Rating <span className="text-danger">*</span>
          </label>
          <div className="d-flex align-items-center gap-2" role="radiogroup" aria-label="Rating out of 5 stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="btn p-1 border-0 bg-transparent"
                style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                aria-label={`${star} Star${star > 1 ? 's' : ''}`}
                aria-checked={formData.rating === star}
                disabled={isSubmitting}
              >
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 24 24"
                  fill={star <= currentDisplayRating ? '#f59e0b' : 'none'}
                  stroke={star <= currentDisplayRating ? '#f59e0b' : '#cbd5e1'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    filter: star <= currentDisplayRating ? 'drop-shadow(0 2px 4px rgba(245, 158, 11, 0.35))' : 'none',
                    transform: star <= currentDisplayRating ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </button>
            ))}
            <span className="ms-2 fw-semibold text-secondary small">
              {currentDisplayRating === 5 && 'Outstanding (5/5)'}
              {currentDisplayRating === 4 && 'Very Good (4/5)'}
              {currentDisplayRating === 3 && 'Average (3/5)'}
              {currentDisplayRating === 2 && 'Fair (2/5)'}
              {currentDisplayRating === 1 && 'Poor (1/5)'}
            </span>
          </div>
          {errors.rating && (
            <div className="invalid-feedback d-block text-danger small mt-1">
              {errors.rating}
            </div>
          )}
        </div>

        {/* Feedback Message */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <label htmlFor="feedbackMessage" className="form-label fw-semibold mb-0" style={{ color: 'var(--color-deep-blue)' }}>
              Feedback Message <span className="text-danger">*</span>
            </label>
            <span className="text-muted small" style={{ fontSize: '0.8rem' }}>
              {formData.message.length} / 1000
            </span>
          </div>
          <textarea
            id="feedbackMessage"
            name="message"
            rows="4"
            className={`form-control rounded-3 ${errors.message ? 'is-invalid' : ''}`}
            placeholder="Share your experience regarding our pool engineering, water quality, staff punctuality, or craftsmanship..."
            value={formData.message}
            onChange={handleChange}
            disabled={isSubmitting}
            maxLength={1000}
            required
          />
          {errors.message && (
            <div className="invalid-feedback d-block text-danger small mt-1">
              {errors.message}
            </div>
          )}
        </div>

        {/* Submit Actions */}
        <div className="d-flex flex-wrap gap-2 justify-content-end align-items-center">
          {onCancel && (
            <button
              type="button"
              className="btn btn-outline-secondary px-4 py-2.5 rounded-3 fw-semibold"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="btn btn-primary px-4 py-2.5 rounded-3 fw-bold shadow-sm d-flex align-items-center gap-2"
            style={{
              backgroundColor: 'var(--color-deep-blue, #0369a1)',
              borderColor: 'var(--color-deep-blue, #0369a1)'
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                <span>Submitting Feedback...</span>
              </>
            ) : (
              <>
                <span>Submit Feedback</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

