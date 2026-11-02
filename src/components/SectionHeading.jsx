import React from 'react';

/**
 * SectionHeading Component
 * Standardized header for page sections with subtitle badge, title, water divider, and description.
 */
export default function SectionHeading({
  subtitle,
  title,
  description,
  alignment = 'center',
  light = false
}) {
  const isCenter = alignment === 'center';

  return (
    <div className={`section-heading-wrapper ${isCenter ? 'text-center' : ''}`}>
      {subtitle && (
        <span
          className="section-subtitle-badge"
          style={light ? { color: 'var(--color-sky-accent)' } : {}}
        >
          {subtitle}
        </span>
      )}
      <h2
        className="section-title"
        style={light ? { color: 'var(--color-white)' } : {}}
      >
        {title}
      </h2>
      <div className="section-divider" />
      {description && (
        <p
          className="section-description"
          style={light ? { color: 'rgba(255, 255, 255, 0.85)' } : {}}
        >
          {description}
        </p>
      )}
    </div>
  );
}
