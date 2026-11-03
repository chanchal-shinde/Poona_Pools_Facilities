/**
 * ==============================================================================
 * PUBLIC REST API ROUTES (backend/routes/publicRoutes.js)
 * ==============================================================================
 * Student / Developer Guide:
 * Defines unauthenticated public endpoints consumed by the customer website.
 * 
 * In Phase 4A:
 * - GET /api/public/services -> Returns all active swimming pool services
 * ==============================================================================
 */

import express from 'express';
import { getPublicServices } from '../controllers/serviceController.js';
import { getPublicCategories } from '../controllers/poolCategoryController.js';
import { getPublicDesigns } from '../controllers/poolDesignController.js';
import { getPublicPricing } from '../controllers/pricingController.js';
import { getPublicSettings } from '../controllers/settingsController.js';
import { getPublicContent } from '../controllers/contentController.js';
import { createInquiry } from '../controllers/inquiryController.js';

const router = express.Router();

// Public services catalog
router.get('/services', getPublicServices);

// Public swimming pools catalog (categories & designs)
router.get('/pool-categories', getPublicCategories);
router.get('/pool-designs', getPublicDesigns);

// Public cost estimator pricing rules
router.get('/pricing', getPublicPricing);

// Public business contact settings & website content
router.get('/settings', getPublicSettings);
router.get('/content', getPublicContent);

// Public quote inquiry submission (Phase 5)
router.post('/inquiries', createInquiry);

export default router;

