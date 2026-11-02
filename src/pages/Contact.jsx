import React from 'react';
import SectionHeading from '../components/SectionHeading';
import { siteConfig, getWhatsAppLink, getPhoneLink } from '../config/siteConfig';

export default function Contact() {
  const isMapConfigured = Boolean(
    siteConfig.contact.googleMapsEmbedUrl &&
    siteConfig.contact.googleMapsEmbedUrl.startsWith('https://')
  );

  const faqs = [
    {
      q: 'How do I start a new swimming pool construction inquiry?',
      a: 'The easiest way is to connect with us on WhatsApp or telephone. Provide your rough plot dimensions, location in Pune or surrounding areas, and any design preferences (residential villa, infinity edge, indoor, etc.). We will schedule an initial site feasibility consultation.'
    },
    {
      q: 'What swimming pool maintenance services do you offer?',
      a: 'We offer routine water chemistry testing (pH and chlorine balancing), surface skimming, bottom vacuuming, wall brushing, filtration sand backwashing, and pump diagnostic checks.'
    },
    {
      q: 'Can existing swimming pools be renovated or retiled?',
      a: 'Yes. We specialize in pool renovations including mosaic glass retiling, crack repair, coping stone replacement, and retrofitting existing plants with energy-efficient circulation pumps and LED illumination.'
    },
    {
      q: 'How does Poona Pools Facilities ensure water-tight waterproofing?',
      a: 'We apply multi-coat polymer-modified cementitious waterproofing systems, hydrophilic water-stops at concrete joints, and conduct mandatory 72-hour hydrostatic ponding tests prior to tile tiling.'
    }
  ];

  return (
    <div className="contact-page">
      {/* Page Header / Hero Banner */}
      <section className="bg-light-blue py-5 border-bottom border-light">
        <div className="container py-4 text-center">
          <span className="section-subtitle-badge">Get In Touch</span>
          <h1 className="display-5 fw-bold mb-3" style={{ color: 'var(--color-deep-blue)' }}>
            Contact Poona Pools Facilities
          </h1>
          <div className="section-divider mx-auto" />
          <p className="lead text-secondary mx-auto" style={{ maxWidth: '720px' }}>
            Have questions about swimming pool construction, filtration equipment, or regular maintenance? Reach out directly via WhatsApp or telephone.
          </p>
        </div>
      </section>

      {/* Primary Contact Channels Cards */}
      <section className="section-padding bg-white" aria-labelledby="contact-channels-heading">
        <div className="container">
          <SectionHeading
            subtitle="Direct Communication Channels"
            title="How to Reach Our Team"
            description="We prioritize direct, responsive communication through WhatsApp and telephone for swift project evaluations."
          />

          <div className="row g-4">
            {/* WhatsApp Card */}
            <div className="col-12 col-md-6 col-lg-3">
              <div className="contact-info-card whatsapp-card d-flex flex-column">
                <div className="contact-icon-bubble" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.031 2C6.495 2 2 6.495 2 12.031c0 1.967.574 3.864 1.66 5.485L2 22l4.636-1.616a9.98 9.98 0 0 0 5.395 1.564h.005c5.534 0 10.029-4.495 10.029-10.031 0-2.679-1.043-5.197-2.937-7.091A9.96 9.96 0 0 0 12.031 2zm0 18.25c-1.69 0-3.32-.47-4.737-1.353l-.339-.21-2.75.958.975-2.68-.225-.357A8.204 8.204 0 0 1 3.78 12.03c0-4.55 3.702-8.25 8.251-8.25 2.203 0 4.275.859 5.834 2.417a8.21 8.21 0 0 1 2.417 5.834c0 4.55-3.701 8.25-8.251 8.25zm4.516-6.195c-.247-.123-1.464-.722-1.692-.804-.227-.082-.393-.123-.558.123-.165.247-.64 1.05-.785 1.215-.144.165-.289.185-.536.062-.247-.123-1.042-.384-1.986-1.226-.735-.656-1.232-1.465-1.376-1.712-.144-.247-.015-.38.109-.503.111-.111.247-.289.37-.433.123-.144.165-.247.247-.412.083-.165.042-.309-.02-.433-.062-.123-.558-1.344-.764-1.84-.2-.484-.403-.418-.557-.426-.144-.008-.309-.01-.474-.01-.165 0-.433.062-.66.309-.227.247-.866.845-.866 2.062s.887 2.392 1.01 2.557c.124.165 1.745 2.664 4.227 3.737.591.255 1.053.407 1.413.521.594.189 1.135.162 1.562.098.477-.071 1.464-.598 1.67-1.175.207-.577.207-1.072.145-1.175-.062-.103-.227-.165-.474-.288z"/>
                  </svg>
                </div>
                <h3 className="contact-card-title">WhatsApp Chat</h3>
                <div className="contact-card-value text-success">
                  {siteConfig.contact.whatsapp}
                </div>
                <p className="contact-card-desc">
                  Fastest response for project inquiries, site photos, and estimates.
                </p>
                <div className="mt-auto">
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp-custom w-100 py-2 px-3 text-center"
                    style={{ fontSize: '0.9rem' }}
                  >
                    <span>Open WhatsApp Chat</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Telephone Card */}
            <div className="col-12 col-md-6 col-lg-3">
              <div className="contact-info-card d-flex flex-column">
                <div className="contact-icon-bubble" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <h3 className="contact-card-title">Telephone</h3>
                <div className="contact-card-value">
                  {siteConfig.contact.displayPhone}
                </div>
                <p className="contact-card-desc">
                  Direct telephone support for project consultations and service inquiries.
                </p>
                <div className="mt-auto">
                  <a
                    href={getPhoneLink()}
                    className="btn-secondary-custom w-100 py-2 px-3 text-center"
                    style={{ fontSize: '0.9rem' }}
                  >
                    <span>Call Directly</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Office Location Card */}
            <div className="col-12 col-md-6 col-lg-3">
              <div className="contact-info-card d-flex flex-column">
                <div className="contact-icon-bubble" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <h3 className="contact-card-title">Business Location</h3>
                <div className="contact-card-value" style={{ fontSize: '0.95rem' }}>
                  {siteConfig.contact.address}
                </div>
                <p className="contact-card-desc">
                  {siteConfig.contact.cityState}
                </p>
                <div className="mt-auto small text-muted">
                  Owner / Representative: <br />
                  <strong className="text-dark">{siteConfig.owner.name}</strong>
                </div>
              </div>
            </div>

            {/* Official Email Card */}
            <div className="col-12 col-md-6 col-lg-3">
              <div className="contact-info-card d-flex flex-column">
                <div className="contact-icon-bubble" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <h3 className="contact-card-title">Official Email</h3>
                <div className="contact-card-value" style={{ fontSize: '0.95rem' }}>
                  {siteConfig.contact.email}
                </div>
                <p className="contact-card-desc">
                  Send technical inquiries, site plans, and project drawings anytime.
                </p>
                <div className="mt-auto">
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="btn-secondary-custom w-100 py-2 px-3 text-center"
                    style={{ fontSize: '0.9rem' }}
                  >
                    <span>Send Email</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps / Location Section */}
      <section className="section-padding bg-light-blue" aria-labelledby="map-heading">
        <div className="container">
          <SectionHeading
            subtitle="Find Our Office"
            title="Business Location &amp; Region Served"
            description={siteConfig.contact.locationSummary}
          />

          <div className="map-embed-wrapper">
            {isMapConfigured ? (
              <iframe
                title="Poona Pools Facilities Location Map"
                src={siteConfig.contact.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="map-placeholder-box">
                <div className="map-placeholder-icon" aria-hidden="true">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <h3 className="h5 fw-bold mb-2" style={{ color: 'var(--color-deep-blue)' }}>
                  {siteConfig.organizationName}
                </h3>
                <p className="text-secondary mb-1" style={{ maxWidth: '500px' }}>
                  {siteConfig.contact.address}, {siteConfig.contact.cityState}
                </p>
                <p className="small text-muted mb-3">
                  (Google Maps embed URL can be configured in <code>src/config/siteConfig.js</code>)
                </p>
                <div className="d-flex gap-2">
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp-custom py-2 px-3"
                    style={{ fontSize: '0.875rem' }}
                  >
                    <span>Request Exact Location on WhatsApp</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="section-padding bg-white" aria-labelledby="faq-heading">
        <div className="container">
          <SectionHeading
            subtitle="Common Inquiries"
            title="Frequently Asked Questions"
            description="Clear answers regarding our swimming pool consultation, engineering standards, and maintenance schedules."
          />

          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div className="accordion d-flex flex-column gap-3" id="faqAccordion">
                {faqs.map((faq, index) => (
                  <div key={index} className="border rounded-3 p-4 bg-light-blue shadow-sm">
                    <h3 className="h6 fw-bold mb-2" style={{ color: 'var(--color-deep-blue)' }}>
                      {faq.q}
                    </h3>
                    <p className="text-secondary small mb-0" style={{ lineHeight: '1.6' }}>
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Prominent Call To Action */}
      <section className="section-padding-sm bg-light-blue" aria-labelledby="contact-cta-heading">
        <div className="container">
          <div className="cta-banner">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <span className="badge bg-info text-dark mb-2 px-3 py-2 fw-semibold">
                  Fastest Communication
                </span>
                <h2 id="contact-cta-heading" className="cta-title">
                  Ready to Discuss Your Pool Requirements?
                </h2>
                <p className="cta-text">
                  Direct WhatsApp messaging and telephone calls connect you immediately with our technical team without automated chatbots or delayed forms.
                </p>
              </div>

              <div className="col-lg-4 text-lg-end">
                <div className="d-flex flex-column flex-sm-row flex-lg-column gap-3 justify-content-lg-end">
                  <a
                    href={getWhatsAppLink('Hello Poona Pools Facilities, I am ready to discuss my swimming pool project with you.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp-custom"
                  >
                    <span>Send Message on WhatsApp</span>
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
