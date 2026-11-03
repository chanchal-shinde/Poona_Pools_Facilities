/**
 * ==============================================================================
 * CUSTOMER FEEDBACK PAGE (src/pages/CustomerFeedback.jsx)
 * ==============================================================================
 * Student / Developer Guide:
 * Dedicated public page showcasing client testimonials and offering a clean
 * feedback submission form without requiring any registration or login.
 * ==============================================================================
 */

import React, { useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import FeedbackForm from '../components/FeedbackForm';
import ReviewsSection from '../components/ReviewsSection';

export default function CustomerFeedback() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFeedbackSubmitted = () => {
    // Increment key to re-fetch reviews
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="customer-feedback-page">
      {/* 1. Page Header / Hero Banner */}
      <section className="bg-light-blue py-5 border-bottom border-light">
        <div className="container py-4 text-center">
          <span className="section-subtitle-badge">Client Ratings &amp; Testimonials</span>
          <h1 className="display-5 fw-bold mb-3" style={{ color: 'var(--color-deep-blue)' }}>
            Customer Feedback &amp; Reviews
          </h1>
          <div className="section-divider mx-auto" />
          <p className="lead text-secondary mx-auto" style={{ maxWidth: '750px' }}>
            We take pride in our civil engineering, water filtration reliability, and long-term maintenance. Read real client experiences or submit your review below.
          </p>
        </div>
      </section>

      {/* 2. Public Reviews Grid */}
      <ReviewsSection
        key={refreshKey}
        showHeading={false}
      />

      {/* 3. Dedicated Feedback Submission Form Section */}
      <section className="section-padding bg-white" id="submit-feedback-section" aria-labelledby="form-heading">
        <div className="container">
          <SectionHeading
            subtitle="Your Voice Matters"
            title="Submit Your Project Review"
            description="Whether we built your residential villa pool, upgraded your commercial filtration system, or manage your routine maintenance, share your experience."
          />

          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <FeedbackForm onFeedbackSubmitted={handleFeedbackSubmitted} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

