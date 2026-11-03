import React from 'react';
import { useSiteContent } from '../context/SiteContentContext';

/**
 * Reusable Floating WhatsApp Contact Button
 * Appears across all pages, provides instant click-to-chat communication.
 */
export default function WhatsAppButton({ customMessage }) {
  const { content, getWhatsAppLink } = useSiteContent();
  const whatsappUrl = getWhatsAppLink(customMessage);

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-whatsapp-btn"
      aria-label={`Chat with ${content.organizationName} on WhatsApp`}
      title="Contact us directly on WhatsApp"
    >
      <div className="floating-whatsapp-pulse" aria-hidden="true" />
      <span className="floating-whatsapp-tooltip" aria-hidden="true">
        Chat on WhatsApp
      </span>
      {/* Official WhatsApp SVG Icon */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12.031 2C6.495 2 2 6.495 2 12.031c0 1.967.574 3.864 1.66 5.485L2 22l4.636-1.616a9.98 9.98 0 0 0 5.395 1.564h.005c5.534 0 10.029-4.495 10.029-10.031 0-2.679-1.043-5.197-2.937-7.091A9.96 9.96 0 0 0 12.031 2zm0 18.25c-1.69 0-3.32-.47-4.737-1.353l-.339-.21-2.75.958.975-2.68-.225-.357A8.204 8.204 0 0 1 3.78 12.03c0-4.55 3.702-8.25 8.251-8.25 2.203 0 4.275.859 5.834 2.417a8.21 8.21 0 0 1 2.417 5.834c0 4.55-3.701 8.25-8.251 8.25zm4.516-6.195c-.247-.123-1.464-.722-1.692-.804-.227-.082-.393-.123-.558.123-.165.247-.64 1.05-.785 1.215-.144.165-.289.185-.536.062-.247-.123-1.042-.384-1.986-1.226-.735-.656-1.232-1.465-1.376-1.712-.144-.247-.015-.38.109-.503.111-.111.247-.289.37-.433.123-.144.165-.247.247-.412.083-.165.042-.309-.02-.433-.062-.123-.558-1.344-.764-1.84-.2-.484-.403-.418-.557-.426-.144-.008-.309-.01-.474-.01-.165 0-.433.062-.66.309-.227.247-.866.845-.866 2.062s.887 2.392 1.01 2.557c.124.165 1.745 2.664 4.227 3.737.591.255 1.053.407 1.413.521.594.189 1.135.162 1.562.098.477-.071 1.464-.598 1.67-1.175.207-.577.207-1.072.145-1.175-.062-.103-.227-.165-.474-.288z"/>
      </svg>
    </a>
  );
}
