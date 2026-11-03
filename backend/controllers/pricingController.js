/**
 * ==============================================================================
 * PRICING & ESTIMATOR CONTROLLER (backend/controllers/pricingController.js)
 * ==============================================================================
 * Student / Developer Guide:
 * Handles HTTP requests for reading and updating pool cost estimator pricing.
 * 
 * Public Endpoints:
 * - GET /api/public/pricing -> Returns active pricing rules, base rate & multipliers
 * 
 * Protected Admin Endpoints:
 * - GET /api/admin/pricing  -> Returns full pricing configuration with audit details
 * - PUT /api/admin/pricing  -> Updates base rate, pool types, multipliers, and disclaimer
 * ==============================================================================
 */

import Pricing from '../models/Pricing.js';

// Default starter values in case database is empty
const fallbackDefaults = {
  key: 'default',
  baseRatePerCubicMeter: 22000,
  currencySymbol: '₹',
  currencyCode: 'INR',
  poolTypes: [
    { id: 'residential', label: 'Residential', multiplier: 1.0 },
    { id: 'commercial', label: 'Commercial', multiplier: 1.35 },
    { id: 'infinity', label: 'Infinity Pool', multiplier: 1.5 }
  ],
  typeMultipliers: {
    residential: 1.0,
    commercial: 1.35,
    infinity: 1.5
  },
  feetToMeters: 0.3048,
  litersPerCubicMeter: 1000,
  disclaimer:
    'Indicative Estimate Notice: This calculation provides an estimated budgetary guide based on standard dimensions. Actual project costs depend on site topography, soil conditions, civil excavation, premium tiling choices, pump horsepower, and filtration machinery. Contact Poona Pools Facilities for an authentic quotation.',
  isPlaceholder: true,
  isConfigured: true
};

/**
 * @desc    Fetch active pricing configuration for public cost estimator
 * @route   GET /api/public/pricing
 * @access  Public
 */
export async function getPublicPricing(req, res) {
  try {
    let pricing = await Pricing.findOne({ key: 'default' }).select('-_id -__v -lastUpdatedBy');

    // Auto-initialize if database record doesn't exist yet
    if (!pricing) {
      pricing = await Pricing.create(fallbackDefaults);
    }

    res.status(200).json({
      success: true,
      data: pricing
    });
  } catch (error) {
    console.error('Error fetching public pricing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve pricing configuration.',
      error: error.message
    });
  }
}

/**
 * @desc    Fetch full pricing configuration for admin dashboard
 * @route   GET /api/admin/pricing
 * @access  Private (Admin only)
 */
export async function getAdminPricing(req, res) {
  try {
    let pricing = await Pricing.findOne({ key: 'default' });

    if (!pricing) {
      pricing = await Pricing.create(fallbackDefaults);
    }

    res.status(200).json({
      success: true,
      data: pricing
    });
  } catch (error) {
    console.error('Error fetching admin pricing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin pricing configuration.',
      error: error.message
    });
  }
}

/**
 * @desc    Update pricing configuration (base rate, pool types, disclaimer)
 * @route   PUT /api/admin/pricing
 * @access  Private (Admin only)
 */
export async function updatePricing(req, res) {
  try {
    const {
      baseRatePerCubicMeter,
      currencySymbol,
      currencyCode,
      poolTypes,
      disclaimer,
      isPlaceholder
    } = req.body;

    // 1. Validation: Base Rate per m³
    const parsedBaseRate = Number(baseRatePerCubicMeter);
    if (isNaN(parsedBaseRate) || parsedBaseRate < 1000) {
      return res.status(400).json({
        success: false,
        message: 'Base rate per cubic meter must be a valid number and at least ₹1,000 / m³.'
      });
    }

    // 2. Validation: Pool Types
    if (!poolTypes || !Array.isArray(poolTypes) || poolTypes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one pool type configuration must be provided.'
      });
    }

    const validatedPoolTypes = [];
    const typeMultipliersMap = new Map();

    for (let i = 0; i < poolTypes.length; i++) {
      const item = poolTypes[i];
      const rawId = (item.id || '').toString().trim().toLowerCase();
      const rawLabel = (item.label || '').toString().trim();
      const rawMultiplier = Number(item.multiplier);

      if (!rawId) {
        return res.status(400).json({
          success: false,
          message: `Pool type at index ${i + 1} must have a unique ID/slug.`
        });
      }

      if (!rawLabel) {
        return res.status(400).json({
          success: false,
          message: `Pool type "${rawId}" must have a display label.`
        });
      }

      if (isNaN(rawMultiplier) || rawMultiplier < 0.1 || rawMultiplier > 10.0) {
        return res.status(400).json({
          success: false,
          message: `Multiplier for "${rawLabel}" must be between 0.1x and 10.0x.`
        });
      }

      validatedPoolTypes.push({
        id: rawId,
        label: rawLabel,
        multiplier: rawMultiplier
      });

      typeMultipliersMap.set(rawId, rawMultiplier);
    }

    // 3. Validation: Disclaimer Text
    if (!disclaimer || disclaimer.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Quotation disclaimer notice is required and must be at least 10 characters long.'
      });
    }

    // 4. Update the singleton pricing document
    let pricingDoc = await Pricing.findOne({ key: 'default' });

    if (!pricingDoc) {
      pricingDoc = new Pricing({ key: 'default' });
    }

    pricingDoc.baseRatePerCubicMeter = parsedBaseRate;
    pricingDoc.currencySymbol = (currencySymbol || '₹').trim();
    pricingDoc.currencyCode = (currencyCode || 'INR').trim().toUpperCase();
    pricingDoc.poolTypes = validatedPoolTypes;
    pricingDoc.typeMultipliers = typeMultipliersMap;
    pricingDoc.disclaimer = disclaimer.trim();
    if (typeof isPlaceholder === 'boolean') {
      pricingDoc.isPlaceholder = isPlaceholder;
    }
    pricingDoc.isConfigured = true;
    pricingDoc.lastUpdatedBy = req.admin?.email || 'Admin';

    const savedDoc = await pricingDoc.save();

    res.status(200).json({
      success: true,
      message: 'Pricing configuration updated successfully and published to live estimator.',
      data: savedDoc
    });
  } catch (error) {
    console.error('Error updating pricing configuration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update pricing configuration.',
      error: error.message
    });
  }
}

