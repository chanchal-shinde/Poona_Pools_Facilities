/**
 * ==============================================================================
 * BUSINESS SETTINGS CONTROLLER (backend/controllers/settingsController.js)
 * ==============================================================================
 * Student / Developer Guide:
 * Handles HTTP requests for reading and updating business contact settings.
 * 
 * Public Endpoint:
 * - GET /api/public/settings  -> Returns contact numbers, WhatsApp, email & address
 * 
 * Protected Admin Endpoints:
 * - GET /api/admin/settings   -> Returns settings with full audit timestamps
 * - PUT /api/admin/settings   -> Validates and updates business settings
 * ==============================================================================
 */

import BusinessSettings from '../models/BusinessSettings.js';

// Default starter values based on authentic company details in siteConfig.js
const defaultSettings = {
  key: 'default',
  phone: '+91 99231 76194',
  displayPhone: '+91 99231 76194',
  whatsapp: '919923176194',
  whatsappPrefilledMessage:
    'Hello Poona Pools Facilities, I am interested in your swimming pool services. Could you please share more details and arrange a consultation?',
  email: 'poonapools@gmail.com',
  address: 'Pune, Maharashtra, India',
  cityState: 'Pune, Maharashtra, India',
  googleMapsEmbedUrl: '',
  locationSummary: 'Serving Pune, Pimpri-Chinchwad, and surrounding regions in Maharashtra.',
  lastUpdatedBy: 'System Seed'
};

/**
 * @desc    Fetch business contact settings for public website components
 * @route   GET /api/public/settings
 * @access  Public
 */
export async function getPublicSettings(req, res) {
  try {
    let settings = await BusinessSettings.findOne({ key: 'default' }).select('-_id -__v -lastUpdatedBy');

    // Auto-create default settings document if not present
    if (!settings) {
      settings = await BusinessSettings.create(defaultSettings);
    }

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching public business settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve business settings.',
      error: error.message
    });
  }
}

/**
 * @desc    Fetch business contact settings for admin dashboard
 * @route   GET /api/admin/settings
 * @access  Private (Admin only)
 */
export async function getAdminSettings(req, res) {
  try {
    let settings = await BusinessSettings.findOne({ key: 'default' });

    if (!settings) {
      settings = await BusinessSettings.create(defaultSettings);
    }

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching admin business settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve business settings for admin.',
      error: error.message
    });
  }
}

/**
 * @desc    Update business contact settings
 * @route   PUT /api/admin/settings
 * @access  Private (Admin only)
 */
export async function updateSettings(req, res) {
  try {
    const {
      phone,
      displayPhone,
      whatsapp,
      whatsappPrefilledMessage,
      email,
      address,
      cityState,
      googleMapsEmbedUrl,
      locationSummary
    } = req.body;

    // 1. Validation: Phone
    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required.'
      });
    }

    // 2. Validation: WhatsApp (must have digits)
    const cleanWhatsapp = (whatsapp || '').replace(/[^0-9]/g, '');
    if (!cleanWhatsapp || cleanWhatsapp.length < 7) {
      return res.status(400).json({
        success: false,
        message: 'A valid WhatsApp phone number with country code is required (e.g. 919923176194).'
      });
    }

    // 3. Validation: Email
    if (!email || !email.trim() || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'A valid email address is required.'
      });
    }

    // 4. Update the singleton settings document
    let settings = await BusinessSettings.findOne({ key: 'default' });
    if (!settings) {
      settings = new BusinessSettings({ key: 'default' });
    }

    settings.phone = phone.trim();
    settings.displayPhone = (displayPhone || phone).trim();
    settings.whatsapp = cleanWhatsapp;
    settings.whatsappPrefilledMessage = (whatsappPrefilledMessage || '').trim();
    settings.email = email.trim().toLowerCase();
    settings.address = (address || '').trim();
    settings.cityState = (cityState || 'Pune, Maharashtra, India').trim();
    settings.googleMapsEmbedUrl = (googleMapsEmbedUrl || '').trim();
    settings.locationSummary = (locationSummary || '').trim();
    settings.lastUpdatedBy = req.admin?.email || 'Admin';

    const savedSettings = await settings.save();

    res.status(200).json({
      success: true,
      message: 'Business settings updated successfully and applied across the public website.',
      data: savedSettings
    });
  } catch (error) {
    console.error('Error updating business settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update business settings.',
      error: error.message
    });
  }
}

