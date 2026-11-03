/**
 * ==============================================================================
 * PROTECTED ADMIN API ROUTES (backend/routes/adminRoutes.js)
 * ==============================================================================
 * Student / Developer Guide:
 * Defines administrative endpoints protected by the `protect` JWT middleware.
 * 
 * In Phase 4A (Services Management):
 * - GET    /api/admin/services          -> List all services
 * - POST   /api/admin/services          -> Create new service
 * - GET    /api/admin/services/:id      -> Get single service
 * - PUT    /api/admin/services/:id      -> Update service
 * - PATCH  /api/admin/services/:id/toggle -> Activate/Deactivate service
 * - DELETE /api/admin/services/:id      -> Delete service
 * ==============================================================================
 */

import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getAdminServices,
  getServiceById,
  createService,
  updateService,
  toggleServiceStatus,
  deleteService
} from '../controllers/serviceController.js';
import {
  getAdminCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
  deleteCategory
} from '../controllers/poolCategoryController.js';
import {
  getAdminDesigns,
  getDesignById,
  createDesign,
  updateDesign,
  toggleDesignStatus,
  deleteDesign
} from '../controllers/poolDesignController.js';
import {
  getAdminPricing,
  updatePricing
} from '../controllers/pricingController.js';
import {
  getAdminSettings,
  updateSettings
} from '../controllers/settingsController.js';
import {
  getAdminContent,
  updateContent
} from '../controllers/contentController.js';
import {
  getAdminInquiries,
  getInquiryStats,
  getInquiryById,
  updateInquiryStatus,
  addAdminNote,
  deleteInquiry
} from '../controllers/inquiryController.js';
import {
  getAdminFeedback,
  updateFeedbackStatus,
  deleteFeedback
} from '../controllers/feedbackController.js';

const router = express.Router();

// Apply auth protection to all admin routes in this router
router.use(protect);

// ==============================================================================
// SERVICES MANAGEMENT (Module B)
// ==============================================================================
router.route('/services')
  .get(getAdminServices)
  .post(createService);

router.route('/services/:id')
  .get(getServiceById)
  .put(updateService)
  .delete(deleteService);

router.patch('/services/:id/toggle', toggleServiceStatus);

// ==============================================================================
// POOL CATEGORIES MANAGEMENT (Module C - Categories)
// ==============================================================================
router.route('/pool-categories')
  .get(getAdminCategories)
  .post(createCategory);

router.route('/pool-categories/:id')
  .get(getCategoryById)
  .put(updateCategory)
  .delete(deleteCategory);

router.patch('/pool-categories/:id/toggle', toggleCategoryStatus);

// ==============================================================================
// POOL DESIGNS MANAGEMENT (Module C - Designs)
// ==============================================================================
router.route('/pool-designs')
  .get(getAdminDesigns)
  .post(createDesign);

router.route('/pool-designs/:id')
  .get(getDesignById)
  .put(updateDesign)
  .delete(deleteDesign);

router.patch('/pool-designs/:id/toggle', toggleDesignStatus);

// ==============================================================================
// PRICING & ESTIMATOR MANAGEMENT (Module D)
// ==============================================================================
router.route('/pricing')
  .get(getAdminPricing)
  .put(updatePricing);

// ==============================================================================
// BUSINESS SETTINGS MANAGEMENT (Module F)
// ==============================================================================
router.route('/settings')
  .get(getAdminSettings)
  .put(updateSettings);

// ==============================================================================
// WEBSITE CONTENT MANAGEMENT (Module G)
// ==============================================================================
router.route('/content')
  .get(getAdminContent)
  .put(updateContent);

// ==============================================================================
// CUSTOMER INQUIRIES MANAGEMENT (Module E - Phase 5)
// ==============================================================================
router.get('/inquiries/stats', getInquiryStats);

router.route('/inquiries')
  .get(getAdminInquiries);

router.route('/inquiries/:id')
  .get(getInquiryById)
  .delete(deleteInquiry);

router.patch('/inquiries/:id/status', updateInquiryStatus);
router.post('/inquiries/:id/notes', addAdminNote);

// ==============================================================================
// CUSTOMER FEEDBACK MANAGEMENT (Reviews & Moderation)
// ==============================================================================
router.route('/feedback')
  .get(getAdminFeedback);

router.route('/feedback/:id')
  .put(updateFeedbackStatus)
  .delete(deleteFeedback);

export default router;

