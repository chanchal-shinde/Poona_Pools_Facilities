/**
 * ============================================================================
 * POONA POOLS FACILITIES - SWIMMING POOL COST CALCULATOR UTILITIES
 * ============================================================================
 * 
 * Student / Developer Guide:
 * This file contains pure calculation logic, separated from the UI components.
 * 
 * Formulas:
 * 1. Volume (m³) = Length (m) × Width (m) × Average Depth (m)
 *    - If dimensions are entered in feet, they are converted to metres first:
 *      metres = feet × 0.3048
 * 2. Water Capacity (Litres) = Volume (m³) × 1000
 * 3. Indicative Cost (₹) = Volume (m³) × Base Rate per m³ × Pool Type Multiplier
 * ============================================================================
 */

import { estimatorPricing } from '../config/siteConfig.js';

/**
 * Converts a measurement from feet to meters if needed.
 * If unit is already 'meters', returns the original value.
 *
 * @param {number} value - The dimension value (length, width, or depth)
 * @param {string} unit - 'meters' or 'feet'
 * @returns {number} Value in meters
 */
export function toMeters(value, unit = 'meters') {
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) return 0;
  if (unit === 'feet' || unit === 'ft') {
    return num * estimatorPricing.FEET_TO_METERS;
  }
  return num;
}

/**
 * Calculates the swimming pool volume in cubic meters (m³).
 * Formula: Pool Volume (m³) = Length × Width × Average Depth
 *
 * @param {number} length - Pool length
 * @param {number} width - Pool width
 * @param {number} depth - Pool average depth
 * @param {string} unit - 'meters' or 'feet'
 * @returns {number} Volume in cubic meters (m³)
 */
export function calculatePoolVolume(length, width, depth, unit = 'meters') {
  const lengthM = toMeters(length, unit);
  const widthM = toMeters(width, unit);
  const depthM = toMeters(depth, unit);

  if (lengthM <= 0 || widthM <= 0 || depthM <= 0) {
    return 0;
  }

  return lengthM * widthM * depthM;
}

/**
 * Calculates the estimated water capacity in Litres.
 * Formula: Estimated Water Capacity (Litres) = Pool Volume (m³) × 1000
 *
 * @param {number} volumeCubicMeters - Volume in m³
 * @returns {number} Capacity in Litres
 */
export function calculateWaterCapacity(volumeCubicMeters) {
  if (!volumeCubicMeters || volumeCubicMeters <= 0) {
    return 0;
  }
  return volumeCubicMeters * estimatorPricing.LITERS_PER_CUBIC_METER;
}

/**
 * Calculates the indicative project cost based on pool volume and pool type.
 * Supports dynamic pricing configuration from MongoDB Atlas with static fallback.
 *
 * @param {number} volumeCubicMeters - Volume in m³
 * @param {string} poolTypeId - 'residential', 'commercial', or 'infinity'
 * @param {object} [customPricing] - Optional dynamic pricing configuration from MongoDB
 * @returns {number} Indicative cost in Indian Rupees (₹)
 */
export function calculateEstimatedCost(volumeCubicMeters, poolTypeId = 'residential', customPricing = null) {
  if (!volumeCubicMeters || volumeCubicMeters <= 0) {
    return 0;
  }

  // Use dynamic pricing config if provided, otherwise fallback to static estimatorPricing
  const pricing = customPricing || estimatorPricing;
  const baseRate = pricing.baseRatePerCubicMeter ?? estimatorPricing.baseRatePerCubicMeter;

  // Get type multiplier (defaults to 1.0 if not matched)
  let multiplier = 1.0;
  if (pricing.typeMultipliers && pricing.typeMultipliers[poolTypeId] !== undefined) {
    multiplier = pricing.typeMultipliers[poolTypeId];
  } else if (pricing.poolTypes && Array.isArray(pricing.poolTypes)) {
    const matched = pricing.poolTypes.find((pt) => pt.id === poolTypeId);
    if (matched) multiplier = matched.multiplier;
  } else if (estimatorPricing.typeMultipliers[poolTypeId] !== undefined) {
    multiplier = estimatorPricing.typeMultipliers[poolTypeId];
  }

  // Calculate total: Volume × Base Rate × Multiplier
  const totalCost = volumeCubicMeters * baseRate * multiplier;

  // Return rounded to whole number
  return Math.round(totalCost);
}

/**
 * Formats a currency amount into standard Indian Rupee notation (e.g., ₹ 16,50,000).
 *
 * @param {number} amount - Numeric monetary value
 * @param {object} [customPricing] - Optional pricing configuration for custom currency symbol
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, customPricing = null) {
  const symbol = customPricing?.currencySymbol || estimatorPricing.currencySymbol || '₹';

  if (isNaN(amount) || amount === null || amount === undefined) {
    return `${symbol} 0`;
  }

  // Use Indian number formatting (lakhs / crores)
  try {
    const formatted = Math.round(amount).toLocaleString('en-IN');
    return `${symbol} ${formatted}`;
  } catch {
    return `${symbol} ${Math.round(amount)}`;
  }
}

/**
 * Formats a number with commas and specified decimal places.
 *
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places (default 2)
 * @returns {string} Formatted number
 */
export function formatNumber(value, decimals = 2) {
  const num = parseFloat(value);
  if (isNaN(num)) return '0';
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}
