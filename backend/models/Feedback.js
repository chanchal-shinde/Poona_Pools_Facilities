/**
 * ==============================================================================
 * CUSTOMER FEEDBACK MODEL (backend/models/Feedback.js)
 * ==============================================================================
 * Student / Developer Guide:
 * Defines the Mongoose schema for customer reviews & feedback.
 * 
 * Key Characteristics:
 * - Completely unauthenticated public submission: no passwords or accounts required.
 * - Workflow Status:
 *   - 'Pending'  : Default status upon submission; not visible publicly.
 *   - 'Reviewed' : Admin inspected the feedback; still not visible publicly.
 *   - 'Approved' : Approved by admin; displayed on public website reviews section.
 *   - 'Rejected' : Inappropriate, spam, or discarded; hidden from public website.
 * - Validation:
 *   - Rating bounded between 1 and 5 stars.
 *   - Customer name required (max 80 chars).
 *   - Feedback message required (max 1000 chars).
 *   - Optional email format validation.
 * ==============================================================================
 */

import mongoose from 'mongoose';

const VALID_SERVICES = [
  'Swimming Pool Construction',
  'Pool Maintenance',
  'Pool Renovation',
  'Other'
];

const VALID_STATUSES = ['Pending', 'Reviewed', 'Approved', 'Rejected'];

const feedbackSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required.'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long.'],
      maxlength: [80, 'Name cannot exceed 80 characters.']
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
      match: [
        /^$|^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address.'
      ]
    },
    serviceType: {
      type: String,
      required: [true, 'Please select the service received.'],
      enum: {
        values: VALID_SERVICES,
        message: 'Invalid service type selected.'
      },
      default: 'Swimming Pool Construction'
    },
    rating: {
      type: Number,
      required: [true, 'Star rating is required.'],
      min: [1, 'Rating must be at least 1 star.'],
      max: [5, 'Rating cannot exceed 5 stars.'],
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be a whole integer between 1 and 5.'
      }
    },
    message: {
      type: String,
      required: [true, 'Feedback message is required.'],
      trim: true,
      minlength: [5, 'Feedback message must be at least 5 characters long.'],
      maxlength: [1000, 'Feedback message cannot exceed 1000 characters.']
    },
    status: {
      type: String,
      enum: {
        values: VALID_STATUSES,
        message: 'Status must be one of: Pending, Reviewed, Approved, Rejected.'
      },
      default: 'Pending',
      index: true
    },
    adminNotes: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Admin notes cannot exceed 500 characters.']
    }
  },
  {
    timestamps: true // Automatically creates createdAt and updatedAt
  }
);

// Indexes for fast public and administrative filtering
feedbackSchema.index({ status: 1, createdAt: -1 });
feedbackSchema.index({ createdAt: -1 });

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;

