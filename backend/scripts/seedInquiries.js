/**
 * ==============================================================================
 * INQUIRIES SEED SCRIPT (backend/scripts/seedInquiries.js)
 * ==============================================================================
 * Student / Developer Guide:
 * Seeds realistic customer quote inquiries into MongoDB Atlas for testing the
 * inquiry management workflow and dashboard statistics.
 * 
 * Safety:
 * - Checks if inquiries already exist.
 * - Only seeds if collection is empty (or if --force is used).
 * 
 * Usage:
 *   node backend/scripts/seedInquiries.js
 *   node backend/scripts/seedInquiries.js --force
 * ==============================================================================
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Inquiry from '../models/Inquiry.js';
import { connectDB } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const sampleInquiries = [
  {
    customerName: 'Aditya Deshmukh',
    phone: '+91 98220 12345',
    email: 'aditya.deshmukh@gmail.com',
    location: 'Baner, Pune',
    poolType: 'Residential',
    service: 'Swimming Pool Construction',
    dimensions: {
      length: 12,
      width: 6,
      depth: 1.5,
      unit: 'meters'
    },
    budget: '₹ 20 - 25 Lakhs',
    message: 'We are constructing a new private villa in Baner and need turnkey swimming pool civil construction and filtration.',
    status: 'New',
    adminNotes: [
      {
        text: 'Initial inquiry received via website quote form.',
        author: 'System',
        createdAt: new Date(Date.now() - 3 * 3600 * 1000)
      }
    ]
  },
  {
    customerName: 'Priya Kulkarni',
    phone: '+91 98500 54321',
    email: 'priya.kulkarni@yahoo.com',
    location: 'Koregaon Park, Pune',
    poolType: 'Infinity Pool',
    service: 'Filtration and Circulation Systems',
    dimensions: {
      length: 10,
      width: 4.5,
      depth: 1.4,
      unit: 'meters'
    },
    budget: '₹ 15 - 20 Lakhs',
    message: 'Existing infinity pool requires upgraded filtration sand plant and multi-port valve overhaul.',
    status: 'In Progress',
    adminNotes: [
      {
        text: 'Contacted customer on WhatsApp. Scheduled physical site inspection for Thursday.',
        author: 'Sunil Shinde (CEO)',
        createdAt: new Date(Date.now() - 24 * 3600 * 1000)
      }
    ]
  },
  {
    customerName: 'Vikram Joshi (Society Secretary)',
    phone: '+91 94220 98765',
    email: 'secretariat.greens@outlook.com',
    location: 'Wakad, Pune',
    poolType: 'Commercial',
    service: 'Swimming Pool Maintenance',
    dimensions: {
      length: 25,
      width: 12,
      depth: 1.8,
      unit: 'meters'
    },
    budget: 'Annual Maintenance Contract (AMC)',
    message: 'Semi-Olympic society pool requires annual routine maintenance, water chemical testing, and vacuum cleaning contract.',
    status: 'Completed',
    adminNotes: [
      {
        text: 'Commercial AMC contract finalized and signed for 12 months.',
        author: 'Admin',
        createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000)
      }
    ]
  }
];

async function seedInquiries() {
  const force = process.argv.includes('--force');

  try {
    console.log('Connecting to MongoDB Atlas...');
    const conn = await connectDB();
    if (!conn) {
      throw new Error('Database connection could not be established.');
    }

    const count = await Inquiry.countDocuments();
    if (count > 0 && !force) {
      console.log(`[INFO] Inquiry collection already contains ${count} inquiries. Skipping seed.`);
      console.log('Use --force to insert sample inquiries anyway.');
      await mongoose.disconnect();
      process.exit(0);
    }

    console.log('Inserting sample inquiries into Atlas...');
    await Inquiry.insertMany(sampleInquiries);
    console.log(`[SUCCESS] Inserted ${sampleInquiries.length} sample inquiries.`);

    const newCount = await Inquiry.countDocuments();
    console.log(`Total inquiries now in Atlas: ${newCount}`);

    await mongoose.disconnect();
    console.log('Database disconnected cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Failed to seed inquiries:', error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

seedInquiries();

