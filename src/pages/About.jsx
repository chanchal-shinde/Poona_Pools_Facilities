import React from 'react';
import SectionHeading from '../components/SectionHeading';
import { siteConfig, getWhatsAppLink } from '../config/siteConfig';

export default function About() {
  const companyValues = [
    {
      title: 'Quality',
      desc: 'We never compromise on reinforced steel gauge, certified concrete grade, or high-efficiency filtration units.'
    },
    {
      title: 'Reliability',
      desc: 'Dependable timelines, honest technical feasibility evaluations, and lifelong post-handover support.'
    },
    {
      title: 'Professionalism',
      desc: 'Transparent pricing schedules, certified safety standards, and orderly worksite discipline.'
    },
    {
      title: 'Customer Satisfaction',
      desc: 'Listening closely to individual preferences, offering practical advice, and exceeding design expectations.'
    },
    {
      title: 'Attention to Detail',
      desc: 'Flawless mosaic alignments, water-tight pipe joints, neat plant room manifolds, and safe non-slip surfaces.'
    }
  ];

  const galleryImages = [
    { src: '/images/hero-pool-1.jpg', label: 'Villa Swimming Pool, Residential Project' },
    { src: '/images/hero-pool-2.jpg', label: 'Indoor Architectural Lap Pool Facility' },
    { src: '/images/hero-pool-3.jpg', label: 'Scenic Vanishing Infinity Edge Pool' },
    { src: '/images/pool-filtration.jpg', label: 'Multi-port Commercial Sand Filtration Plant' },
    { src: '/images/pool-construction.jpg', label: 'Reinforced Concrete Shell Rebar Construction' },
    { src: '/images/pool-renovation.jpg', label: 'Glass Mosaic Retiling & Coping Upgrades' }
  ];

  return (
    <div className="about-page">
      {/* Page Header / Hero Banner */}
      <section className="bg-light-blue py-5 border-bottom border-light">
        <div className="container py-4 text-center">
          <span className="section-subtitle-badge">Dedicated Aquatic Engineering</span>
          <h1 className="display-5 fw-bold mb-3" style={{ color: 'var(--color-deep-blue)' }}>
            About Poona Pools Facilities
          </h1>
          <div className="section-divider mx-auto" />
          <p className="lead text-secondary mx-auto" style={{ maxWidth: '720px' }}>
            A specialized swimming pool engineering and maintenance organization committed to delivering durable, safe, and beautifully finished aquatic environments in Pune.
          </p>
        </div>
      </section>

      {/* Company Introduction & Philosophy */}
      <section className="section-padding bg-white" aria-labelledby="about-intro-heading">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="section-subtitle-badge">Our Story &amp; Expertise</span>
              <h2 id="about-intro-heading" className="section-title">
                Committed to Structural Integrity &amp; Pure Water
              </h2>
              <div className="section-divider" />
              
              <p className="lead text-secondary" style={{ fontSize: '1.05rem' }}>
                {siteConfig.organizationName} was founded with a clear focus: to bridge the gap between architectural aesthetic beauty and rigorous civil engineering in swimming pool facilities.
              </p>

              <p>
                A swimming pool is both a major civil structure bearing tons of hydraulic pressure and a delicate biochemical ecosystem requiring balanced sanitation and circulation. By combining reinforced concrete construction techniques with commercial-grade filtration plants and specialized multi-layer waterproofing, we ensure our clients enjoy leak-proof pools that maintain immaculate water clarity year-round.
              </p>

              <p>
                Whether you are building a private residential pool for family leisure or managing an Olympic-sized commercial pool facility, our team offers hands-on guidance from initial excavation to scheduled water chemistry servicing.
              </p>
            </div>

            <div className="col-lg-6">
              <div className="rounded-4 overflow-hidden shadow-lg border border-light">
                <img
                  src="/images/about-intro.jpg"
                  alt="Poona Pools Facilities Project Construction"
                  className="w-100"
                  style={{ height: '380px', objectFit: 'cover' }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Owner Information */}
      <section className="section-padding bg-light-blue" aria-labelledby="owner-heading">
        <div className="container">
          <SectionHeading
            subtitle="Leadership &amp; Ownership"
            title="Owner Information"
            description="Organization leadership details for Poona Pools Facilities."
          />

          <div className="row g-4 justify-content-center">
            {/* Owner's Name */}
            <div className="col-12 col-md-4">
              <div className="owner-info-card text-center h-100">
                <div className="owner-info-icon" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="owner-info-label">Owner's Name</div>
                <div className="owner-info-value">{siteConfig.owner.name}</div>
              </div>
            </div>

            {/* Designation */}
            <div className="col-12 col-md-4">
              <div className="owner-info-card text-center h-100">
                <div className="owner-info-icon" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>
                <div className="owner-info-label">Designation</div>
                <div className="owner-info-value">{siteConfig.owner.designation}</div>
              </div>
            </div>

            {/* Experience */}
            <div className="col-12 col-md-4">
              <div className="owner-info-card text-center h-100">
                <div className="owner-info-icon" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="owner-info-label">Experience</div>
                <div className="owner-info-value">{siteConfig.owner.experience}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Experience & Milestones */}
      <section className="section-padding bg-white" aria-labelledby="experience-heading">
        <div className="container">
          <SectionHeading
            subtitle="Our Track Record"
            title="Experience &amp; Operational Milestones"
            description="Transparent, reliable delivery built step-by-step through rigorous project execution."
          />

          <div className="row g-4 justify-content-center">
            <div className="col-md-4">
              <div className="p-4 rounded-4 bg-light-blue text-center h-100 border border-sky">
                <div className="display-5 fw-bold mb-2" style={{ color: 'var(--color-deep-blue)', fontFamily: 'var(--font-heading)' }}>
                  {siteConfig.establishedYear}
                </div>
                <h3 className="h6 fw-bold mb-2" style={{ color: 'var(--color-primary-blue)' }}>
                  Year Established
                </h3>
                <p className="small text-secondary mb-0">
                  Established with a foundational vision for specialized swimming pool engineering in Pune.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 rounded-4 bg-light-blue text-center h-100 border border-sky">
                <div className="display-5 fw-bold mb-2" style={{ color: 'var(--color-deep-blue)', fontFamily: 'var(--font-heading)' }}>
                  {siteConfig.statistics[0].value}
                </div>
                <h3 className="h6 fw-bold mb-2" style={{ color: 'var(--color-primary-blue)' }}>
                  Years of Industry Experience
                </h3>
                <p className="small text-secondary mb-0">
                  Extensive domain expertise in hydraulic pipe sizing, waterproofing membranes, and construction.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 rounded-4 bg-light-blue text-center h-100 border border-sky">
                <div className="display-5 fw-bold mb-2" style={{ color: 'var(--color-deep-blue)', fontFamily: 'var(--font-heading)' }}>
                  {siteConfig.statistics[1].value}
                </div>
                <h3 className="h6 fw-bold mb-2" style={{ color: 'var(--color-primary-blue)' }}>
                  Projects Completed
                </h3>
                <p className="small text-secondary mb-0">
                  Successful execution of residential, community, and commercial swimming pool installations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Company Values */}
      <section className="section-padding bg-light-blue" aria-labelledby="values-heading">
        <div className="container">
          <SectionHeading
            subtitle="The Principles That Guide Us"
            title="Our Core Business Values"
            description="Every proposal, concrete pour, and chemical test is guided by our commitment to engineering ethics and client transparency."
          />

          <div className="row g-4">
            {companyValues.map((val, idx) => (
              <div key={idx} className="col-12 col-md-6 col-lg">
                <div className="bg-white p-4 rounded-4 shadow-sm border border-light h-100 text-center">
                  <div
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: 'var(--color-sky-light)',
                      color: 'var(--color-primary-blue)'
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <h3 className="h5 fw-bold mb-2" style={{ color: 'var(--color-deep-blue)' }}>
                    {val.title}
                  </h3>
                  <p className="text-secondary small mb-0" style={{ lineHeight: '1.6' }}>
                    {val.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Showcase Gallery */}
      <section className="section-padding bg-white" aria-labelledby="project-gallery-heading">
        <div className="container">
          <SectionHeading
            subtitle="Visual Portfolio"
            title="Project Photography Showcase"
            description="Explore representative photography illustrating our work across construction, filtration, and completed swimming pools."
          />

          <div className="row g-4">
            {galleryImages.map((item, index) => (
              <div key={index} className="col-12 col-md-6 col-lg-4">
                <div className="rounded-4 overflow-hidden shadow-sm border border-light h-100 position-relative group">
                  <img
                    src={item.src}
                    alt={item.label}
                    className="w-100"
                    style={{ height: '260px', objectFit: 'cover' }}
                    loading="lazy"
                  />
                  <div
                    className="p-3"
                    style={{
                      backgroundColor: 'var(--color-white)',
                      borderTop: '1px solid var(--color-border)'
                    }}
                  >
                    <span className="small fw-semibold" style={{ color: 'var(--color-deep-blue)' }}>
                      {item.label}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <a
              href={getWhatsAppLink('Hello Poona Pools Facilities, I viewed your projects on the About page and would like to consult with you.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-custom"
            >
              <span>Discuss Your Swimming Pool Project</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
