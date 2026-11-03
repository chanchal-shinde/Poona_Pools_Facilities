/**
 * ==============================================================================
 * WEBSITE CONTENT MONGOOSE MODEL (backend/models/WebsiteContent.js)
 * ==============================================================================
 * Student / Developer Guide:
 * Stores corporate identity, owner leadership credentials, mission/vision,
 * key company statistics, and Why Choose Us pillars as a singleton in MongoDB Atlas.
 * 
 * Strict Constraint:
 * Owner info strictly contains name, designation, and years of experience.
 * No photo or unnecessary biography is stored.
 * ==============================================================================
 */

import mongoose from 'mongoose';

const whyChooseUsItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Why Choose Us pillar title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Why Choose Us pillar description is required'],
      trim: true
    }
  },
  { _id: false }
);

const statisticItemSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: [true, 'Statistic label is required'],
      trim: true
    },
    value: {
      type: String,
      required: [true, 'Statistic value is required'],
      trim: true
    },
    suffix: {
      type: String,
      trim: true,
      default: ''
    },
    description: {
      type: String,
      trim: true,
      default: ''
    }
  },
  { _id: false }
);

const websiteContentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'default',
      trim: true
    },
    // Business Branding
    organizationName: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
      default: 'Poona Pools Facilities'
    },
    tagline: {
      type: String,
      trim: true,
      default: 'Professional Swimming Pool Construction, Filtration & Maintenance Solutions'
    },
    shortDescription: {
      type: String,
      trim: true,
      default:
        'From custom swimming pool engineering and reinforced construction to filtration and routine maintenance, Poona Pools Facilities provides tailored solutions designed around your space.'
    },
    // Leadership / Owner Credentials (strictly name, designation, experience)
    owner: {
      name: {
        type: String,
        required: [true, 'Owner name is required'],
        trim: true,
        default: 'Sunil Shinde'
      },
      designation: {
        type: String,
        required: [true, 'Owner designation is required'],
        trim: true,
        default: 'CEO'
      },
      experience: {
        type: String,
        required: [true, 'Owner experience is required'],
        trim: true,
        default: '12+ Years'
      }
    },
    establishedYear: {
      type: String,
      trim: true,
      default: '2017'
    },
    // Core Mission, Vision, and Commitment
    missionVision: {
      mission: {
        type: String,
        required: [true, 'Mission statement is required'],
        trim: true
      },
      vision: {
        type: String,
        required: [true, 'Vision statement is required'],
        trim: true
      },
      commitment: {
        type: String,
        required: [true, 'Commitment statement is required'],
        trim: true
      }
    },
    // Why Choose Us Pillars
    whyChooseUs: {
      type: [whyChooseUsItemSchema],
      default: []
    },
    // Company Key Statistics
    statistics: {
      type: [statisticItemSchema],
      default: []
    },
    lastUpdatedBy: {
      type: String,
      default: 'System Seed'
    }
  },
  {
    timestamps: true
  }
);

const WebsiteContent = mongoose.model('WebsiteContent', websiteContentSchema);

export default WebsiteContent;

