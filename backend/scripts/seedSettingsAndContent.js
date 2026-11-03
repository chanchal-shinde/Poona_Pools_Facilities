/**
 * ==============================================================================
 * BUSINESS SETTINGS & WEBSITE CONTENT SEED SCRIPT (backend/scripts/seedSettingsAndContent.js)
 * ==============================================================================
 * Student / Developer Guide:
 * Migrates existing static business settings and website content from
 * `src/config/siteConfig.js` into MongoDB Atlas.
 * 
 * Safety:
 * - Checks if singleton documents already exist.
 * - Does not overwrite existing custom settings unless `--force` is specified.
 * - Preserves authentic owner information: Sunil Shinde, CEO, 12+ Years.
 * - Preserves telephone, WhatsApp, email, mission/vision, and statistics.
 * 
 * Usage:
 *   node backend/scripts/seedSettingsAndContent.js
 *   node backend/scripts/seedSettingsAndContent.js --force
 * ==============================================================================
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import BusinessSettings from '../models/BusinessSettings.js';
import WebsiteContent from '../models/WebsiteContent.js';
import { connectDB } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

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
  lastUpdatedBy: 'System Migration Seed'
};

const defaultContent = {
  key: 'default',
  organizationName: 'Poona Pools Facilities',
  tagline: 'Professional Swimming Pool Construction, Filtration & Maintenance Solutions',
  shortDescription:
    'From custom swimming pool engineering and reinforced construction to filtration and routine maintenance, Poona Pools Facilities provides tailored solutions designed around your space.',
  owner: {
    name: 'Sunil Shinde',
    designation: 'CEO',
    experience: '12+ Years'
  },
  establishedYear: '2017',
  missionVision: {
    mission:
      'To construct and maintain superior swimming pool facilities with uncompromising structural integrity, energy-efficient filtration, and bespoke architectural aesthetics tailored to each client.',
    vision:
      'To be the most trusted and technically proficient swimming pool engineering and maintenance organization in the region, recognized for transparent craftsmanship and exceptional client service.',
    commitment:
      'We commit to using premium commercial-grade materials, precision waterproofing techniques, and prompt post-handover maintenance support so your swimming pool remains pristine, hygienic, and enjoyable for decades.'
  },
  whyChooseUs: [
    {
      title: 'Quality Workmanship',
      description:
        'Engineered concrete shells, premium coping stones, and durable mosaic finishes built to withstand high water pressure and weather extremes.'
    },
    {
      title: 'Professional Service',
      description:
        'Direct communication, transparent milestones, and professional execution from initial excavation to final water balancing.'
    },
    {
      title: 'Tailored Solutions',
      description:
        'Custom dimensions, depths, and architectural pool layouts configured specifically to your land topography and lifestyle.'
    },
    {
      title: 'Attention to Detail',
      description:
        'Meticulous plumbing, multi-stage filtration plumbing, leak-free waterproofing membranes, and polished aesthetic tiling.'
    },
    {
      title: 'Reliable Support',
      description:
        'Dependable routine maintenance, chemical testing, equipment servicing, and prompt technical support whenever you need assistance.'
    }
  ],
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
  lastUpdatedBy: 'System Migration Seed'
};

async function seedSettingsAndContent() {
  const force = process.argv.includes('--force');

  try {
    console.log('Connecting to MongoDB Atlas...');
    const conn = await connectDB();
    if (!conn) {
      throw new Error('Database connection could not be established.');
    }

    console.log('\n--- 1. Seeding Business Settings ---');
    const existingSettings = await BusinessSettings.findOne({ key: 'default' });
    if (existingSettings && !force) {
      console.log(`[INFO] Business settings already exist (Phone: ${existingSettings.displayPhone}, WhatsApp: ${existingSettings.whatsapp}).`);
    } else if (existingSettings && force) {
      console.log('[WARN] --force flag detected. Updating business settings to defaults...');
      Object.assign(existingSettings, defaultSettings);
      await existingSettings.save();
      console.log('[SUCCESS] Business settings refreshed.');
    } else {
      console.log('[INFO] Creating initial business settings document...');
      await BusinessSettings.create(defaultSettings);
      console.log('[SUCCESS] Initial business settings seeded.');
    }

    console.log('\n--- 2. Seeding Website Content ---');
    const existingContent = await WebsiteContent.findOne({ key: 'default' });
    if (existingContent && !force) {
      console.log(`[INFO] Website content already exists (Owner: ${existingContent.owner.name}, Designation: ${existingContent.owner.designation}).`);
    } else if (existingContent && force) {
      console.log('[WARN] --force flag detected. Updating website content to defaults...');
      Object.assign(existingContent, defaultContent);
      await existingContent.save();
      console.log('[SUCCESS] Website content refreshed.');
    } else {
      console.log('[INFO] Creating initial website content document...');
      await WebsiteContent.create(defaultContent);
      console.log('[SUCCESS] Initial website content seeded.');
    }

    console.log('\n=== CURRENT ATLAS STATE ===');
    const finalSettings = await BusinessSettings.findOne({ key: 'default' });
    const finalContent = await WebsiteContent.findOne({ key: 'default' });
    console.log(`Phone:            ${finalSettings.displayPhone}`);
    console.log(`WhatsApp:         ${finalSettings.whatsapp}`);
    console.log(`Email:            ${finalSettings.email}`);
    console.log(`Owner:            ${finalContent.owner.name} (${finalContent.owner.designation}) - ${finalContent.owner.experience}`);
    console.log(`Why Choose Us:    ${finalContent.whyChooseUs.length} pillars`);
    console.log(`Statistics:       ${finalContent.statistics.length} metrics`);
    console.log('===========================\n');

    await mongoose.disconnect();
    console.log('Database disconnected cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Seeding failed:', error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

seedSettingsAndContent();

