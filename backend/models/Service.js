/**
 * ==============================================================================
 * SERVICE MONGOOSE MODEL (backend/models/Service.js)
 * ==============================================================================
 * Student / Developer Guide:
 * This model defines the database schema for all swimming pool services
 * offered by Poona Pools Facilities.
 * 
 * Fields map directly to the existing static services data structure in
 * `src/data/services.js`:
 * - serviceId: Unique URL-friendly slug (e.g. 'pool-construction')
 * - title: Display name of the service
 * - shortDescription: Brief summary shown on cards & homepage preview
 * - fullDescription: Comprehensive explanation for the detailed Services page
 * - image: Public image path (e.g. '/images/pool-construction.jpg')
 * - icon: Semantic identifier for SVG icon rendering
 * - keyPoints: Array of bullet points highlighting service deliverables
 * - inquiryMessage: Prefilled text sent when a customer inquires via WhatsApp
 * - isActive: Controls visibility on the public website (true/false)
 * - order: Sort order for catalog presentation
 * ==============================================================================
 */

import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    serviceId: {
      type: String,
      required: [true, 'Service identifier / slug is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
      unique: true
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true
    },
    fullDescription: {
      type: String,
      required: [true, 'Full detailed description is required'],
      trim: true
    },
    image: {
      type: String,
      required: [true, 'Image path is required'],
      default: '/images/pool-construction.jpg',
      trim: true
    },
    icon: {
      type: String,
      enum: ['hammer', 'water-sparkle', 'filter', 'refresh', 'shield', 'gear', 'sparkles'],
      default: 'hammer'
    },
    keyPoints: {
      type: [String],
      default: []
    },
    inquiryMessage: {
      type: String,
      trim: true
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

// Index to ensure efficient public querying of active services
serviceSchema.index({ isActive: 1, order: 1 });

const Service = mongoose.model('Service', serviceSchema);

export default Service;

