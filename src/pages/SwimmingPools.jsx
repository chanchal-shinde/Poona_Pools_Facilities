import React, { useState, useEffect } from 'react';
import PoolCard from '../components/PoolCard';
import { poolCategories as fallbackCategories, poolsData as fallbackPools } from '../data/pools';
import { siteConfig, getWhatsAppLink, getPhoneLink } from '../config/siteConfig';
import api from '../services/api';

/**
 * ==============================================================================
 * SWIMMING POOLS SHOWCASE & GALLERY (Dynamic Integration Phase 4B)
 * ==============================================================================
 * Student / Developer Guide:
 * Fetches active categories and active designs from MongoDB Atlas APIs:
 * - GET /api/public/pool-categories
 * - GET /api/public/pool-designs
 * 
 * Reliability Guarantee:
 * Falls back to static `src/data/pools.js` if the backend is loading or
 * offline, ensuring zero layout breakages.
 * ==============================================================================
 */
export default function SwimmingPools() {
  const [categories, setCategories] = useState(fallbackCategories);
  const [designs, setDesigns] = useState(fallbackPools);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadPoolData() {
      try {
        const [catsRes, designsRes] = await Promise.all([
          api.get('/api/public/pool-categories'),
          api.get('/api/public/pool-designs')
        ]);

        if (isMounted) {
          if (catsRes && catsRes.success && Array.isArray(catsRes.data) && catsRes.data.length > 0) {
            // Form category tabs: Virtual 'all' tab + active categories from MongoDB
            const dynamicTabs = [
              { id: 'all', label: 'All Designs' },
              ...catsRes.data.map((c) => ({
                id: c.categoryId,
                label: c.label
              }))
            ];
            setCategories(dynamicTabs);
          }

          if (designsRes && designsRes.success && Array.isArray(designsRes.data) && designsRes.data.length > 0) {
            setDesigns(designsRes.data);
          }
        }
      } catch (err) {
        console.warn('API pool data fetch fallback to static dataset:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadPoolData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter pool items based on selected category
  const filteredPools = designs.filter((pool) => {
    if (activeCategory === 'all') return true;
    const catSlug = pool.categorySlug || (typeof pool.category === 'object' ? pool.category?.categoryId : pool.category);
    return catSlug === activeCategory;
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
          {/* Loading Indicator */}
          {loading && (
            <div className="text-center py-2 mb-3">
              <span className="spinner-border spinner-border-sm text-primary me-2" role="status" />
              <small className="text-muted">Loading live gallery designs...</small>
            </div>
          )}

          {/* Simple React State Category Filter */}
          <div className="filter-tabs-wrapper" role="tablist" aria-label="Filter swimming pools by category">
            {categories.map((cat) => (
              <button
                key={cat.id || cat.categoryId}
                type="button"
                role="tab"
                aria-selected={activeCategory === (cat.id || cat.categoryId)}
                className={`filter-tab-btn ${activeCategory === (cat.id || cat.categoryId) ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id || cat.categoryId)}
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
              <div key={pool._id || pool.designId || pool.id} className="col-12 col-md-6 col-lg-4">
                <PoolCard pool={pool} />
              </div>
            ))}
          </div>

          {filteredPools.length === 0 && !loading && (
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
