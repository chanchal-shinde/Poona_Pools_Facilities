import React from 'react';
import { getWhatsAppLink } from '../config/siteConfig';

export default function PoolCard({ pool }) {
  const whatsappUrl = getWhatsAppLink(pool.inquiryMessage);

  return (
    <article className="pool-card">
      <div className="pool-card-media">
        <img
          src={pool.image}
          alt={pool.title}
          className="pool-card-img"
          loading="lazy"
        />
        <span className="pool-category-pill">{pool.categoryLabel}</span>
      </div>

      <div className="pool-card-content">
        <h3 className="pool-card-title">{pool.title}</h3>
        <p className="pool-card-desc">{pool.description}</p>

        {/* Disclaimer if this is a movable/portable design */}
        {pool.isDisclaimerNotice && (
          <div className="pool-disclaimer-box" role="note">
            <strong>Technical Note:</strong> {pool.disclaimerText}
          </div>
        )}

        {/* Specifications / Project Details */}
        {pool.specifications && pool.specifications.length > 0 && (
          <ul className="pool-specs-list">
            {pool.specifications.map((spec, index) => (
              <li key={index}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>{spec}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-3 border-top d-flex gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp-custom py-2 px-3 w-100 text-center"
            style={{ fontSize: '0.9rem' }}
          >
            <span>Inquire About This Pool</span>
          </a>
        </div>
      </div>
    </article>
  );
}
