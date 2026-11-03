/**
 * ==============================================================================
 * JWT TOKEN & COOKIE HELPER (backend/utils/generateToken.js)
 * ==============================================================================
 * Student / Developer Guide:
 * This utility handles signing JSON Web Tokens (JWT) and attaching/clearing
 * them in secure HttpOnly cookies.
 * 
 * Why HttpOnly Cookies?
 * - If a JWT is stored in localStorage or React state, any malicious script (XSS)
 *   running on the browser can steal it.
 * - An HttpOnly cookie cannot be read by JavaScript (`document.cookie`), which
 *   protects the admin session from client-side token theft.
 * ==============================================================================
 */

import jwt from 'jsonwebtoken';

/**
 * Generates a signed JWT for the authenticated admin.
 * @param {object} admin - Admin Mongoose document or object
 * @returns {string} Signed JWT token
 */
export function generateToken(admin) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not configured in backend/.env file.');
  }

  // Token payload contains only non-sensitive identifying data
  return jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      role: admin.role
    },
    secret,
    {
      expiresIn: '7d' // Valid for 7 days
    }
  );
}

/**
 * Attaches the JWT to the HTTP response as a secure HttpOnly cookie.
 * @param {object} res - Express response object
 * @param {string} token - Signed JWT string
 */
export function setAuthCookie(res, token) {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('token', token, {
    httpOnly: true, // Prevents JavaScript from reading the cookie
    secure: isProduction, // HTTPS required in production; allowed over HTTP on localhost
    sameSite: isProduction ? 'none' : 'lax', // 'none' needed for cross-domain Vercel->Render in prod; 'lax' in dev
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: '/' // Available for all routes
  });
}

/**
 * Clears the authentication cookie on logout.
 * @param {object} res - Express response object
 */
export function clearAuthCookie(res) {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('token', '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 0,
    expires: new Date(0), // Set to past date to immediately invalidate
    path: '/'
  });
}

