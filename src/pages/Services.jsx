import React, { useState, useEffect } from 'react';
import SectionHeading from '../components/SectionHeading';
import ServiceCard from '../components/ServiceCard';
import { servicesData as fallbackServices } from '../data/services';
import { siteConfig, getWhatsAppLink, getPhoneLink } from '../config/siteConfig';
import api from '../services/api';

/**
 * ==============================================================================
 * SERVICES PAGE - POONA POOLS FACILITIES (Dynamic Integration Phase 4A)
 * ==============================================================================
 * Student / Developer Guide:
 * Fetches active services dynamically from the Express/MongoDB Atlas API
 * (/api/public/services).
 * 
 * Reliability Guarantee:
 * If the API is loading or temporarily unreachable, it seamlessly falls back to
 * `src/data/services.js` so the customer website never displays an empty screen.
 * ==============================================================================
 */
export default function Services() {
  const [services, setServices] = useState(fallbackServices);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadActiveServices() {
      try {
        const res = await api.get('/api/public/services');
        if (isMounted && res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setServices(res.data);
        }
      } catch (err) {
        console.warn('API services fetch fallback to static dataset:', err.message);
        // Retains fallbackServices seamlessly
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadActiveServices();

    return () => {
      isMounted = false;
    };
  }, []);

  const steps = [
    {
      step: '01',
      title: 'Consultation & Site Survey',
      desc: 'Understanding your vision, inspecting the terrain, soil conditions, space dimensions, and access constraints.'
    },
    {
      step: '02',
      title: 'Engineering & Filtration Sizing',
      desc: 'Determining RCC shell structural reinforcement, pipe routing, pump horsepower, and turnover rate specifications.'
    },
    {
      step: '03',
      title: 'Construction & Waterproofing',
      desc: 'Precision excavation, steel fixing, concrete casting, multi-stage waterproofing application, and hydrostatic testing.'
    },
    {
      step: '04',
      title: 'Finishing, Tiling & Plant Setup',
      desc: 'Mosaic tiling, coping installation, plumbing connections, sand filter installation, and LED lighting setup.'
    },
    {
      step: '05',
      title: 'Water Balancing & Support',
      desc: 'Filling, chemical balancing, system commissioning, client operational handover, and routine maintenance assistance.'
    }
  ];

  return (
    <div className="services-page">
      {/* Page Header / Hero Banner */}
      <section className="bg-light-blue py-5 border-bottom border-light">
        <div className="container py-4 text-center">
          <span className="section-subtitle-badge">Professional Aquatic Solutions</span>
          <h1 className="display-5 fw-bold text-dark mb-3" style={{ color: 'var(--color-deep-blue)' }}>
            Our Swimming Pool Services
          </h1>
          <div className="section-divider mx-auto" />
          <p className="lead text-secondary mx-auto" style={{ maxWidth: '750px' }}>
            Comprehensive swimming pool engineering, durable civil construction, multi-stage water filtration systems, routine maintenance, and facility upgrades tailored to your needs.
          </p>
        </div>
      </section>

      {/* Main Services Grid */}
      <section className="section-padding bg-white" aria-label="Services Catalog">
        <div className="container">
          {/* Status Indicator (Subtle, professional) */}
          {loading && (
            <div className="text-center py-3 mb-3">
              <span className="spinner-border spinner-border-sm text-primary me-2" role="status" />
              <small className="text-muted">Loading live service catalog...</small>
            </div>
          )}

          <div className="row g-4">
            {services.map((service) => (
              <div key={service._id || service.serviceId || service.id} className="col-12 col-md-6 col-lg-4">
                <ServiceCard service={service} detailed={true} />
              </div>
            ))}
          </div>

          {services.length === 0 && !loading && (
            <div className="text-center py-5">
              <p className="text-muted">No active services are currently listed. Please contact us directly.</p>
            </div>
          )}
        </div>
      </section>

      {/* Structured Engineering Workflow / Process */}
      <section className="section-padding bg-light-blue" aria-labelledby="workflow-heading">
        <div className="container">
          <SectionHeading
            subtitle="How We Work"
            title="Our Structured Project Process"
            description="From initial soil and site assessment to water balancing and preventative care, we follow rigorous civil engineering standards."
          />

          <div className="row g-4 justify-content-center">
            {steps.map((item, index) => (
              <div key={index} className="col-12 col-md-6 col-lg-4">
                <div className="bg-white p-4 rounded-4 shadow-sm border border-light h-100 d-flex flex-column">
                  <div
                    className="fw-bold mb-3 d-inline-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: '44px',
                      height: '44px',
                      backgroundColor: 'var(--color-sky-soft)',
                      color: 'var(--color-deep-blue)',
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.1rem'
                    }}
                  >
                    {item.step}
                  </div>
                  <h3 className="h5 fw-bold mb-2" style={{ color: 'var(--color-deep-blue)' }}>
                    {item.title}
                  </h3>
                  <p className="text-secondary small mb-0" style={{ lineHeight: '1.6' }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="section-padding-sm bg-white" aria-labelledby="services-cta-heading">
        <div className="container">
          <div className="cta-banner">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <span className="badge bg-info text-dark mb-2 px-3 py-2 fw-semibold">
                  Custom Inquiries Welcome
                </span>
                <h2 id="services-cta-heading" className="cta-title">
                  Require a Specific Swimming Pool Service?
                </h2>
                <p className="cta-text">
                  Whether you need a full construction consultation, routine filtration plant inspection, or urgent pool leak waterproofing, speak directly with our team.
                </p>
              </div>

              <div className="col-lg-4 text-lg-end">
                <div className="d-flex flex-column flex-sm-row flex-lg-column gap-3 justify-content-lg-end">
                  <a
                    href={getWhatsAppLink('Hello Poona Pools Facilities, I am interested in your swimming pool services. Can we discuss?')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp-custom"
                  >
                    <span>Inquire on WhatsApp</span>
                  </a>

                  <a
                    href={getPhoneLink()}
                    className="btn-outline-light-custom"
                  >
                    <span>Call: {siteConfig.contact.displayPhone}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
