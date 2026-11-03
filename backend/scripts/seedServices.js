/**
 * ==============================================================================
 * SERVICES SEED SCRIPT (backend/scripts/seedServices.js)
 * ==============================================================================
 * Student / Developer Guide:
 * Migrates existing static services from `src/data/services.js` into MongoDB Atlas.
 * 
 * Safety:
 * - Checks each service by `serviceId`.
 * - If already present, skips without overwriting custom modifications.
 * - If missing, inserts the authentic company service record.
 * 
 * Usage:
 *   node scripts/seedServices.js
 *   or: npm run seed:services
 * ==============================================================================
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Service from '../models/Service.js';
import { connectDB } from '../config/db.js';

dotenv.config();

const initialServices = [
  {
    serviceId: 'pool-construction',
    title: 'Swimming Pool Construction',
    shortDescription: 'Complete civil construction of durable residential and commercial swimming pools, from excavation and steel rebar framework to concrete casting and finishing.',
    fullDescription: 'We specialize in turnkey swimming pool construction engineered to suit your land topography and architectural vision. Our civil engineering team oversees soil testing, structural rebar reinforcement, high-strength shotcrete/gunite or RCC casting, tiling, and precision edge coping to ensure zero structural settlement and lifelong durability.',
    image: '/images/pool-construction.jpg',
    icon: 'hammer',
    keyPoints: [
      'Site inspection, land survey, and civil excavation',
      'High-grade steel rebar reinforcement & RCC shell casting',
      'Premium mosaic tile installation and anti-slip stone coping',
      'Integrated steps, shallow lounging ledges, and lighting conduits'
    ],
    inquiryMessage: 'Hello, I would like to inquire about Swimming Pool Construction services from Poona Pools Facilities.',
    isActive: true,
    order: 1
  },
  {
    serviceId: 'pool-maintenance',
    title: 'Swimming Pool Maintenance',
    shortDescription: 'Comprehensive pool cleaning, regular water testing, pH balancing, chemical sanitization, and scheduled equipment inspections.',
    fullDescription: 'Keep your pool crystal clear, hygienic, and safe for family and guests throughout the year. Our maintenance programs cover wall brushing, vacuuming, leaf skimming, chemical testing (pH, chlorine, alkalinity balance), filter backwashing, and preventative pump diagnostics to avert costly mechanical breakdowns.',
    image: '/images/pool-maintenance.jpg',
    icon: 'water-sparkle',
    keyPoints: [
      'Scheduled vacuuming, brushing, and surface skimming',
      'Precise water chemistry testing and sanitization balancing',
      'Filter backwashing, cartridge cleaning, and pressure checks',
      'Routine pump inspection and early leak detection'
    ],
    inquiryMessage: 'Hello, I would like to inquire about Swimming Pool Maintenance packages from Poona Pools Facilities.',
    isActive: true,
    order: 2
  },
  {
    serviceId: 'filtration-systems',
    title: 'Filtration and Circulation Systems',
    shortDescription: 'Modern circulation pumps, high-efficiency sand filters, cartridge filtration, and automated pipework for pristine, crystal-clear water.',
    fullDescription: 'Water circulation and filtration are the heart and lungs of any swimming pool facility. We design and install high-performance circulation systems using multi-port commercial sand filters, energy-saving variable speed pumps, and pressure-rated PVC piping that guarantee optimal turnover rates and minimize chemical consumption.',
    image: '/images/pool-filtration.jpg',
    icon: 'filter',
    keyPoints: [
      'Commercial-grade fiberglass sand filters & cartridge units',
      'Energy-efficient, low-noise circulation pumps',
      'Optimal hydraulic pipe routing for continuous circulation',
      'Multi-port valves, flow meters, and pressure gauges'
    ],
    inquiryMessage: 'Hello, I would like to consult with Poona Pools Facilities regarding Filtration and Circulation Systems.',
    isActive: true,
    order: 3
  },
  {
    serviceId: 'pool-renovation',
    title: 'Swimming Pool Renovation',
    shortDescription: 'Transforming aging or damaged pools with resurfacing, modern glass mosaic retiling, structural crack repairs, and coping upgrades.',
    fullDescription: 'Give your existing swimming pool a fresh, modern life. Our renovation services tackle aged plaster, chipped or discolored tiles, leaking plumbing lines, outdated deck finishes, and obsolete filtration equipment. We revitalize legacy pools into contemporary architectural centerpieces.',
    image: '/images/pool-renovation.jpg',
    icon: 'refresh',
    keyPoints: [
      'Mosaic retiling and contemporary interior resurfacing',
      'Structural crack stitch repair and pressure testing',
      'Deck remodeling, coping stone replacement, and modern ladders',
      'Filtration plant upgrades and LED underwater lighting retrofits'
    ],
    inquiryMessage: 'Hello, I would like to discuss a Swimming Pool Renovation project with Poona Pools Facilities.',
    isActive: true,
    order: 4
  },
  {
    serviceId: 'waterproofing',
    title: 'Pool Waterproofing Solutions',
    shortDescription: 'Advanced multi-layer elastomeric waterproofing membranes and crystalline coatings designed to permanently prevent pool leakage.',
    fullDescription: 'Waterproofing is the most critical stage in swimming pool longevity. We employ proven multi-layer waterproofing systems including crystalline barrier treatments, polymer-modified cementitious coatings, and joint sealants that resist hydrostatic pressure from both inside and outside the pool structure.',
    image: '/images/pool-waterproofing.jpg',
    icon: 'shield',
    keyPoints: [
      'Multi-coat polymer cementitious waterproofing membranes',
      'Hydrophilic water-stop bars installed at construction joints',
      'Puddle flange sealing around all pipe penetrations and inlets',
      'Rigorous 72-hour hydrostatic ponding test prior to tile tiling'
    ],
    inquiryMessage: 'Hello, I would like to inquire about Swimming Pool Waterproofing services from Poona Pools Facilities.',
    isActive: true,
    order: 5
  },
  {
    serviceId: 'pool-equipment',
    title: 'Pool Equipment and Accessories',
    shortDescription: 'Premium pool pumps, underwater LED lighting, automated robotic vacuum cleaners, skimmers, ladders, and solar heating.',
    fullDescription: 'We supply and integrate trusted swimming pool equipment designed for reliability and ease of operation. From color-changing underwater LED illumination and robust stainless steel safety ladders to robotic pool cleaners and heating solutions, we equip your pool with long-lasting components.',
    image: '/images/pool-equipment.jpg',
    icon: 'gear',
    keyPoints: [
      'Submersible RGB and warm-white LED pool illumination',
      'Commercial grade AISI-304/316 stainless steel ladders and grab rails',
      'Robotic pool cleaners, manual vacuum heads, and telescopic poles',
      'ABS surface skimmers, main drains, and adjustable inlet nozzles'
    ],
    inquiryMessage: 'Hello, I am looking for Swimming Pool Equipment and Accessories from Poona Pools Facilities.',
    isActive: true,
    order: 6
  },
  {
    serviceId: 'custom-services',
    title: 'Custom Facility Consultation',
    shortDescription: 'Specialized aquatic solutions, custom water features, rooftop pools, water cascade walls, and bespoke technical projects.',
    fullDescription: 'Have unique architectural requirements such as a rooftop cantilever pool, custom water curtain, plunge pool, or commercial fitness center pool? Our technical team collaborates closely with architects, builders, and property owners to formulate viable engineering solutions.',
    image: '/images/custom-pool.jpg',
    icon: 'sparkles',
    keyPoints: [
      'Feasibility analysis for rooftop and elevated pools',
      'Decorative water sheer descents and illuminated sheet waterfalls',
      'Commercial aquatic center consultation and flow rate sizing',
      'Preventative audit of existing commercial and residential pools'
    ],
    inquiryMessage: 'Hello, I would like to discuss a Custom Swimming Pool Consultation with Poona Pools Facilities.',
    isActive: true,
    order: 7
  }
];

async function seedServices() {
  console.log('\n--- Seeding Initial Services to MongoDB Atlas ---');

  const conn = await connectDB();
  if (!conn) {
    console.error('❌ Could not connect to Atlas. Check backend/.env');
    process.exit(1);
  }

  try {
    let inserted = 0;
    let existing = 0;

    for (const srv of initialServices) {
      const found = await Service.findOne({ serviceId: srv.serviceId });
      if (found) {
        existing++;
        console.log(`ℹ️  Service already exists: "${srv.title}" (${srv.serviceId})`);
      } else {
        await Service.create(srv);
        inserted++;
        console.log(`✅ Inserted service: "${srv.title}" (${srv.serviceId})`);
      }
    }

    console.log(`\n🎉 Services seeding finished. Inserted: ${inserted}, Already existing: ${existing}`);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('📡 Database connection closed.\n');
    process.exit(0);
  }
}

seedServices();

