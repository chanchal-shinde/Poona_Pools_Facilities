
export const siteConfig = {
  // Business Branding
  organizationName: 'Poona Pools Facilities',
  tagline: 'Professional Swimming Pool Construction, Filtration & Maintenance Solutions',
  shortDescription: 'From custom swimming pool engineering and reinforced construction to filtration and routine maintenance, Poona Pools Facilities provides tailored solutions designed around your space.',

  // Leadership / Owner Information
  // (Easily editable owner information: name, designation, and experience)
  owner: {
    name: 'Sunil Shinde',
    designation: 'CEO',
    experience: '12+ Years'
  },
  establishedYear: '2017',

  // Contact Details
  contact: {
    // Phone number for clickable tel: links
    phone: '+91 99231 76194',
    displayPhone: '+91 99231 76194',

    // WhatsApp number (Digits only with country code, e.g., '919876543210')
    // EDIT HERE: Change this value to update the WhatsApp number used across the whole site & quote form
    whatsapp: '919923176194',

    // Default prefilled message when a customer clicks WhatsApp
    whatsappPrefilledMessage: 'Hello Poona Pools Facilities, I am interested in your swimming pool services. Could you please share more details and arrange a consultation?',

    // Email address
    email: 'poonapools@gmail.com',

    // Physical business address
    address: 'poonapools@gmail.com',
    cityState: 'Pune, Maharashtra, India',

    // Google Maps Embed URL
    // To set up your map: Go to Google Maps -> Search your business -> Click Share -> Embed a map -> Copy the 'src' URL inside the iframe
    googleMapsEmbedUrl: '', // Leave empty to display the clean location placeholder card
    locationSummary: 'Serving Pune, Pimpri-Chinchwad, and surrounding regions in Maharashtra.'
  },

  // Key Statistics (Displayed on Homepage & About Page)
  // Use clear placeholders until authentic figures are provided
  statistics: [
    {
      label: 'Years of Experience',
      value: '12+',
      suffix: '',
      description: 'Dedicated focus on swimming pool construction & technical maintenance'
    },
    {
      label: 'Projects Completed',
      value: '150+',
      suffix: '',
      description: 'Residential, luxury, and commercial pool installations'
    },
    {
      label: 'Services Offered',
      value: '10+',
      suffix: '',
      description: 'Comprehensive end-to-end swimming pool facility solutions'
    },
    {
      label: 'Customer Satisfaction',
      value: '100%',
      suffix: '',
      description: 'Committed to rigorous craftsmanship and long-term water safety'
    }
  ],

  // Core Company Mission, Vision, and Commitment
  missionVision: {
    mission: 'To construct and maintain superior swimming pool facilities with uncompromising structural integrity, energy-efficient filtration, and bespoke architectural aesthetics tailored to each client.',
    vision: 'To be the most trusted and technically proficient swimming pool engineering and maintenance organization in the region, recognized for transparent craftsmanship and exceptional client service.',
    commitment: 'We commit to using premium commercial-grade materials, precision waterproofing techniques, and prompt post-handover maintenance support so your swimming pool remains pristine, hygienic, and enjoyable for decades.'
  },

  // Why Choose Us Pillars
  whyChooseUs: [
    {
      title: 'Quality Workmanship',
      description: 'Engineered concrete shells, premium coping stones, and durable mosaic finishes built to withstand high water pressure and weather extremes.'
    },
    {
      title: 'Professional Service',
      description: 'Direct communication, transparent milestones, and professional execution from initial excavation to final water balancing.'
    },
    {
      title: 'Tailored Solutions',
      description: 'Custom dimensions, depths, and architectural pool layouts configured specifically to your land topography and lifestyle.'
    },
    {
      title: 'Attention to Detail',
      description: 'Meticulous plumbing, multi-stage filtration plumbing, leak-free waterproofing membranes, and polished aesthetic tiling.'
    },
    {
      title: 'Reliable Support',
      description: 'Dependable routine maintenance, chemical testing, equipment servicing, and prompt technical support whenever you need assistance.'
    }
  ]
};

/**
 * ============================================================================
 * EDITABLE CONFIGURATION FOR QUOTE FORM & COST ESTIMATOR
 * ============================================================================
 * Student / Owner Note:
 * Modify this section to change pool types, available services, or pricing rates.
 * Everything is centralized here so you do not have to touch the calculation logic.
 * ============================================================================
 */

/**
 * Available Pool Types for both the Quote Form and Cost Estimator
 * - id: unique internal identifier
 * - label: human-readable name shown in dropdowns
 * - multiplier: cost multiplier relative to residential base rate
 */
export const poolTypes = [
  { id: 'residential', label: 'Residential', multiplier: 1.0 },
  { id: 'commercial', label: 'Commercial', multiplier: 1.35 },
  { id: 'infinity', label: 'Infinity Pool', multiplier: 1.5 }
];

/**
 * Available Services for the Quote Form dropdown
 * Matches the core services provided by Poona Pools Facilities
 */
export const quoteServices = [
  'Swimming Pool Construction',
  'Swimming Pool Maintenance',
  'Filtration and Circulation Systems',
  'Swimming Pool Renovation',
  'Pool Waterproofing Solutions',
  'Pool Equipment and Accessories',
  'Custom Facility Consultation'
];

/**
 * Swimming Pool Cost Estimator Pricing Configuration
 *
 * IMPORTANT PLACEHOLDER NOTICE:
 * The pricing values below are SAMPLE PLACEHOLDERS provided for demonstration
 * and indicative estimation purposes only. They DO NOT represent the company's
 * actual rates. The website owner must replace them with authentic business rates
 * before publishing.
 */
export const estimatorPricing = {
  // Base indicative construction cost per cubic meter (m³) in INR
  // (Placeholder rate - update with actual rate per m³ before publishing)
  baseRatePerCubicMeter: 22000,

  // Currency symbol displayed in UI
  currencySymbol: '₹',

  // Currency code for formatting
  currencyCode: 'INR',

  // Multipliers applied to base rate depending on pool complexity
  typeMultipliers: {
    residential: 1.0,
    commercial: 1.35,
    infinity: 1.5
  },

  // Measurement conversion constants
  // 1 foot = 0.3048 meters
  FEET_TO_METERS: 0.3048,

  // 1 cubic meter = 1000 Litres of water
  LITERS_PER_CUBIC_METER: 1000,

  // Indicative estimate disclaimer text displayed to customers
  disclaimer:
    'Indicative Estimate Notice: This calculation provides an estimated budgetary guide based on standard dimensions. Actual project costs depend on site topography, soil conditions, civil excavation, premium tiling choices, pump horsepower, and filtration machinery. Contact Poona Pools Facilities for an authentic quotation.'
};

/**
 * Helper to build valid WhatsApp click-to-chat URL
 * @param {string} customMessage Optional message override
 * @returns {string} Fully formed WhatsApp link
 */
export function getWhatsAppLink(customMessage) {
  const number = siteConfig.contact.whatsapp.replace(/[^0-9]/g, '');
  const message = encodeURIComponent(customMessage || siteConfig.contact.whatsappPrefilledMessage);

  // If the number is still a placeholder, provide a fallback alert link or direct wa.me
  if (!number || number.includes('[') || number.length < 5) {
    return `https://wa.me/?text=${message}`;
  }
  return `https://wa.me/${number}?text=${message}`;
}

/**
 * Helper to get clean telephone link
 * @returns {string} tel: link
 */
export function getPhoneLink() {
  const cleanPhone = siteConfig.contact.phone.replace(/[^0-9+]/g, '');
  if (!cleanPhone || cleanPhone.includes('[')) {
    return 'tel:';
  }
  return `tel:${cleanPhone}`;
}
