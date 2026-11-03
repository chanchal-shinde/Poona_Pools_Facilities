/**
 * ==============================================================================
 * POOL CATEGORIES & DESIGNS SEED SCRIPT (backend/scripts/seedPools.js)
 * ==============================================================================
 * Student / Developer Guide:
 * Migrates existing pool categories and designs from `src/data/pools.js`
 * into MongoDB Atlas.
 * 
 * Safety:
 * - Creates categories first.
 * - Links each pool design to the newly created category document ObjectId.
 * - Skips existing records to prevent duplicates.
 * 
 * Usage:
 *   node scripts/seedPools.js
 *   or: npm run seed:pools
 * ==============================================================================
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import PoolCategory from '../models/PoolCategory.js';
import PoolDesign from '../models/PoolDesign.js';
import { connectDB } from '../config/db.js';

dotenv.config();

const initialCategories = [
  { categoryId: 'residential', label: 'Residential Pools', description: 'Private villa and family home swimming pools', order: 1 },
  { categoryId: 'luxury', label: 'Luxury & Infinity', description: 'Vanishing edge, overflow, and high-end resort pools', order: 2 },
  { categoryId: 'indoor-outdoor', label: 'Indoor & Outdoor', description: 'Enclosed climate-controlled and landscaped garden pools', order: 3 },
  { categoryId: 'commercial', label: 'Commercial Pools', description: 'Heavy bather load pools for hotels, clubs, and societies', order: 4 },
  { categoryId: 'custom-specialty', label: 'Custom & Portable', description: 'Bespoke geometric designs and modular pool alternatives', order: 5 }
];

const initialDesigns = [
  {
    designId: 'residential-pool-1',
    title: 'Modern Residential Villa Pool',
    categorySlug: 'residential',
    categoryLabel: 'Residential Swimming Pool',
    image: '/images/hero-pool-1.jpg',
    description: 'A private residential pool featuring integrated entry steps, natural stone decking, and crystal-clear turquoise water designed for family relaxation and private entertaining.',
    specifications: [
      'Type: In-ground Reinforced Concrete (RCC)',
      'Finish: Premium Porcelain Mosaic Tiles',
      'Filtration: High-rate Sand Filter & Energy-efficient Pump',
      'Lighting: Flush Submerged LED Lighting'
    ],
    inquiryMessage: 'Hello, I am inquiring about the Modern Residential Villa Pool design seen on your website.',
    isActive: true,
    order: 1
  },
  {
    designId: 'luxury-infinity-1',
    title: 'Architectural Infinity Edge Pool',
    categorySlug: 'luxury',
    categoryLabel: 'Infinity Swimming Pool',
    image: '/images/hero-pool-3.jpg',
    description: 'A scenic infinity edge pool creating an optical illusion where water merges seamlessly into the horizon. Features a concealed surge tank, perimeter drainage gutter, and ambient LED fixtures.',
    specifications: [
      'Type: Vanishing Edge Overflow System',
      'Feature: Concealed Balancing Surge Tank',
      'Coping: Custom Beveled Natural Granite',
      'Automation: Automated Water Level Leveling Controller'
    ],
    inquiryMessage: 'Hello, I would like more information regarding the Architectural Infinity Edge Pool design.',
    isActive: true,
    order: 2
  },
  {
    designId: 'indoor-pool-1',
    title: 'Climate-Controlled Indoor Lap Pool',
    categorySlug: 'indoor-outdoor',
    categoryLabel: 'Indoor Swimming Pool',
    image: '/images/hero-pool-2.jpg',
    description: 'Year-round indoor swimming facility designed with acoustic wooden ceiling slats, specialized dehumidification considerations, recessed underwater lighting, and low-chemical circulation.',
    specifications: [
      'Type: Enclosed Architectural Indoor Facility',
      'Water Care: Multi-layer Filtration & Low-Odor Sanitization',
      'Decking: Non-porous Anti-slip Polished Concrete / Tile',
      'Illumination: Linear Architectural Ceiling & Submerged Lights'
    ],
    inquiryMessage: 'Hello, I am interested in building or upgrading a Climate-Controlled Indoor Swimming Pool.',
    isActive: true,
    order: 3
  },
  {
    designId: 'luxury-pool-2',
    title: 'Luxury Estate Resort-Style Pool',
    categorySlug: 'luxury',
    categoryLabel: 'Luxury Swimming Pool',
    image: '/images/luxury-pool.jpg',
    description: 'Expansive private resort-style pool with integrated sun shelves (Baja shelf), dedicated shallow zones, lounge chair water ledges, and architectural water bubblers.',
    specifications: [
      'Type: Multi-tier Luxury Residential Facility',
      'Features: Shallow Sun Shelf & Integrated Spa Jet Nook',
      'Finish: Shimmering Iridescent Glass Mosaic',
      'Equipment: Dual-speed High Capacity Filtration Plant'
    ],
    inquiryMessage: 'Hello, I would like to consult about the Luxury Estate Resort-Style Pool solution.',
    isActive: true,
    order: 4
  },
  {
    designId: 'outdoor-pool-1',
    title: 'Outdoor Garden Courtyard Pool',
    categorySlug: 'indoor-outdoor',
    categoryLabel: 'Outdoor Swimming Pool',
    image: '/images/outdoor-pool.jpg',
    description: 'Harmoniously integrated into landscaped backyard gardens. Engineered with durable perimeter waterproofing and child-safe boundary planning.',
    specifications: [
      'Type: Outdoor Rectangular or Freeform Basin',
      'Decking: Slip-resistant Travertine Stone Pavers',
      'Safety: Shallow Step Entry & Grab Rails',
      'Cleaning: Suction Inlets for Automatic Pool Cleaners'
    ],
    inquiryMessage: 'Hello, I would like an estimate for an Outdoor Garden Courtyard Pool.',
    isActive: true,
    order: 5
  },
  {
    designId: 'commercial-pool-1',
    title: 'Commercial & Hospitality Pool Facility',
    categorySlug: 'commercial',
    categoryLabel: 'Commercial Swimming Pool',
    image: '/images/commercial-pool.jpg',
    description: 'High-capacity swimming pool engineered for hotels, fitness clubs, housing societies, and educational institutions with heavy bather loads and stringent hygiene regulations.',
    specifications: [
      'Type: Heavy Bather Load Commercial Pool',
      'Turnover: Rapid 4-6 Hour Complete Water Turnover Rate',
      'Plant Room: Commercial Blue Sand Filters & Dual Pumps',
      'Regulatory: Anti-entrapment Safety Drain Covers'
    ],
    inquiryMessage: 'Hello, I represent an organization and would like to consult regarding a Commercial Swimming Pool Facility.',
    isActive: true,
    order: 6
  },
  {
    designId: 'custom-pool-1',
    title: 'Custom Architectural Geometric Pool',
    categorySlug: 'custom-specialty',
    categoryLabel: 'Custom Swimming Pool Design',
    image: '/images/custom-pool.jpg',
    description: 'Custom-tailored pool designed to match challenging plot dimensions, split-level elevations, or unique landscape contours with bespoke spillways.',
    specifications: [
      'Type: Bespoke Civil Architectural Design',
      'Customization: Configurable Dimensions & Variable Depths',
      'Features: Integrated Water Cascade & Custom Seating',
      'Piping: Pressure-rated Heavy Gauge Schedule 40 PVC'
    ],
    inquiryMessage: 'Hello, I have custom project requirements for a Swimming Pool Design.',
    isActive: true,
    order: 7
  },
  {
    designId: 'movable-pool-1',
    title: 'Modular & Semi-Permanent Pool Solutions',
    categorySlug: 'custom-specialty',
    categoryLabel: 'Movable / Portable Pool Options',
    image: '/images/movable-pool.jpg',
    description: 'Above-ground modular structures and portable pool alternatives suitable for temporary installations or areas with civil excavation constraints. Note: Site feasibility review required.',
    isDisclaimerNotice: true,
    disclaimerText: 'Notice: Portable and movable pools differ fundamentally in structure and longevity from in-ground concrete pools. Installation viability and equipment compatibility are subject to direct site verification.',
    specifications: [
      'Type: Modular / Above-Ground Structural Frame',
      'Installation: Non-invasive, Minimal Civil Foundation',
      'Portability: Relocatable Framework Options',
      'Suitability: Subject to Site Assessment'
    ],
    inquiryMessage: 'Hello, I would like to inquire about Modular / Portable Pool alternatives and site feasibility.',
    isActive: true,
    order: 8
  }
];

async function seedPools() {
  console.log('\n--- Seeding Pool Categories and Designs to MongoDB Atlas ---');

  const conn = await connectDB();
  if (!conn) {
    console.error('❌ Could not connect to Atlas. Check backend/.env');
    process.exit(1);
  }

  try {
    // 1. Seed Categories
    const categoryMap = {}; // Maps categoryId -> Mongo Document

    for (const cat of initialCategories) {
      let doc = await PoolCategory.findOne({ categoryId: cat.categoryId });
      if (!doc) {
        doc = await PoolCategory.create(cat);
        console.log(`✅ Inserted PoolCategory: "${cat.label}" (${cat.categoryId})`);
      } else {
        console.log(`ℹ️  PoolCategory already exists: "${cat.label}"`);
      }
      categoryMap[cat.categoryId] = doc;
    }

    // 2. Seed Designs with Category Relationship
    for (const design of initialDesigns) {
      const parentCat = categoryMap[design.categorySlug];
      if (!parentCat) {
        console.warn(`⚠️  Skipping design ${design.title} because category ${design.categorySlug} was not found.`);
        continue;
      }

      const existingDesign = await PoolDesign.findOne({ designId: design.designId });
      if (!existingDesign) {
        await PoolDesign.create({
          ...design,
          category: parentCat._id,
          categoryLabel: parentCat.label
        });
        console.log(`✅ Inserted PoolDesign: "${design.title}" linked to category "${parentCat.label}"`);
      } else {
        console.log(`ℹ️  PoolDesign already exists: "${design.title}"`);
      }
    }

    console.log('\n🎉 Pool Categories & Designs seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('📡 Database connection closed.\n');
    process.exit(0);
  }
}

seedPools();

