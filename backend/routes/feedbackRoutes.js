/**
 * ==============================================================================
 * PUBLIC FEEDBACK REST ROUTES (backend/routes/feedbackRoutes.js)
 * ==============================================================================
 * Endpoints:
 * - POST /api/feedback -> Submit customer feedback (status: Pending)
 * - GET  /api/feedback -> Get approved customer reviews
 * ==============================================================================
 */

import express from 'express';
import { submitFeedback, getApprovedFeedback } from '../controllers/feedbackController.js';

const router = express.Router();

router.route('/')
  .post(submitFeedback)
  .get(getApprovedFeedback);

export default router;

