/**
 * ==============================================================================
 * SITE CONTENT & SETTINGS CONTEXT (src/context/SiteContentContext.jsx)
 * ==============================================================================
 * Student / Developer Guide:
 * Provides dynamic business settings and website content to all customer-facing
 * pages and components (Navbar, Footer, WhatsAppButton, Home, About, Contact).
 * 
 * Reliability Guarantee:
 * Initializes immediately with static defaults from `src/config/siteConfig.js`.
 * Loads the latest values from MongoDB Atlas (/api/public/settings and /api/public/content).
 * If the API is loading or temporarily offline, all public pages seamlessly retain
 * the static fallback without any layout shift or error.
 * ==============================================================================
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { siteConfig } from '../config/siteConfig';
import api from '../services/api';

const SiteContentContext = createContext(null);

export function SiteContentProvider({ children }) {
  // Settings State (Contact, Phone, WhatsApp, Maps)
  const [settings, setSettings] = useState(siteConfig.contact);

  // Content State (Branding, Owner, Mission/Vision, Statistics, Why Choose Us)
  const [content, setContent] = useState({
    organizationName: siteConfig.organizationName,
    tagline: siteConfig.tagline,
    shortDescription: siteConfig.shortDescription,
    owner: siteConfig.owner,
    establishedYear: siteConfig.establishedYear,
    missionVision: siteConfig.missionVision,
    whyChooseUs: siteConfig.whyChooseUs,
    statistics: siteConfig.statistics
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDynamicContentAndSettings() {
      try {
        const [settingsRes, contentRes] = await Promise.allSettled([
          api.get('/api/public/settings'),
          api.get('/api/public/content')
        ]);

        if (isMounted) {
          if (settingsRes.status === 'fulfilled' && settingsRes.value?.success && settingsRes.value.data) {
            setSettings((prev) => ({
              ...prev,
              ...settingsRes.value.data
            }));
          }

          if (contentRes.status === 'fulfilled' && contentRes.value?.success && contentRes.value.data) {
            const d = contentRes.value.data;
            setContent((prev) => ({
              ...prev,
              organizationName: d.organizationName || prev.organizationName,
              tagline: d.tagline || prev.tagline,
              shortDescription: d.shortDescription || prev.shortDescription,
              owner: d.owner || prev.owner,
              establishedYear: d.establishedYear || prev.establishedYear,
              missionVision: d.missionVision || prev.missionVision,
              whyChooseUs: Array.isArray(d.whyChooseUs) && d.whyChooseUs.length > 0 ? d.whyChooseUs : prev.whyChooseUs,
              statistics: Array.isArray(d.statistics) && d.statistics.length > 0 ? d.statistics : prev.statistics
            }));
          }
        }
      } catch (err) {
        console.warn('Dynamic site content fetch fallback to static config:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDynamicContentAndSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  // Dynamic WhatsApp Link Helper
  const getDynamicWhatsAppLink = (customMessage) => {
    const rawNumber = (settings.whatsapp || siteConfig.contact.whatsapp).replace(/[^0-9]/g, '');
    const prefilled = customMessage || settings.whatsappPrefilledMessage || siteConfig.contact.whatsappPrefilledMessage;
    const encoded = encodeURIComponent(prefilled);

    if (!rawNumber || rawNumber.length < 5) {
      return `https://wa.me/?text=${encoded}`;
    }
    return `https://wa.me/${rawNumber}?text=${encoded}`;
  };

  // Dynamic Phone Link Helper
  const getDynamicPhoneLink = () => {
    const rawPhone = (settings.phone || siteConfig.contact.phone).replace(/[^0-9+]/g, '');
    if (!rawPhone) return 'tel:';
    return `tel:${rawPhone}`;
  };

  const value = {
    settings,
    content,
    loading,
    getWhatsAppLink: getDynamicWhatsAppLink,
    getPhoneLink: getDynamicPhoneLink
  };

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
}

/**
 * Custom hook for consuming site content and settings
 */
export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) {
    // If used outside provider, gracefully fallback to siteConfig
    return {
      settings: siteConfig.contact,
      content: {
        organizationName: siteConfig.organizationName,
        tagline: siteConfig.tagline,
        shortDescription: siteConfig.shortDescription,
        owner: siteConfig.owner,
        establishedYear: siteConfig.establishedYear,
        missionVision: siteConfig.missionVision,
        whyChooseUs: siteConfig.whyChooseUs,
        statistics: siteConfig.statistics
      },
      loading: false,
      getWhatsAppLink: (msg) => `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(msg || siteConfig.contact.whatsappPrefilledMessage)}`,
      getPhoneLink: () => `tel:${siteConfig.contact.phone}`
    };
  }
  return context;
}

