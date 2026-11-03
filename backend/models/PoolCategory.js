/**
 * ==============================================================================
 * POOL CATEGORY MONGOOSE MODEL (backend/models/PoolCategory.js)
 * ==============================================================================
 * Student / Developer Guide:
 * Defines categories for swimming pools (e.g. Residential, Luxury & Infinity, etc.).
 * 
 * Fields:
 * - categoryId: Unique URL-friendly slug (e.g. 'residential', 'luxury')
 * - label: Display name shown on filter buttons and badges
 * - description: Optional descriptive text for the category
 * - isActive: Controls visibility on the public website (true/false)
 * - order: Numerical sorting order for navigation tabs
 * ==============================================================================
 */

import mongoose from 'mongoose';

const poolCategorySchema = new mongoose.Schema(
  {
    categoryId: {
      type: String,
      required: [true, 'Category identifier / slug is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    label: {
      type: String,
      required: [true, 'Category label / name is required'],
      trim: true,
      unique: true
    },
    description: {
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

// Index for efficient ordering and status lookup
poolCategorySchema.index({ isActive: 1, order: 1 });

const PoolCategory = mongoose.model('PoolCategory', poolCategorySchema);

export default PoolCategory;

