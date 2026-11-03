/**
 * ==============================================================================
 * POOL DESIGN MONGOOSE MODEL (backend/models/PoolDesign.js)
 * ==============================================================================
 * Student / Developer Guide:
 * Defines individual swimming pool showcase concepts and completed designs.
 * 
 * Relationships:
 * - `category`: MongoDB ObjectId reference to `PoolCategory`.
 * 
 * Fields match the existing structure in `src/data/pools.js`:
 * - designId: Unique slug (e.g. 'residential-pool-1')
 * - title: Design name (e.g. 'Modern Residential Villa Pool')
 * - category: Reference to parent PoolCategory
 * - categorySlug: Cached category slug for client filtering
 * - categoryLabel: Human-readable category pill label
 * - image: Public photo path (e.g. '/images/hero-pool-1.jpg')
 * - description: Detailed architectural description
 * - specifications: Array of technical bullet points (shell type, finish, filtration)
 * - dimensions: Optional plot dimensions / measurements
 * - inquiryMessage: Prefilled WhatsApp consultation text
 * - isDisclaimerNotice: Whether to show a technical feasibility disclaimer
 * - disclaimerText: Notice text for modular/movable pool variants
 * - isActive: Boolean flag
 * - order: Display order
 * ==============================================================================
 */

import mongoose from 'mongoose';

const poolDesignSchema = new mongoose.Schema(
  {
    designId: {
      type: String,
      required: [true, 'Design identifier / slug is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    title: {
      type: String,
      required: [true, 'Design title is required'],
      trim: true,
      unique: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PoolCategory',
      required: [true, 'Parent pool category is required']
    },
    categorySlug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    categoryLabel: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      required: [true, 'Image path is required'],
      default: '/images/hero-pool-1.jpg',
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    specifications: {
      type: [String],
      default: []
    },
    dimensions: {
      type: String,
      trim: true,
      default: ''
    },
    inquiryMessage: {
      type: String,
      trim: true
    },
    isDisclaimerNotice: {
      type: Boolean,
      default: false
    },
    disclaimerText: {
      type: String,
      trim: true,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Indexes for public gallery querying
poolDesignSchema.index({ isActive: 1, categorySlug: 1, order: 1 });

const PoolDesign = mongoose.model('PoolDesign', poolDesignSchema);

export default PoolDesign;

