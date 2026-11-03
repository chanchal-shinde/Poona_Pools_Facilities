/**
 * ==============================================================================
 * AUTHENTICATION MIDDLEWARE (backend/middleware/authMiddleware.js)
 * ==============================================================================
 * Student / Developer Guide:
 * This middleware guards protected routes (/api/admin/*, /api/auth/me).
 * 
 * How it works:
 * 1. Checks for the JWT stored in the HttpOnly 'token' cookie (or Bearer header).
 * 2. Verifies the token's cryptographic signature using JWT_SECRET.
 * 3. Retrieves the admin user from MongoDB (excluding their password hash).
 * 4. Attaches the admin user to the request object (`req.admin`).
 * 5. If verification fails or token is missing, rejects with HTTP 401 Unauthorized.
 * ==============================================================================
 */

import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

/**
 * Protects routes by validating the admin's JWT session.
 */
export async function protect(req, res, next) {
  let token;

  // 1. Primary source: HttpOnly cookie named 'token'
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Secondary fallback: Authorization header (Bearer <token>)
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token is provided, reject immediately
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please log in as an administrator to continue.'
    });
  }

  try {
    // Verify the JWT signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the admin record from the database (exclude password hash)
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Administrator account no longer exists.'
      });
    }

    // Attach admin info to request for use in controllers
    req.admin = admin;
    next();
  } catch (error) {
    // Differentiate between expired token and invalid token
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Your session has expired. Please log in again.'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid session token. Authentication failed.'
    });
  }
}

