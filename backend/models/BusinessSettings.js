/**
 * ==============================================================================
 * BUSINESS SETTINGS MONGOOSE MODEL (backend/models/BusinessSettings.js)
 * ==============================================================================
 * Student / Developer Guide:
 * Stores company contact numbers, WhatsApp configuration, corporate address,
 * and Google Maps embed URL as a singleton document in MongoDB Atlas.
 * 
 * Fields:
 * - key: Unique configuration key ('default')
 * - phone: Telephone number for tel: links
 * - displayPhone: Human-friendly phone formatting (e.g. +91 99231 76194)
 * - whatsapp: Digits-only WhatsApp number for wa.me links
 * - whatsappPrefilledMessage: Default chat greeting
 * - email: Business contact email
 * - address: Physical street address or primary address string
 * - cityState: Regional location (e.g. Pune, Maharashtra, India)
 * - googleMapsEmbedUrl: Google Maps iframe src URL
 * - locationSummary: Regional service area coverage description
 * ==============================================================================
 */

import mongoose from 'mongoose';

const businessSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'default',
      trim: true
    },
    // Primary telephone
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    displayPhone: {
      type: String,
      required: [true, 'Display phone number is required'],
      trim: true
    },
    // WhatsApp direct communication
    whatsapp: {
      type: String,
      required: [true, 'WhatsApp number is required'],
      trim: true
    },
    whatsappPrefilledMessage: {
      type: String,
      trim: true,
      default:
        'Hello Poona Pools Facilities, I am interested in your swimming pool services. Could you please share more details and arrange a consultation?'
    },
    // Electronic communication
    email: {
      type: String,
      required: [true, 'Business email is required'],
      trim: true,
      lowercase: true
    },
    // Physical location
    address: {
      type: String,
      trim: true,
      default: 'Pune, Maharashtra, India'
    },
    cityState: {
      type: String,
      trim: true,
      default: 'Pune, Maharashtra, India'
    },
    googleMapsEmbedUrl: {
      type: String,
      trim: true,
      default: ''
    },
    locationSummary: {
      type: String,
      trim: true,
      default: 'Serving Pune, Pimpri-Chinchwad, and surrounding regions in Maharashtra.'
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

const BusinessSettings = mongoose.model('BusinessSettings', businessSettingsSchema);

export default BusinessSettings;

