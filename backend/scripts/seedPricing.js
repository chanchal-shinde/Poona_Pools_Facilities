/**
 * ==============================================================================
 * PRICING SEED SCRIPT (backend/scripts/seedPricing.js)
 * ==============================================================================
 * Student / Developer Guide:
 * Migrates existing static pricing configuration from `src/config/siteConfig.js`
 * into MongoDB Atlas as the single source of truth for the cost estimator.
 * 
 * Safety:
 * - Checks if the default pricing document already exists.
 * - If found, retains existing rates (unless --force flag is passed).
 * - If not found, initializes the collection with authentic placeholder rates.
 * 
 * Usage:
 *   node backend/scripts/seedPricing.js
 *   node backend/scripts/seedPricing.js --force
 * ==============================================================================
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Pricing from '../models/Pricing.js';
import { connectDB } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Resolve backend/.env reliably regardless of working directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const defaultPricing = {
  key: 'default',
  baseRatePerCubicMeter: 22000,
  currencySymbol: '₹',
  currencyCode: 'INR',
  poolTypes: [
    {
      id: 'residential',
      label: 'Residential',
      multiplier: 1.0
    },
    {
      id: 'commercial',
      label: 'Commercial',
      multiplier: 1.35
    },
    {
      id: 'infinity',
      label: 'Infinity Pool',
      multiplier: 1.5
    }
  ],
  feetToMeters: 0.3048,
  litersPerCubicMeter: 1000,
  disclaimer:
    'Indicative Estimate Notice: This calculation provides an estimated budgetary guide based on standard dimensions. Actual project costs depend on site topography, soil conditions, civil excavation, premium tiling choices, pump horsepower, and filtration machinery. Contact Poona Pools Facilities for an authentic quotation.',
  isPlaceholder: true,
  isConfigured: true,
  lastUpdatedBy: 'System Migration Seed'
};

async function seedPricing() {
  const force = process.argv.includes('--force');

  try {
    console.log('Connecting to MongoDB Atlas...');
    const conn = await connectDB();
    if (!conn) {
      throw new Error('Database connection could not be established.');
    }

    console.log('\n--- Checking Pricing Configuration in MongoDB Atlas ---');
    const existing = await Pricing.findOne({ key: 'default' });

    if (existing && !force) {
      console.log(`[INFO] Pricing configuration already exists (Base Rate: ${existing.currencySymbol} ${existing.baseRatePerCubicMeter.toLocaleString('en-IN')}/m³).`);
      console.log('Use --force to overwrite existing pricing configuration with seed defaults.');
      await mongoose.disconnect();
      process.exit(0);
    }

    if (existing && force) {
      console.log('[WARN] --force flag detected. Updating existing pricing configuration to seed defaults...');
      existing.baseRatePerCubicMeter = defaultPricing.baseRatePerCubicMeter;
      existing.currencySymbol = defaultPricing.currencySymbol;
      existing.currencyCode = defaultPricing.currencyCode;
      existing.poolTypes = defaultPricing.poolTypes;
      existing.feetToMeters = defaultPricing.feetToMeters;
      existing.litersPerCubicMeter = defaultPricing.litersPerCubicMeter;
      existing.disclaimer = defaultPricing.disclaimer;
      existing.isPlaceholder = defaultPricing.isPlaceholder;
      existing.isConfigured = defaultPricing.isConfigured;
      existing.lastUpdatedBy = defaultPricing.lastUpdatedBy;

      await existing.save();
      console.log('[SUCCESS] Existing pricing configuration refreshed with seed defaults.');
    } else {
      console.log('[INFO] No existing pricing configuration found. Creating initial document...');
      const pricingDoc = new Pricing(defaultPricing);
      await pricingDoc.save();
      console.log('[SUCCESS] Initial pricing configuration successfully seeded into MongoDB Atlas.');
    }

    const current = await Pricing.findOne({ key: 'default' });
    console.log('\n=== CURRENT DATABASE PRICING CONFIGURATION ===');
    console.log(`Base Rate:        ${current.currencySymbol} ${current.baseRatePerCubicMeter.toLocaleString('en-IN')} per m³`);
    console.log(`Currency:         ${current.currencyCode} (${current.currencySymbol})`);
    console.log(`Pool Types:       ${current.poolTypes.map((t) => `${t.label} (${t.multiplier}x)`).join(', ')}`);
    console.log(`Is Placeholder:   ${current.isPlaceholder}`);
    console.log(`Is Configured:    ${current.isConfigured}`);
    console.log('==============================================\n');

    await mongoose.disconnect();
    console.log('Database disconnected cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Failed to seed pricing configuration:', error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

seedPricing();
