/**
 * ==============================================================================
 * ONE-TIME ADMIN SEED SCRIPT (backend/scripts/seedAdmin.js)
 * ==============================================================================
 * Student / Developer Guide:
 * This script creates the initial administrative account in MongoDB Atlas.
 * 
 * Rules:
 * - Reads credentials strictly from backend/.env (ADMIN_EMAIL, ADMIN_PASSWORD).
 * - Never hardcodes real passwords in source code.
 * - Checks if an admin already exists to prevent duplicate creation.
 * - Password hashing is handled automatically by the Admin model's pre-save hook.
 * - Never prints the password or secrets in the console logs.
 * 
 * Usage:
 *   node scripts/seedAdmin.js
 *   or: npm run seed:admin
 * ==============================================================================
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import { connectDB } from '../config/db.js';

// Load environment variables from .env
dotenv.config();

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  console.log('\n--- Starting Initial Admin Seeding ---');

  // 1. Validate that environment variables are provided
  if (!email || !password) {
    console.error('❌ Error: ADMIN_EMAIL and ADMIN_PASSWORD must be defined in backend/.env.');
    process.exit(1);
  }

  if (password.length < 6) {
    console.error('❌ Error: ADMIN_PASSWORD must be at least 6 characters long.');
    process.exit(1);
  }

  // 2. Connect to MongoDB Atlas
  const conn = await connectDB();
  if (!conn) {
    console.error('❌ Error: Could not connect to MongoDB Atlas. Check your MONGODB_URI in backend/.env.');
    process.exit(1);
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();

    // 3. Check if an admin with this email already exists
    const existingAdmin = await Admin.findOne({ email: normalizedEmail });

    if (existingAdmin) {
      console.log(`ℹ️  Admin account already exists for: ${normalizedEmail}`);
      console.log('🔒 Duplicate creation prevented. No changes were made.');
    } else {
      // 4. Create the new admin account
      // Note: The pre-save hook in Admin.js automatically hashes the password with bcrypt
      await Admin.create({
        email: normalizedEmail,
        password: password,
        name: 'Poona Pools Administrator',
        role: 'admin'
      });

      console.log(`✅ Admin account created successfully for: ${normalizedEmail}`);
      console.log('🔒 Password securely hashed and saved in MongoDB Atlas.');
    }
  } catch (error) {
    console.error('❌ Seeding failed with error:', error.message);
  } finally {
    // 5. Cleanly disconnect from MongoDB
    await mongoose.connection.close();
    console.log('📡 Database connection closed.\n');
    process.exit(0);
  }
}

seedAdmin();

