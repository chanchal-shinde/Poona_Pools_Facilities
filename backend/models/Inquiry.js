/**
 * ==============================================================================
 * CUSTOMER INQUIRY MONGOOSE MODEL (backend/models/Inquiry.js)
 * ==============================================================================
 * Student / Developer Guide:
 * Stores prospective client quotation requests and service inquiries.
 * 
 * Fields:
 * - customerName: Full name of the client
 * - phone: Contact phone number (validated)
 * - email: Optional customer email address
 * - location: Project site location in Pune or surrounding areas
 * - poolType: Selected pool architecture (Residential, Commercial, Infinity)
 * - service: Requested core service
 * - dimensions: Approximate length, width, depth, and unit (m or ft)
 * - budget: Optional budgetary range
 * - message: Optional custom message / site description
 * - status: Workflow stage ('New', 'In Progress', 'Contacted', 'Completed', 'Archived')
 * - adminNotes: Array of timestamped administrative follow-up notes
 * - submissionSource: Tracking origin (e.g. 'Website Quote Form')
 * ==============================================================================
 */

import mongoose from 'mongoose';

const adminNoteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Note text is required'],
      trim: true
    },
    author: {
      type: String,
      default: 'Admin',
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const inquirySchema = new mongoose.Schema(
  {
    // Customer Contact Details
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      minlength: [2, 'Customer name must be at least 2 characters long']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    location: {
      type: String,
      required: [true, 'Project location is required'],
      trim: true
    },

    // Pool Project Requirements
    poolType: {
      type: String,
      trim: true,
      default: 'Residential'
    },
    service: {
      type: String,
      trim: true,
      default: 'Swimming Pool Construction'
    },
    dimensions: {
      length: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      depth: { type: Number, default: 0 },
      unit: { type: String, enum: ['meters', 'feet'], default: 'meters' }
    },
    budget: {
      type: String,
      trim: true,
      default: ''
    },
    message: {
      type: String,
      trim: true,
      default: ''
    },

    // Administrative Workflow
    status: {
      type: String,
      enum: ['New', 'In Progress', 'Contacted', 'Completed', 'Archived'],
      default: 'New',
      index: true
    },
    adminNotes: {
      type: [adminNoteSchema],
      default: []
    },
    submissionSource: {
      type: String,
      default: 'Website Quote Form'
    }
  },
  {
    timestamps: true
  }
);

// Compound index for fast filtering by status and sorting by creation date
inquirySchema.index({ status: 1, createdAt: -1 });
inquirySchema.index({ phone: 1, createdAt: -1 });

const Inquiry = mongoose.model('Inquiry', inquirySchema);

export default Inquiry;

