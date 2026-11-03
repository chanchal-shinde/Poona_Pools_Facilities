/**
 * ==============================================================================
 * PRICING & COST ESTIMATOR CONFIGURATION MONGOOSE MODEL (backend/models/Pricing.js)
 * ==============================================================================
 * Student / Developer Guide:
 * Establishes MongoDB Atlas as the single source of truth for all pool cost
 * estimator formulas, base construction rates, and complexity multipliers.
 * 
 * Core Formula:
 * - Volume (m³) = Length (m) × Width (m) × Average Depth (m)
 * - Water Capacity (L) = Volume (m³) × 1000
 * - Indicative Cost (₹) = Volume (m³) × Base Rate per m³ × Pool Type Multiplier
 * ==============================================================================
 */

import mongoose from 'mongoose';

const poolTypeItemSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'Pool type identifier is required'],
      trim: true,
      lowercase: true
    },
    label: {
      type: String,
      required: [true, 'Pool type label is required'],
      trim: true
    },
    multiplier: {
      type: Number,
      required: [true, 'Complexity multiplier is required'],
      min: [0.1, 'Multiplier must be at least 0.1'],
      max: [10.0, 'Multiplier cannot exceed 10.0']
    }
  },
  { _id: false }
);

const pricingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'default',
      trim: true
    },
    // Base indicative construction cost per cubic meter (m³) in INR
    baseRatePerCubicMeter: {
      type: Number,
      required: [true, 'Base rate per cubic meter is required'],
      min: [1000, 'Base rate must be at least ₹1,000 per m³']
    },
    // Currency configuration
    currencySymbol: {
      type: String,
      default: '₹',
      trim: true
    },
    currencyCode: {
      type: String,
      default: 'INR',
      trim: true
    },
    // Pool type configurations (used for dropdowns and multipliers)
    poolTypes: {
      type: [poolTypeItemSchema],
      required: [true, 'At least one pool type configuration is required'],
      validate: {
        validator: function (types) {
          return Array.isArray(types) && types.length > 0;
        },
        message: 'At least one pool type configuration must be present'
      }
    },
    // Map of id -> multiplier for fast calculation lookup
    typeMultipliers: {
      type: Map,
      of: Number,
      default: () => new Map()
    },
    // Measurement constants
    feetToMeters: {
      type: Number,
      default: 0.3048
    },
    litersPerCubicMeter: {
      type: Number,
      default: 1000
    },
    // Quotation disclaimer notice displayed to public users
    disclaimer: {
      type: String,
      required: [true, 'Quotation disclaimer text is required'],
      trim: true,
      default:
        'Indicative Estimate Notice: This calculation provides an estimated budgetary guide based on standard dimensions. Actual project costs depend on site topography, soil conditions, civil excavation, premium tiling choices, pump horsepower, and filtration machinery. Contact Poona Pools Facilities for an authentic quotation.'
    },
    // Status flags
    isPlaceholder: {
      type: Boolean,
      default: true
    },
    isConfigured: {
      type: Boolean,
      default: true
    },
    lastUpdatedBy: {
      type: String,
      default: 'System Seed'
    }
  },
  {
    timestamps: true,
    toJSON: { flattenMaps: true },
    toObject: { flattenMaps: true }
  }
);

// Pre-save hook: automatically synchronize typeMultipliers Map from poolTypes array
pricingSchema.pre('save', function (next) {
  if (this.poolTypes && Array.isArray(this.poolTypes)) {
    const map = new Map();
    this.poolTypes.forEach((item) => {
      if (item.id && typeof item.multiplier === 'number') {
        map.set(item.id.toLowerCase().trim(), item.multiplier);
      }
    });
    this.typeMultipliers = map;
  }
  next();
});

const Pricing = mongoose.model('Pricing', pricingSchema);

export default Pricing;

