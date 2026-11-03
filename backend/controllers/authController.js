/**
 * ==============================================================================
 * AUTHENTICATION CONTROLLER (backend/controllers/authController.js)
 * ==============================================================================
 * Student / Developer Guide:
 * Contains the request handling logic for:
 * - Admin Login (POST /api/auth/login)
 * - Admin Logout (POST /api/auth/logout)
 * - Get Current Admin (GET /api/auth/me)
 * ==============================================================================
 */

import Admin from '../models/Admin.js';
import { generateToken, setAuthCookie, clearAuthCookie } from '../utils/generateToken.js';

/**
 * @desc    Authenticate admin & set HttpOnly cookie
 * @route   POST /api/auth/login
 * @access  Public
 */
export async function loginAdmin(req, res) {
  const { email, password } = req.body;

  // 1. Validate required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email and password.'
    });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();

    // 2. Find admin by email
    const admin = await Admin.findOne({ email: normalizedEmail });

    // 3. Verify admin exists and password matches
    if (!admin || !(await admin.matchPassword(password))) {
      // Use generic error message to prevent user enumeration attacks
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // 4. Update last login timestamp
    admin.lastLogin = new Date();
    await admin.save();

    // 5. Generate signed JWT token
    const token = generateToken(admin);

    // 6. Set HttpOnly cookie
    setAuthCookie(res, token);

    // 7. Return safe admin profile (without password hash)
    res.status(200).json({
      success: true,
      message: 'Login successful. Welcome back!',
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error) {
    console.error('❌ [Login Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred during login. Please try again.'
    });
  }
}

/**
 * @desc    Logout admin & clear authentication cookie
 * @route   POST /api/auth/logout
 * @access  Public
 */
export async function logoutAdmin(req, res) {
  try {
    // Clear the HttpOnly session cookie
    clearAuthCookie(res);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully.'
    });
  } catch (error) {
    console.error('❌ [Logout Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to complete logout. Please try again.'
    });
  }
}

/**
 * @desc    Get profile of currently authenticated admin
 * @route   GET /api/auth/me
 * @access  Protected (Requires valid JWT session)
 */
export async function getMe(req, res) {
  try {
    // req.admin was populated by the protect middleware
    res.status(200).json({
      success: true,
      admin: req.admin
    });
  } catch (error) {
    console.error('❌ [GetMe Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile.'
    });
  }
}

