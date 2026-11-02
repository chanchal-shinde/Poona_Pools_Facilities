import React, { useState } from 'react';
import CostEstimator from '../components/CostEstimator';
import QuoteForm from '../components/QuoteForm';

/**
 * ============================================================================
 * GET A QUOTE PAGE - POONA POOLS FACILITIES
 * ============================================================================
 * 
 * Student / Developer Guide:
 * This dedicated page houses two core planning tools for clients:
 * 1. Swimming Pool Cost Estimator:
 *    Allows customers to input pool dimensions (meters or feet) and select a
 *    pool type to dynamically calculate water volume (m³), water capacity (L),
 *    and an indicative construction cost estimate.
 * 
 * 2. Free Quote Inquiry Form:
 *    A structured inquiry form with client-side validation. When submitted,
 *    it compiles the project specifications and opens WhatsApp directly to
 *    chat with Poona Pools Facilities.
 * 
 * Interactivity:
 * When a user calculates their pool in the Cost Estimator and clicks
 * "Request Official Quote With These Dimensions", the dimensions and pool type
 * are passed to the Quote Form via `estimatorPrefill` state and the page
 * smoothly scrolls directly to the form.
 * ============================================================================
 */
export default function GetQuote() {
  // State to hold dimension data transferred from the Cost Estimator into the Quote Form
  const [estimatorPrefill, setEstimatorPrefill] = useState(null);

  return (
    <div className="get-quote-page">
      {/* 1. Page Header / Hero Banner */}
      <section className="bg-light-blue py-5 border-bottom border-light">
        <div className="container py-4 text-center">
          <span className="section-subtitle-badge">Custom Quotation &amp; Planning</span>
          <h1 className="display-5 fw-bold mb-3" style={{ color: 'var(--color-deep-blue)' }}>
            Plan Your Swimming Pool Project
          </h1>
          <div className="section-divider mx-auto" />
          <p className="lead text-secondary mx-auto" style={{ maxWidth: '750px' }}>
            Calculate estimated water capacity and budget indications with our interactive pool cost estimator, or submit your property dimensions directly for a tailored engineering quotation.
          </p>
        </div>
      </section>

      {/* 2. Swimming Pool Cost Estimator Section */}
      <CostEstimator onUseDimensions={setEstimatorPrefill} />

      {/* 3. Free Quote Inquiry Form Section */}
      <QuoteForm prefilledData={estimatorPrefill} />
    </div>
  );
}
