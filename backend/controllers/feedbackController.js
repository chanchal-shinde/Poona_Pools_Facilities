/**
 * ==============================================================================
 * CUSTOMER FEEDBACK CONTROLLER (backend/controllers/feedbackController.js)
 * ==============================================================================
 * Student / Developer Guide:
 * Handles public feedback submission, public approved reviews retrieval,
 * and administrative review/moderation workflows.
 * 
 * Public Endpoints:
 * - POST /api/feedback        -> Submit feedback (status: Pending)
 * - GET  /api/feedback        -> Fetch only Approved feedback for public website
 * 
 * Protected Admin Endpoints:
 * - GET    /api/admin/feedback     -> Fetch all feedback with filter and stats
 * - PUT    /api/admin/feedback/:id -> Update feedback status (Approved, Rejected, etc.)
 * - DELETE /api/admin/feedback/:id -> Delete feedback record
 * ==============================================================================
 */

import Feedback from '../models/Feedback.js';

/**
 * Basic HTML sanitizer to strip dangerous script tags and brackets
 */
function sanitizeText(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '') // Strip angle brackets to prevent HTML/XSS
    .trim();
}

/**
 * @desc    Submit new customer feedback from public website
 * @route   POST /api/feedback (or /api/public/feedback)
 * @access  Public (No login required)
 */
export async function submitFeedback(req, res) {
  try {
    const { customerName, email, serviceType, rating, message } = req.body;

    // 1. Validation: Customer Name
    const cleanName = sanitizeText(customerName);
    if (!cleanName || cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your name (at least 2 characters).'
      });
    }
    if (cleanName.length > 80) {
      return res.status(400).json({
        success: false,
        message: 'Name cannot exceed 80 characters.'
      });
    }

    // 2. Validation: Email (Optional)
    let cleanEmail = '';
    if (email && email.trim()) {
      cleanEmail = email.trim().toLowerCase();
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(cleanEmail)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address.'
        });
      }
    }

    // 3. Validation: Service Type
    const validServices = [
      'Swimming Pool Construction',
      'Pool Maintenance',
      'Pool Renovation',
      'Other'
    ];
    const selectedService = (serviceType || '').trim();
    if (!validServices.includes(selectedService)) {
      return res.status(400).json({
        success: false,
        message: 'Please select a valid service received.'
      });
    }

    // 4. Validation: Rating (Integer between 1 and 5)
    const numRating = Number(rating);
    if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a star rating between 1 and 5.'
      });
    }

    // 5. Validation: Message
    const cleanMessage = sanitizeText(message);
    if (!cleanMessage || cleanMessage.length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Feedback message must be at least 5 characters long.'
      });
    }
    if (cleanMessage.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Feedback message cannot exceed 1000 characters.'
      });
    }

    // 6. Spam / Duplicate Submission Prevention (60-second window for identical message)
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentDuplicate = await Feedback.findOne({
      customerName: cleanName,
      message: cleanMessage,
      createdAt: { $gte: oneMinuteAgo }
    });

    if (recentDuplicate) {
      return res.status(200).json({
        success: true,
        isDuplicate: true,
        message: 'Thank you for sharing your feedback! Your response has been submitted successfully.',
        data: recentDuplicate
      });
    }

    // 7. Create Feedback Document with status 'Pending'
    const feedback = new Feedback({
      customerName: cleanName,
      email: cleanEmail,
      serviceType: selectedService,
      rating: numRating,
      message: cleanMessage,
      status: 'Pending'
    });

    const saved = await feedback.save();

    res.status(201).json({
      success: true,
      message: 'Thank you for sharing your feedback! Your response has been submitted successfully.',
      data: {
        _id: saved._id,
        customerName: saved.customerName,
        serviceType: saved.serviceType,
        rating: saved.rating,
        createdAt: saved.createdAt
      }
    });
  } catch (error) {
    console.error('Error submitting customer feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback. Please try again.',
      error: error.message
    });
  }
}

/**
 * @desc    Get approved customer feedback for public website
 * @route   GET /api/feedback (or /api/public/feedback)
 * @access  Public
 */
export async function getApprovedFeedback(req, res) {
  try {
    // Only return status === 'Approved'
    const reviews = await Feedback.find({ status: 'Approved' })
      .select('customerName serviceType rating message createdAt')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching approved feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load customer reviews.',
      error: error.message
    });
  }
}

/**
 * @desc    Get all feedback for admin dashboard with filtering and stats
 * @route   GET /api/admin/feedback
 * @access  Private (Admin only)
 */
export async function getAdminFeedback(req, res) {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;

    const query = {};

    // Filter by status if specified and not 'All'
    if (status && status !== 'All' && status !== 'all') {
      query.status = status;
    }

    // Search by customer name, email, or message
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { customerName: regex },
        { email: regex },
        { serviceType: regex },
        { message: regex }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const feedbackList = await Feedback.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum);
    const totalFiltered = await Feedback.countDocuments(query);
    const totalCount = await Feedback.countDocuments();
    const pendingCount = await Feedback.countDocuments({ status: 'Pending' });
    const reviewedCount = await Feedback.countDocuments({ status: 'Reviewed' });
    const approvedCount = await Feedback.countDocuments({ status: 'Approved' });
    const rejectedCount = await Feedback.countDocuments({ status: 'Rejected' });

    // Format status counts breakdown
    const stats = {
      total: totalCount,
      pending: pendingCount,
      reviewed: reviewedCount,
      approved: approvedCount,
      rejected: rejectedCount
    };

    res.status(200).json({
      success: true,
      count: feedbackList.length,
      total: totalFiltered,
      page: pageNum,
      totalPages: Math.ceil(totalFiltered / limitNum),
      stats,
      data: feedbackList
    });
  } catch (error) {
    console.error('Error fetching admin feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve feedback records.',
      error: error.message
    });
  }
}

/**
 * @desc    Update feedback status (Approved, Reviewed, Rejected)
 * @route   PUT /api/admin/feedback/:id
 * @access  Private (Admin only)
 */
export async function updateFeedbackStatus(req, res) {
  try {
    const { status, adminNotes } = req.body;
    const allowed = ['Pending', 'Reviewed', 'Approved', 'Rejected'];

    if (!status || !allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowed.join(', ')}`
      });
    }

    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback record not found.'
      });
    }

    feedback.status = status;
    if (adminNotes !== undefined) {
      feedback.adminNotes = sanitizeText(adminNotes);
    }

    const updated = await feedback.save();

    res.status(200).json({
      success: true,
      message: `Feedback status successfully updated to "${status}".`,
      data: updated
    });
  } catch (error) {
    console.error('Error updating feedback status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update feedback status.',
      error: error.message
    });
  }
}

/**
 * @desc    Delete feedback permanently
 * @route   DELETE /api/admin/feedback/:id
 * @access  Private (Admin only)
 */
export async function deleteFeedback(req, res) {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback record not found.'
      });
    }

    await feedback.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Feedback record deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete feedback record.',
      error: error.message
    });
  }
}

