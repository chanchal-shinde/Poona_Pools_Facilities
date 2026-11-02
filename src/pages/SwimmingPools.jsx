import React, { useState } from 'react';
import PoolCard from '../components/PoolCard';
import { poolCategories, poolsData } from '../data/pools';
import { siteConfig, getWhatsAppLink, getPhoneLink } from '../config/siteConfig';

export default function SwimmingPools() {
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter pool items based on selected category
  const filteredPools = poolsData.filter((pool) => {
    if (activeCategory === 'all') return true;
    return pool.category === activeCategory;
  });

  return (
    <div className="swimming-pools-page">
      {/* Header / Hero Banner */}
      <section className="bg-light-blue py-5 border-bottom border-light">
        <div className="container py-4 text-center">
          <span className="section-subtitle-badge">Architectural Showcase</span>
          <h1 className="display-5 fw-bold mb-3" style={{ color: 'var(--color-deep-blue)' }}>
            Swimming Pool Designs &amp; Types
          </h1>
          <div className="section-divider mx-auto" />
          <p className="lead text-secondary mx-auto" style={{ maxWidth: '720px' }}>
            Discover our collection of swimming pool concepts, from private villa retreats and vanishing infinity edges to indoor lap pools and commercial aquatic centers.
          </p>
        </div>
      </section>

      {/* Interactive Category Filter & Pool Grid */}
      <section className="section-padding bg-white" aria-label="Swimming Pools Gallery">
        <div className="container">
          {/* Simple React State Category Filter */}
          <div className="filter-tabs-wrapper" role="tablist" aria-label="Filter swimming pools by category">
            {poolCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat.id}
                className={`filter-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Results Counter / Filter status */}
          <div className="text-center mb-4 text-secondary small">
            Showing {filteredPools.length} {filteredPools.length === 1 ? 'pool design' : 'pool designs'}
          </div>

          {/* Responsive Gallery Grid */}
          <div className="row g-4">
            {filteredPools.map((pool) => (
              <div key={pool.id} className="col-12 col-md-6 col-lg-4">
                <PoolCard pool={pool} />
              </div>
            ))}
          </div>

          {filteredPools.length === 0 && (
            <div className="text-center py-5">
              <p className="text-muted">No pool designs match the selected category.</p>
              <button
                type="button"
                className="btn-secondary-custom"
                onClick={() => setActiveCategory('all')}
              >
                Reset Filter
              </button>
            </div>
          )}

          {/* Technical Feasibility Note */}
          <div className="mt-5 p-4 rounded-4 bg-light-blue border border-sky">
            <div className="d-flex align-items-start gap-3">
              <div className="p-2 rounded-circle bg-white text-primary flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </div>
              <div>
                <h3 className="h6 fw-bold mb-1" style={{ color: 'var(--color-deep-blue)' }}>
                  Architectural &amp; Site Feasibility Notice
                </h3>
                <p className="small text-secondary mb-0" style={{ lineHeight: '1.6' }}>
                  Every swimming pool project is subject to site topography, soil load-bearing capacity, setback regulations, and municipal permissions. Dimensions, water depth profiles, filtration plant room positioning, and finishing materials can be customized according to your property specifications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding-sm bg-light-blue" aria-labelledby="pools-cta-heading">
        <div className="container">
          <div className="cta-banner">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <span className="badge bg-info text-dark mb-2 px-3 py-2 fw-semibold">
                  Personalized Consultation
                </span>
                <h2 id="pools-cta-heading" className="cta-title">
                  Have a Specific Pool Concept in Mind?
                </h2>
                <p className="cta-text">
                  Send us your property dimensions or reference ideas on WhatsApp, and our team will guide you on the most structurally sound design.
                </p>
              </div>

              <div className="col-lg-4 text-lg-end">
                <div className="d-flex flex-column flex-sm-row flex-lg-column gap-3 justify-content-lg-end">
                  <a
                    href={getWhatsAppLink('Hello Poona Pools Facilities, I have a specific swimming pool design concept I would like to discuss.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp-custom"
                  >
                    <span>Discuss on WhatsApp</span>
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
