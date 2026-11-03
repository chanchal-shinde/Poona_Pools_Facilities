/**
 * ==============================================================================
 * ADMIN MONGOOSE MODEL (backend/models/Admin.js)
 * ==============================================================================
 * Student / Developer Guide:
 * This model defines the schema for administrative users.
 * 
 * Security features:
 * - Passwords are NEVER stored in plain text.
 * - Uses a Mongoose pre-save hook to hash the password with bcrypt before saving.
 * - Provides an instance method `matchPassword` to securely compare entered
 *   passwords with the stored hash using `bcrypt.compare`.
 * - Enforces unique, lowercase, trimmed email addresses.
 * ==============================================================================
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long']
    },
    name: {
      type: String,
      default: 'Administrator',
      trim: true
    },
    role: {
      type: String,
      enum: ['admin'],
      default: 'admin'
    },
    lastLogin: {
      type: Date
    }
  },
  {
    timestamps: true // Automatically creates createdAt and updatedAt fields
  }
);

/**
 * Pre-Save Middleware:
 * Automatically runs before saving an Admin document to MongoDB.
 * If the password field was modified (or is new), it generates a salt
 * and hashes the plain-text password using bcrypt.
 */
adminSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt with 10 rounds
    const salt = await bcrypt.genSalt(10);
    // Hash password with salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance Method: matchPassword
 * Compares an entered plain-text password with the stored hashed password.
 * @param {string} enteredPassword - The plain password entered by user at login
 * @returns {Promise<boolean>} True if match, false otherwise
 */
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;

