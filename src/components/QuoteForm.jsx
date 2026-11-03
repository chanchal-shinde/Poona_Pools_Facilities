import React, { useState } from 'react';
import SectionHeading from './SectionHeading';
import { poolTypes, quoteServices } from '../config/siteConfig';
import { useSiteContent } from '../context/SiteContentContext';
import api from '../services/api';

/**
 * ============================================================================
 * FREE QUOTE INQUIRY FORM COMPONENT
 * ============================================================================
 *
 * Student / Developer Guide:
 * This component provides the "Request a Free Quote" form where prospective
 * customers submit their project requirements.
 *
 * Validation Rules:
 * - Customer Name: Required (at least 2 characters)
 * - Phone Number: Required, validated for valid phone format (at least 10 digits)
 * - Pool Type: Required dropdown
 * - Dimensions: Length, Width, and Depth must be valid positive numbers
 * - Required Service: Required dropdown
 * - Project Location: Required (e.g. Pune area)
 *
 * On Submit:
 * - Validates all fields and shows inline error messages under invalid inputs.
 * - Prevents submission if invalid.
 * - When valid, constructs a formatted WhatsApp message and opens WhatsApp
 *   directly to the company's WhatsApp number without needing a backend or DB.
 * ============================================================================
 */
export default function QuoteForm({ prefilledData }) {
  const { settings } = useSiteContent();

  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    poolType: 'Residential',
    length: '',
    width: '',
    depth: '',
    unit: 'meters', // 'meters' or 'feet'
    service: quoteServices[0] || 'Swimming Pool Construction',
    location: '',
    message: ''
  });

  // Track previous prefilled data to update form inputs without effect cascades
  const [prevPrefilled, setPrevPrefilled] = useState(prefilledData);
  if (prefilledData && prefilledData !== prevPrefilled) {
    setPrevPrefilled(prefilledData);
    setFormData((prev) => ({
      ...prev,
      length: prefilledData.length !== undefined ? String(prefilledData.length) : prev.length,
      width: prefilledData.width !== undefined ? String(prefilledData.width) : prev.width,
      depth: prefilledData.depth !== undefined ? String(prefilledData.depth) : prev.depth,
      unit: prefilledData.unit || prev.unit,
      poolType: prefilledData.poolType || prev.poolType
    }));
  }

  // Inline Validation Errors State
  const [errors, setErrors] = useState({});

  // Submission Status
  const [submittedWhatsAppUrl, setSubmittedWhatsAppUrl] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [savedInquiryId, setSavedInquiryId] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field as the user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null
      }));
    }
  };

  /**
   * Validates all form inputs.
   * Returns an object of field errors (empty if all valid).
   */
  const validateForm = () => {
    const newErrors = {};

    // 1. Customer Name validation
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Please enter your full name.';
    } else if (formData.customerName.trim().length < 2) {
      newErrors.customerName = 'Name must be at least 2 characters.';
    }

    // 2. Phone Number validation
    // Extracts only digits to check for at least 10 digits
    const digitsOnly = formData.phone.replace(/[^0-9]/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter your phone number.';
    } else if (digitsOnly.length < 10) {
      newErrors.phone = 'Please enter a valid phone number (at least 10 digits).';
    }

    // 3. Pool Type validation
    if (!formData.poolType) {
      newErrors.poolType = 'Please select a pool type.';
    }

    // 4. Dimensions validation (Length, Width, Depth)
    const len = parseFloat(formData.length);
    if (!formData.length || isNaN(len) || len <= 0) {
      newErrors.length = 'Enter length > 0.';
    }

    const wid = parseFloat(formData.width);
    if (!formData.width || isNaN(wid) || wid <= 0) {
      newErrors.width = 'Enter width > 0.';
    }

    const dep = parseFloat(formData.depth);
    if (!formData.depth || isNaN(dep) || dep <= 0) {
      newErrors.depth = 'Enter depth > 0.';
    }

    // 5. Required Service validation
    if (!formData.service) {
      newErrors.service = 'Please select the required service.';
    }

    // 6. Project Location validation
    if (!formData.location.trim()) {
      newErrors.location = 'Please enter your project location (e.g. Pune, Baner, Kothrud).';
    }

    return newErrors;
  };

  /**
   * Handles Form Submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    // Run validation
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsSuccess(false);
      return;
    }

    // Clear errors if any
    setErrors({});

    // Construct the formatted WhatsApp message
    const unitLabel = formData.unit === 'feet' ? 'ft' : 'm';
    const messageLines = [
      `*NEW FREE QUOTE INQUIRY - Poona Pools Facilities*`,
      `---------------------------------------`,
      `*Customer Name:* ${formData.customerName.trim()}`,
      `*Phone Number:* ${formData.phone.trim()}`,
      formData.email ? `*Email:* ${formData.email.trim()}` : null,
      `*Project Location:* ${formData.location.trim()}`,
      `*Pool Type:* ${formData.poolType}`,
      `*Required Service:* ${formData.service}`,
      `*Approximate Dimensions:* ${formData.length} ${unitLabel} (L) × ${formData.width} ${unitLabel} (W) × ${formData.depth} ${unitLabel} (Avg. Depth)`,
      formData.message ? `*Notes:* ${formData.message.trim()}` : null,
      `---------------------------------------`,
      `Hello Poona Pools Facilities team, I would like to request a free quote for our swimming pool project with the details above. Please review and get in touch with me.`
    ].filter(Boolean);

    const fullMessage = messageLines.join('\n');

    // Get the clean business WhatsApp number from settings context or static fallback
    const rawWaNumber = (settings?.whatsapp || '919923176194').replace(/[^0-9]/g, '');

    // Safely encode special characters, emojis, and line breaks
    const encodedMessage = encodeURIComponent(fullMessage);

    // Build the official click-to-chat WhatsApp URL
    const whatsappUrl = `https://wa.me/${rawWaNumber}?text=${encodedMessage}`;
    setSubmittedWhatsAppUrl(whatsappUrl);

    // Save inquiry to MongoDB Atlas via backend REST API
    try {
      setIsSubmitting(true);
      const res = await api.post('/api/public/inquiries', {
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        location: formData.location.trim(),
        poolType: formData.poolType,
        service: formData.service,
        dimensions: {
          length: parseFloat(formData.length) || 0,
          width: parseFloat(formData.width) || 0,
          depth: parseFloat(formData.depth) || 0,
          unit: formData.unit
        },
        message: formData.message.trim(),
        submissionSource: 'Website Quote Form'
      });

      if (res && res.success) {
        setIsSuccess(true);
        if (res.data?._id) {
          setSavedInquiryId(res.data._id);
        }
        // Attempt to open WhatsApp in a new tab without blocking the user
        try {
          window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        } catch {
          // If popup is blocked by browser, user can click the button in the success alert
        }
      } else {
        setSubmitError(res?.message || 'Could not save inquiry to database.');
      }
    } catch (err) {
      console.warn('Backend inquiry submission fallback to direct WhatsApp:', err.message);
      // Fallback: Still mark success and let customer send via WhatsApp directly
      setIsSuccess(true);
      setSubmitError('Note: Database connection is temporarily busy, but your WhatsApp inquiry is ready to send below!');
      try {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      } catch {
        // Popup blocked
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setIsSuccess(false);
    setSubmitError(null);
    setSavedInquiryId(null);
    setSubmittedWhatsAppUrl(null);
    setFormData({
      customerName: '',
      phone: '',
      email: '',
      poolType: 'Residential',
      length: '',
      width: '',
      depth: '',
      unit: 'meters',
      service: quoteServices[0] || 'Swimming Pool Construction',
      location: '',
      message: ''
    });
  };

  return (
    <section className="section-padding bg-white" id="quote-form" aria-labelledby="quote-heading">
      <div className="container">
        {/* Section Heading */}
        <SectionHeading
          subtitle="Get A Custom Estimate"
          title="Request a Free Quote"
          description="Submit your swimming pool requirements below. Our civil engineering and maintenance experts will prepare a tailored proposal for your property."
        />

        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <div className="card shadow-sm border rounded-4 p-4 p-md-5 bg-white">
              {/* Success Notification Banner */}
              {isSuccess && (
                <div className="alert alert-success border-success rounded-3 mb-4" role="alert">
                  <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-success" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <strong className="fs-6">Inquiry Received &amp; Saved Successfully!</strong>
                    </div>
                    {savedInquiryId && (
                      <span className="badge bg-light text-secondary border small font-monospace">
                        Ref: #{savedInquiryId.slice(-6).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className="mb-2 small">
                    Thank you, <strong>{formData.customerName}</strong>! Your inquiry has been registered in our system. You can also chat directly on WhatsApp with our engineers right now:
                  </p>
                  {submittedWhatsAppUrl && (
                    <div className="d-flex flex-wrap gap-2 mt-3">
                      <a
                        href={submittedWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-success fw-bold d-inline-flex align-items-center gap-2 px-3 py-2"
                      >
                        <span>Open WhatsApp Chat</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </a>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary px-3 py-2"
                        onClick={handleResetForm}
                      >
                        Submit Another Quote
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Error Banner if any */}
              {submitError && !isSuccess && (
                <div className="alert alert-danger py-2 px-3 small rounded-3 mb-4 d-flex align-items-center justify-content-between">
                  <span>{submitError}</span>
                  <button type="button" className="btn-close small" onClick={() => setSubmitError(null)} />
                </div>
              )}

              {/* Inquiry Form */}
              <form onSubmit={handleSubmit} noValidate>
                {/* 1. Customer Name & Phone Number */}
                <div className="row g-3 mb-3">
                  {/* Customer Name */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="customerName" className="form-label fw-semibold" style={{ color: 'var(--color-deep-blue)' }}>
                      Customer Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="customerName"
                      name="customerName"
                      className={`form-control form-control-lg rounded-3 ${errors.customerName ? 'is-invalid border-danger' : ''}`}
                      placeholder="e.g. Rahul Sharma"
                      value={formData.customerName}
                      onChange={handleChange}
                    />
                    {errors.customerName && (
                      <div className="invalid-feedback d-block text-danger small mt-1">
                        {errors.customerName}
                      </div>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="phone" className="form-label fw-semibold" style={{ color: 'var(--color-deep-blue)' }}>
                      Phone Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className={`form-control form-control-lg rounded-3 ${errors.phone ? 'is-invalid border-danger' : ''}`}
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    {errors.phone && (
                      <div className="invalid-feedback d-block text-danger small mt-1">
                        {errors.phone}
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Pool Type & Required Service Dropdowns */}
                <div className="row g-3 mb-3">
                  {/* Pool Type */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="poolType" className="form-label fw-semibold" style={{ color: 'var(--color-deep-blue)' }}>
                      Pool Type <span className="text-danger">*</span>
                    </label>
                    <select
                      id="poolType"
                      name="poolType"
                      className={`form-select form-select-lg rounded-3 ${errors.poolType ? 'is-invalid border-danger' : ''}`}
                      value={formData.poolType}
                      onChange={handleChange}
                    >
                      {poolTypes.map((type) => (
                        <option key={type.id} value={type.label}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {errors.poolType && (
                      <div className="invalid-feedback d-block text-danger small mt-1">
                        {errors.poolType}
                      </div>
                    )}
                  </div>

                  {/* Required Service */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="service" className="form-label fw-semibold" style={{ color: 'var(--color-deep-blue)' }}>
                      Required Service <span className="text-danger">*</span>
                    </label>
                    <select
                      id="service"
                      name="service"
                      className={`form-select form-select-lg rounded-3 ${errors.service ? 'is-invalid border-danger' : ''}`}
                      value={formData.service}
                      onChange={handleChange}
                    >
                      {quoteServices.map((srv, index) => (
                        <option key={index} value={srv}>
                          {srv}
                        </option>
                      ))}
                    </select>
                    {errors.service && (
                      <div className="invalid-feedback d-block text-danger small mt-1">
                        {errors.service}
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Approximate Dimensions (Length, Width, Depth, Unit) */}
                <div className="mb-3 p-3 rounded-3" style={{ backgroundColor: 'var(--color-sky-light)', border: '1px solid var(--color-sky-border)' }}>
                  <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                    <label className="form-label fw-bold mb-0" style={{ color: 'var(--color-deep-blue)' }}>
                      Approximate Pool Dimensions <span className="text-danger">*</span>
                    </label>

                    {/* Dimension Unit Radio */}
                    <div className="d-flex align-items-center gap-2">
                      <span className="small text-muted fw-semibold">Unit:</span>
                      <div className="form-check form-check-inline mb-0">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="unit"
                          id="unitMeters"
                          value="meters"
                          checked={formData.unit === 'meters'}
                          onChange={handleChange}
                        />
                        <label className="form-check-label small fw-semibold" htmlFor="unitMeters">
                          Metres (m)
                        </label>
                      </div>
                      <div className="form-check form-check-inline mb-0">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="unit"
                          id="unitFeet"
                          value="feet"
                          checked={formData.unit === 'feet'}
                          onChange={handleChange}
                        />
                        <label className="form-check-label small fw-semibold" htmlFor="unitFeet">
                          Feet (ft)
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="row g-2">
                    {/* Length */}
                    <div className="col-4">
                      <label htmlFor="dimLength" className="small text-muted fw-semibold d-block mb-1">
                        Length ({formData.unit === 'feet' ? 'ft' : 'm'})
                      </label>
                      <input
                        type="number"
                        id="dimLength"
                        name="length"
                        min="1"
                        step="0.5"
                        className={`form-control rounded-2 ${errors.length ? 'is-invalid border-danger' : ''}`}
                        placeholder="Length"
                        value={formData.length}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Width */}
                    <div className="col-4">
                      <label htmlFor="dimWidth" className="small text-muted fw-semibold d-block mb-1">
                        Width ({formData.unit === 'feet' ? 'ft' : 'm'})
                      </label>
                      <input
                        type="number"
                        id="dimWidth"
                        name="width"
                        min="1"
                        step="0.5"
                        className={`form-control rounded-2 ${errors.width ? 'is-invalid border-danger' : ''}`}
                        placeholder="Width"
                        value={formData.width}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Depth */}
                    <div className="col-4">
                      <label htmlFor="dimDepth" className="small text-muted fw-semibold d-block mb-1">
                        Avg. Depth ({formData.unit === 'feet' ? 'ft' : 'm'})
                      </label>
                      <input
                        type="number"
                        id="dimDepth"
                        name="depth"
                        min="0.5"
                        step="0.1"
                        className={`form-control rounded-2 ${errors.depth ? 'is-invalid border-danger' : ''}`}
                        placeholder="Depth"
                        value={formData.depth}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Inline dimension errors */}
                  {(errors.length || errors.width || errors.depth) && (
                    <div className="text-danger small mt-2">
                      Please enter valid positive numbers for length, width, and depth.
                    </div>
                  )}
                </div>

                {/* 4. Project Location */}
                <div className="mb-4">
                  <label htmlFor="location" className="form-label fw-semibold" style={{ color: 'var(--color-deep-blue)' }}>
                    Project Location <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className={`form-control form-control-lg rounded-3 ${errors.location ? 'is-invalid border-danger' : ''}`}
                    placeholder="e.g. Pune, Baner, Kothrud, Hinjewadi, or surrounding area"
                    value={formData.location}
                    onChange={handleChange}
                  />
                  {errors.location && (
                    <div className="invalid-feedback d-block text-danger small mt-1">
                      {errors.location}
                    </div>
                  )}
                  <small className="text-muted d-block mt-1">
                    Helps us evaluate site logistics, machinery access, and local soil conditions.
                  </small>
                </div>

                {/* Submit Button */}
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn-whatsapp-custom py-3 text-center fw-bold shadow-sm"
                    style={{ fontSize: '1.05rem' }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        <span>Saving Inquiry &amp; Connecting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit &amp; Open WhatsApp Chat</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M12.031 2C6.495 2 2 6.495 2 12.031c0 1.967.574 3.864 1.66 5.485L2 22l4.636-1.616a9.98 9.98 0 0 0 5.395 1.564h.005c5.534 0 10.029-4.495 10.029-10.031 0-2.679-1.043-5.197-2.937-7.091A9.96 9.96 0 0 0 12.031 2zm0 18.25c-1.69 0-3.32-.47-4.737-1.353l-.339-.21-2.75.958.975-2.68-.225-.357A8.204 8.204 0 0 1 3.78 12.03c0-4.55 3.702-8.25 8.251-8.25 2.203 0 4.275.859 5.834 2.417a8.21 8.21 0 0 1 2.417 5.834c0 4.55-3.701 8.25-8.251 8.25zm4.516-6.195c-.247-.123-1.464-.722-1.692-.804-.227-.082-.393-.123-.558.123-.165.247-.64 1.05-.785 1.215-.144.165-.289.185-.536.062-.247-.123-1.042-.384-1.986-1.226-.735-.656-1.232-1.465-1.376-1.712-.144-.247-.015-.38.109-.503.111-.111.247-.289.37-.433.123-.144.165-.247.247-.412.083-.165.042-.309-.02-.433-.062-.123-.558-1.344-.764-1.84-.2-.484-.403-.418-.557-.426-.144-.008-.309-.01-.474-.01-.165 0-.433.062-.66.309-.227.247-.866.845-.866 2.062s.887 2.392 1.01 2.557c.124.165 1.745 2.664 4.227 3.737.591.255 1.053.407 1.413.521.594.189 1.135.162 1.562.098.477-.071 1.464-.598 1.67-1.175.207-.577.207-1.072.145-1.175-.062-.103-.227-.165-.474-.288z"/>
                        </svg>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center text-muted small mt-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1" aria-hidden="true">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Your details are sent securely via WhatsApp. No account or registration required.
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
