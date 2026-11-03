/**
 * ==============================================================================
 * CUSTOMER REVIEWS & TESTIMONIALS SECTION (src/components/ReviewsSection.jsx)
 * ==============================================================================
 * Student / Developer Guide:
 * Displays approved customer reviews dynamically fetched from the Express API
 * (GET /api/feedback).
 * 
 * Key Characteristics:
 * - Shows only reviews with status 'Approved'.
 * - Star rating display (1 to 5 stars).
 * - Customer name, service received, and submission date.
 * - Meaningful empty state when no reviews are approved yet.
 * - Interactive modal/toggle to open FeedbackForm for instant submission.
 * - Consistent with the Poona Pools sky-blue and deep-blue aesthetic.
 * ==============================================================================
 */

import React, { useState, useEffect } from 'react';
import SectionHeading from './SectionHeading';
import FeedbackForm from './FeedbackForm';
import api from '../services/api';

export default function ReviewsSection({ showHeading = true, subtitle = "Verified Client Experiences", title = "What Our Customers Say", description = "Read real reviews from homeowners, villa owners, and commercial facility managers across Pune." }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [thankYouBanner, setThankYouBanner] = useState(false);

  // Fetch approved customer reviews
  const loadReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/feedback');
      if (res && res.success && Array.isArray(res.data)) {
        setReviews(res.data);
      }
    } catch (err) {
      console.warn('Could not load reviews:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleFeedbackSubmitted = () => {
    setShowFormModal(false);
    setThankYouBanner(true);
  };

  // Render 5 stars helper
  const renderStars = (rating) => {
    return (
      <div className="d-flex align-items-center gap-1" aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={star <= rating ? '#f59e0b' : 'none'}
            stroke={star <= rating ? '#f59e0b' : '#cbd5e1'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
    );
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  return (
    <section className="section-padding bg-light-blue" aria-labelledby="reviews-section-heading">
      <div className="container">
        {showHeading && (
          <SectionHeading
            subtitle={subtitle}
            title={title}
            description={description}
          />
        )}

        {/* Action Header Strip */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
          <div>
            <span className="text-secondary small fw-semibold">
              {reviews.length > 0
                ? `Showing ${reviews.length} verified review${reviews.length > 1 ? 's' : ''}`
                : 'Customer Feedback & Ratings'}
            </span>
          </div>

          <button
            type="button"
            className="btn btn-primary d-inline-flex align-items-center gap-2 fw-semibold px-4 py-2.5 rounded-pill shadow-sm align-self-start align-self-sm-auto"
            style={{
              backgroundColor: 'var(--color-deep-blue, #0369a1)',
              borderColor: 'var(--color-deep-blue, #0369a1)'
            }}
            onClick={() => setShowFormModal(true)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <span>Share Your Feedback</span>
          </button>
        </div>

        {/* Thank You Banner after Modal Submission */}
        {thankYouBanner && (
          <div className="alert alert-success border-success rounded-3 mb-4 alert-dismissible fade show" role="alert">
            <div className="d-flex align-items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-success">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <strong>Thank you for sharing your feedback!</strong> Your response has been submitted successfully and will be published once reviewed.
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={() => setThankYouBanner(false)}
              aria-label="Close"
            />
          </div>
        )}

        {/* Reviews Cards Grid / Empty State */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading reviews...</span>
            </div>
            <p className="text-muted small mt-2">Loading client reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          /* Empty State */
          <div className="card border-0 rounded-4 shadow-sm p-5 text-center bg-white">
            <div className="mb-3 text-muted">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary opacity-50">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M8 10h.01M12 10h.01M16 10h.01" />
              </svg>
            </div>
            <h3 className="h5 fw-bold text-dark mb-2">No Customer Reviews Published Yet</h3>
            <p className="text-secondary small mb-4 mx-auto" style={{ maxWidth: '520px' }}>
              We take immense pride in our swimming pool civil construction and filtration quality.
              If you have partnered with Poona Pools Facilities, we would be honored to hear your thoughts!
            </p>
            <div>
              <button
                type="button"
                className="btn btn-outline-primary px-4 py-2 rounded-pill fw-semibold"
                onClick={() => setShowFormModal(true)}
              >
                Be The First To Share Feedback
              </button>
            </div>
          </div>
        ) : (
          /* Approved Reviews Grid */
          <div className="row g-4">
            {reviews.map((rev) => (
              <div key={rev._id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 border-0 rounded-4 shadow-sm p-4 bg-white d-flex flex-column justify-content-between position-relative">
                  {/* Top Quote Decoration */}
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      {renderStars(rev.rating)}
                      <span className="badge bg-light text-secondary border small">
                        {rev.serviceType || 'Pool Service'}
                      </span>
                    </div>

                    <p className="text-secondary mb-4" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                      "{rev.message}"
                    </p>
                  </div>

                  {/* Customer Footer */}
                  <div className="pt-3 border-top d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold text-dark" style={{ fontSize: '0.975rem' }}>
                        {rev.customerName}
                      </div>
                      <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                        Verified Customer
                      </small>
                    </div>
                    {rev.createdAt && (
                      <span className="text-muted small font-monospace" style={{ fontSize: '0.75rem' }}>
                        {formatDate(rev.createdAt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Dialog for Feedback Submission */}
        {showFormModal && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content rounded-4 border-0 shadow">
                <div className="modal-header border-bottom px-4 py-3 bg-light rounded-top-4">
                  <div>
                    <h3 className="modal-title h5 fw-bold text-dark mb-0">Share Your Experience</h3>
                    <small className="text-muted">Your feedback helps fellow Pune pool owners and helps us maintain quality.</small>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowFormModal(false)}
                    aria-label="Close"
                  />
                </div>

                <div className="modal-body p-0">
                  <FeedbackForm
                    onFeedbackSubmitted={handleFeedbackSubmitted}
                    onCancel={() => setShowFormModal(false)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

