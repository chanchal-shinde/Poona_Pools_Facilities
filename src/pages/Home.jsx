import React from 'react';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import SectionHeading from '../components/SectionHeading';
import ServiceCard from '../components/ServiceCard';
import PoolCard from '../components/PoolCard';
import ReviewsSection from '../components/ReviewsSection';
import { useSiteContent } from '../context/SiteContentContext';
import { servicesData } from '../data/services';
import { poolsData } from '../data/pools';

export default function Home() {
  const { content, settings, getWhatsAppLink, getPhoneLink } = useSiteContent();

  // Preview first 6 services on homepage
  const previewServices = servicesData.slice(0, 6);
  // Preview first 4 pool designs on homepage
  const previewPools = poolsData.slice(0, 4);

  return (
    <div className="home-page">
      {/* 1. Hero Section with Image Slider */}
      <HeroSlider />

      {/* 2. Business Statistics Strip */}
      <section className="stats-strip-container" aria-label="Organization Statistics">
        <div className="container">
          <div className="row g-3 g-md-4">
            {content.statistics.map((stat, index) => (
              <div key={index} className="col-6 col-lg-3">
                <div className="stats-card">
                  <div className="stats-value">{stat.value}</div>
                  <div className="stats-label">{stat.label}</div>
                  <p className="stats-desc d-none d-sm-block">{stat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Introduction to Poona Pools Facilities */}
      <section className="section-padding bg-white" aria-labelledby="intro-heading">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="section-subtitle-badge">About Our Organization</span>
              <h2 id="intro-heading" className="section-title">
                Building Reliable, High-Performance Swimming Pools in Pune
              </h2>
              <div className="section-divider" />
              
              <p className="lead text-secondary" style={{ fontSize: '1.1rem' }}>
                At {content.organizationName}, we provide professional swimming pool engineering, durable civil construction, multi-stage water filtration, and preventative maintenance services.
              </p>
              
              <p>
                Whether you are planning a tranquil residential villa swimming pool, an architectural infinity edge design, an indoor climate-controlled pool, or a high-capacity commercial facility, our team focuses on structural safety, precision waterproofing, and pristine water circulation.
              </p>

              <div className="d-flex flex-wrap gap-3 mt-4">
                <Link to="/about" className="btn-secondary-custom">
                  <span>Learn About Our Organization</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp-custom"
                >
                  <span>Chat With Us</span>
                </a>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="position-relative">
                <img
                  src="/images/about-intro.jpg"
                  alt="High quality swimming pool project by Poona Pools Facilities"
                  className="rounded-4 shadow-lg w-100"
                  style={{ maxHeight: '440px', objectFit: 'cover' }}
                  loading="lazy"
                />
                <div
                  className="position-absolute bottom-0 start-0 m-3 p-3 rounded-3 shadow-sm border border-light"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(8px)',
                    maxWidth: '280px'
                  }}
                >
                  <div className="fw-bold mb-1" style={{ color: 'var(--color-deep-blue)' }}>
                    Engineering Excellence
                  </div>
                  <p className="small mb-0" style={{ color: 'var(--color-text-body)' }}>
                    Precision rebar reinforcement, multi-coat waterproofing, and balanced hydraulics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Services Preview Section */}
      <section className="section-padding bg-light-blue" aria-labelledby="services-preview-heading">
        <div className="container">
          <SectionHeading
            subtitle="What We Do"
            title="Comprehensive Swimming Pool Services"
            description="From initial ground excavation and civil engineering to seasonal maintenance and equipment upgrades, explore our complete scope of solutions."
          />

          <div className="row g-4">
            {previewServices.map((service) => (
              <div key={service.id} className="col-12 col-md-6 col-lg-4">
                <ServiceCard service={service} />
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <Link to="/services" className="btn-primary-custom">
              <span>View All Detailed Services</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Swimming Pool Gallery Preview */}
      <section className="section-padding bg-white" aria-labelledby="gallery-preview-heading">
        <div className="container">
          <SectionHeading
            subtitle="Design Showcase"
            title="Featured Swimming Pool Designs"
            description="Explore our collection of residential, infinity, indoor, and commercial swimming pool environments tailored to different architectural styles."
          />

          <div className="row g-4">
            {previewPools.map((pool) => (
              <div key={pool.id} className="col-12 col-md-6 col-lg-3">
                <PoolCard pool={pool} />
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <Link to="/pools" className="btn-secondary-custom">
              <span>Explore All Pool Types &amp; Designs</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Mission, Vision, and Commitment */}
      <section className="section-padding bg-light-blue" aria-labelledby="mission-heading">
        <div className="container">
          <SectionHeading
            subtitle="Our Guiding Principles"
            title="Mission, Vision &amp; Commitment"
            description="Our core philosophy centers on structural safety, crystal-clear water hygiene, and enduring customer trust."
          />

          <div className="row g-4">
            {/* Mission */}
            <div className="col-12 col-md-4">
              <div className="pillar-card">
                <div className="pillar-icon-box" aria-hidden="true">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                </div>
                <h3 className="pillar-title">Our Mission</h3>
                <p className="pillar-text">{content.missionVision.mission}</p>
              </div>
            </div>

            {/* Vision */}
            <div className="col-12 col-md-4">
              <div className="pillar-card">
                <div className="pillar-icon-box" aria-hidden="true">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <h3 className="pillar-title">Our Vision</h3>
                <p className="pillar-text">{content.missionVision.vision}</p>
              </div>
            </div>

            {/* Commitment */}
            <div className="col-12 col-md-4">
              <div className="pillar-card">
                <div className="pillar-icon-box" aria-hidden="true">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3 className="pillar-title">Our Commitment</h3>
                <p className="pillar-text">{content.missionVision.commitment}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Why Choose Us? */}
      <section className="section-padding bg-white" aria-labelledby="why-choose-heading">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5">
              <span className="section-subtitle-badge">The Advantage</span>
              <h2 id="why-choose-heading" className="section-title">
                Why Choose Poona Pools Facilities?
              </h2>
              <div className="section-divider" />
              <p className="text-secondary mb-4">
                Swimming pool construction requires specialized civil engineering, chemical water knowledge, and hydraulic precision. Here is why homeowners and businesses entrust their pool projects to us.
              </p>

              <div className="rounded-4 overflow-hidden shadow-sm border border-light">
                <img
                  src="/images/pool-filtration.jpg"
                  alt="Quality filtration plant engineering"
                  className="w-100"
                  style={{ height: '240px', objectFit: 'cover' }}
                  loading="lazy"
                />
              </div>
            </div>

            <div className="col-lg-7">
              <div className="ps-lg-3">
                {content.whyChooseUs.map((item, index) => (
                  <div key={index} className="feature-item-box">
                    <div className="feature-item-icon" aria-hidden="true">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="feature-item-title">{item.title}</h3>
                      <p className="feature-item-text">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Customer Reviews & Ratings */}
      <ReviewsSection />

      {/* 9. Contact Call-To-Action */}
      <section className="section-padding-sm bg-white" aria-labelledby="cta-heading">
        <div className="container">
          <div className="cta-banner">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <span className="badge bg-info text-dark mb-2 px-3 py-2 fw-semibold">
                  Start Your Project
                </span>
                <h2 id="cta-heading" className="cta-title">
                  Planning Your Swimming Pool Project?
                </h2>
                <p className="cta-text">
                  Get in touch with Poona Pools Facilities to discuss your requirements, site conditions, filtration equipment, or maintenance schedule.
                </p>
              </div>

              <div className="col-lg-4 text-lg-end">
                <div className="d-flex flex-column flex-sm-row flex-lg-column gap-3 justify-content-lg-end">
                  <a
                    href={getWhatsAppLink('Hello Poona Pools Facilities, I am planning a swimming pool project and would like to consult with you.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp-custom"
                  >
                    <span>WhatsApp Inquiry</span>
                  </a>

                  <a
                    href={getPhoneLink()}
                    className="btn-outline-light-custom"
                  >
                    <span>Call: {settings.displayPhone}</span>
                  </a>

                  <Link to="/contact" className="btn-secondary-custom">
                    <span>Contact Us Page</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
