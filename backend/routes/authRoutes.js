/**
 * ==============================================================================
 * AUTHENTICATION ROUTES (backend/routes/authRoutes.js)
 * ==============================================================================
 * Student / Developer Guide:
 * Maps URL paths under /api/auth to the corresponding controller functions.
 * ==============================================================================
 */

import express from 'express';
import { loginAdmin, logoutAdmin, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);

// Protected routes (require valid HttpOnly JWT cookie)
router.get('/me', protect, getMe);

export default router;

