import React, { useState, useId } from 'react';
import SectionHeading from './SectionHeading';
import { poolTypes, estimatorPricing } from '../config/siteConfig';
import {
  calculatePoolVolume,
  calculateWaterCapacity,
  calculateEstimatedCost,
  formatCurrency,
  formatNumber
} from '../utils/costCalculator';

/**
 * ============================================================================
 * SWIMMING POOL COST ESTIMATOR COMPONENT
 * ============================================================================
 *
 * Student / Developer Guide:
 * This component allows potential clients to estimate:
 * 1. Pool Volume in cubic meters (m³)
 * 2. Water Capacity in Litres (L)
 * 3. Indicative Project Cost in Indian Rupees (₹)
 *
 * It uses pure calculation functions imported from `src/utils/costCalculator.js`
 * and editable configuration from `src/config/siteConfig.js`.
 * ============================================================================
 */
export default function CostEstimator({ onUseDimensions }) {
  // Generate unique IDs for accessibility
  const lengthId = useId();
  const widthId = useId();
  const depthId = useId();
  const unitId = useId();
  const poolTypeId = useId();

  // State for user inputs
  // Sensible default starter values so customer immediately sees how the calculator works
  const [length, setLength] = useState('10');
  const [width, setWidth] = useState('5');
  const [depth, setDepth] = useState('1.5');
  const [unit, setUnit] = useState('meters'); // 'meters' or 'feet'
  const [selectedPoolType, setSelectedPoolType] = useState('residential');

  // Perform calculations dynamically
  const volumeM3 = calculatePoolVolume(length, width, depth, unit);
  const capacityLitres = calculateWaterCapacity(volumeM3);
  const estimatedCost = calculateEstimatedCost(volumeM3, selectedPoolType);

  // Find currently selected pool type details for displaying multiplier
  const currentPoolTypeObj = poolTypes.find((t) => t.id === selectedPoolType) || poolTypes[0];

  // Quick reset function
  const handleReset = () => {
    setLength('');
    setWidth('');
    setDepth('');
  };

  // Scroll to Free Quote Form and prefill if handler provided
  const handleTransferToQuote = () => {
    if (onUseDimensions) {
      onUseDimensions({
        length,
        width,
        depth,
        unit,
        poolType: currentPoolTypeObj.label
      });
    }

    // Smooth scroll down to the quote form section
    const quoteSection = document.getElementById('quote-form');
    if (quoteSection) {
      quoteSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="section-padding bg-light-blue" id="estimator" aria-labelledby="estimator-heading">
      <div className="container">
        {/* Section Heading */}
        <SectionHeading
          subtitle="Instant Planning Tool"
          title="Swimming Pool Cost Estimator"
          description="Calculate your pool's estimated water volume, capacity, and indicative civil construction cost based on your approximate plot dimensions."
        />

        <div className="row g-4 justify-content-center">
          {/* Left Column: Dimensions & Options Form */}
          <div className="col-12 col-lg-6">
            <div className="card h-100 shadow-sm border-0 rounded-4 p-4 p-md-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <h3 className="h5 fw-bold mb-0" style={{ color: 'var(--color-deep-blue)' }}>
                  1. Enter Pool Dimensions
                </h3>
                <span className="badge rounded-pill bg-light text-primary border" style={{ fontSize: '0.8rem' }}>
                  Step 1 of 2
                </span>
              </div>

              {/* Unit Selection (Meters vs Feet) */}
              <div className="mb-4">
                <label htmlFor={unitId} className="form-label fw-semibold small text-muted text-uppercase mb-2">
                  Measurement Unit
                </label>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className={`btn flex-fill py-2 fw-semibold ${
                      unit === 'meters'
                        ? 'btn-primary-custom text-dark'
                        : 'btn-secondary-custom'
                    }`}
                    onClick={() => setUnit('meters')}
                    style={{ fontSize: '0.9rem' }}
                  >
                    Metres (m)
                  </button>
                  <button
                    type="button"
                    className={`btn flex-fill py-2 fw-semibold ${
                      unit === 'feet'
                        ? 'btn-primary-custom text-dark'
                        : 'btn-secondary-custom'
                    }`}
                    onClick={() => setUnit('feet')}
                    style={{ fontSize: '0.9rem' }}
                  >
                    Feet (ft)
                  </button>
                </div>
                <small className="text-muted d-block mt-1">
                  {unit === 'feet' ? 'Dimensions entered in feet will be converted to metres for volume calculation.' : 'Direct metric calculations.'}
                </small>
              </div>

              {/* Length, Width, Depth inputs */}
              <div className="row g-3 mb-4">
                {/* Length */}
                <div className="col-12 col-sm-4">
                  <label htmlFor={lengthId} className="form-label fw-semibold" style={{ color: 'var(--color-deep-blue)' }}>
                    Length ({unit === 'feet' ? 'ft' : 'm'}) <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      id={lengthId}
                      type="number"
                      min="1"
                      step="0.5"
                      className="form-control form-control-lg rounded-3"
                      placeholder={unit === 'feet' ? 'e.g. 30' : 'e.g. 10'}
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                    />
                  </div>
                </div>

                {/* Width */}
                <div className="col-12 col-sm-4">
                  <label htmlFor={widthId} className="form-label fw-semibold" style={{ color: 'var(--color-deep-blue)' }}>
                    Width ({unit === 'feet' ? 'ft' : 'm'}) <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      id={widthId}
                      type="number"
                      min="1"
                      step="0.5"
                      className="form-control form-control-lg rounded-3"
                      placeholder={unit === 'feet' ? 'e.g. 15' : 'e.g. 5'}
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                    />
                  </div>
                </div>

                {/* Depth */}
                <div className="col-12 col-sm-4">
                  <label htmlFor={depthId} className="form-label fw-semibold" style={{ color: 'var(--color-deep-blue)' }}>
                    Avg. Depth ({unit === 'feet' ? 'ft' : 'm'}) <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      id={depthId}
                      type="number"
                      min="0.5"
                      step="0.1"
                      className="form-control form-control-lg rounded-3"
                      placeholder={unit === 'feet' ? 'e.g. 4.5' : 'e.g. 1.5'}
                      value={depth}
                      onChange={(e) => setDepth(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Pool Type Selection */}
              <div className="mb-4">
                <label htmlFor={poolTypeId} className="form-label fw-semibold" style={{ color: 'var(--color-deep-blue)' }}>
                  Select Pool Type <span className="text-danger">*</span>
                </label>
                <select
                  id={poolTypeId}
                  className="form-select form-select-lg rounded-3"
                  value={selectedPoolType}
                  onChange={(e) => setSelectedPoolType(e.target.value)}
                >
                  {poolTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label} ({type.multiplier}x complexity index)
                    </option>
                  ))}
                </select>
                <small className="text-muted d-block mt-1">
                  Infinity and commercial pools require specialized balancing surge tanks and high-turnover pump plants.
                </small>
              </div>

              {/* Reset action */}
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-sm btn-link text-muted text-decoration-none"
                  onClick={handleReset}
                >
                  Clear Dimensions
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Calculated Results & Cost Breakdown */}
          <div className="col-12 col-lg-6">
            <div className="card h-100 shadow-sm border-0 rounded-4 p-4 p-md-4 bg-white d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <h3 className="h5 fw-bold mb-0" style={{ color: 'var(--color-deep-blue)' }}>
                  2. Estimation Results
                </h3>
                <span className="badge rounded-pill bg-info text-dark" style={{ fontSize: '0.8rem' }}>
                  Live Calculation
                </span>
              </div>

              {/* Metric 1 & 2: Volume & Capacity Cards */}
              <div className="row g-3 mb-4">
                {/* Pool Volume */}
                <div className="col-6">
                  <div
                    className="p-3 rounded-3 text-center h-100 border"
                    style={{ backgroundColor: 'var(--color-sky-light)', borderColor: 'var(--color-sky-border)' }}
                  >
                    <div className="text-muted small fw-semibold text-uppercase mb-1">
                      Pool Volume
                    </div>
                    <div className="fs-3 fw-bold" style={{ color: 'var(--color-deep-blue)', fontFamily: 'var(--font-heading)' }}>
                      {volumeM3 > 0 ? formatNumber(volumeM3, 2) : '0.00'}
                    </div>
                    <span className="badge bg-white text-secondary border small mt-1">
                      m³ (Cubic Metres)
                    </span>
                  </div>
                </div>

                {/* Estimated Water Capacity */}
                <div className="col-6">
                  <div
                    className="p-3 rounded-3 text-center h-100 border"
                    style={{ backgroundColor: 'var(--color-sky-light)', borderColor: 'var(--color-sky-border)' }}
                  >
                    <div className="text-muted small fw-semibold text-uppercase mb-1">
                      Water Capacity
                    </div>
                    <div className="fs-3 fw-bold" style={{ color: 'var(--color-primary-blue)', fontFamily: 'var(--font-heading)' }}>
                      {capacityLitres > 0 ? formatNumber(capacityLitres, 0) : '0'}
                    </div>
                    <span className="badge bg-white text-secondary border small mt-1">
                      Litres (L)
                    </span>
                  </div>
                </div>
              </div>

              {/* Metric 3: Indicative Project Cost Card */}
              <div
                className="p-4 rounded-4 text-center mb-4 border"
                style={{
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                  borderColor: 'var(--color-sky-border)'
                }}
              >
                <div className="text-muted small fw-bold text-uppercase letter-spacing mb-1">
                  Indicative Project Cost
                </div>
                <div
                  className="display-6 fw-bold mb-2"
                  style={{ color: 'var(--color-deep-blue)', fontFamily: 'var(--font-heading)' }}
                >
                  {volumeM3 > 0 ? formatCurrency(estimatedCost) : 'Enter Dimensions'}
                </div>

                {volumeM3 > 0 && (
                  <div className="small text-muted d-flex justify-content-center gap-3 flex-wrap">
                    <span>
                      <strong>Base Rate:</strong> {formatCurrency(estimatorPricing.baseRatePerCubicMeter)} / m³
                    </span>
                    <span>•</span>
                    <span>
                      <strong>Pool Type:</strong> {currentPoolTypeObj.label} ({currentPoolTypeObj.multiplier}x)
                    </span>
                  </div>
                )}
              </div>

              {/* Disclaimer Notice */}
              <div className="alert alert-light border small text-muted mb-4 py-2 px-3 rounded-3" role="note">
                <div className="d-flex gap-2 align-items-start">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary flex-shrink-0 mt-1" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <span>
                    {estimatorPricing.disclaimer}
                  </span>
                </div>
              </div>

              {/* Action Button: Use these dimensions to Request a Free Quote */}
              <div className="mt-auto">
                <button
                  type="button"
                  className="btn-primary-custom w-100 py-3 text-center fw-bold shadow-sm"
                  onClick={handleTransferToQuote}
                >
                  <span>Request Official Quote With These Dimensions</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <polyline points="19 12 12 19 5 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

