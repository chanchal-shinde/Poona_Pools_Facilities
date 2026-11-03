/**
 * ==============================================================================
 * INQUIRY CONTROLLER (backend/controllers/inquiryController.js)
 * ==============================================================================
 * Student / Developer Guide:
 * Manages customer quote submissions and administrative inquiry lifecycles.
 * 
 * Public Endpoint:
 * - POST   /api/public/inquiries        -> Customer creates inquiry with duplicate check
 * 
 * Protected Admin Endpoints:
 * - GET    /api/admin/inquiries         -> Paginated, searchable, filterable inquiry list
 * - GET    /api/admin/inquiries/stats   -> Summary counts and recent inquiries for dashboard
 * - GET    /api/admin/inquiries/:id     -> Single inquiry detail
 * - PATCH  /api/admin/inquiries/:id/status -> Status updater (New, In Progress, etc.)
 * - POST   /api/admin/inquiries/:id/notes  -> Append admin follow-up note
 * - DELETE /api/admin/inquiries/:id     -> Permanently delete inquiry
 * ==============================================================================
 */

import Inquiry from '../models/Inquiry.js';

/**
 * @desc    Submit a new customer inquiry from public Quote Form
 * @route   POST /api/public/inquiries
 * @access  Public
 */
export async function createInquiry(req, res) {
  try {
    const {
      customerName,
      phone,
      email,
      location,
      poolType,
      service,
      dimensions,
      length,
      width,
      depth,
      unit,
      budget,
      message,
      submissionSource
    } = req.body;

    // 1. Validation: Customer Name
    const cleanName = (customerName || '').trim();
    if (!cleanName || cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your full name (at least 2 characters).'
      });
    }

    // 2. Validation: Phone
    const cleanPhone = (phone || '').trim();
    const phoneDigits = cleanPhone.replace(/[^0-9]/g, '');
    if (!cleanPhone || phoneDigits.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid contact phone number (at least 10 digits).'
      });
    }

    // 3. Validation: Location
    const cleanLocation = (location || '').trim();
    if (!cleanLocation) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your project site location (e.g. Pune, Baner, Kothrud).'
      });
    }

    // 4. Duplicate Submission Protection (2-minute window)
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    const recentDuplicate = await Inquiry.findOne({
      phone: cleanPhone,
      createdAt: { $gte: twoMinutesAgo }
    });

    if (recentDuplicate) {
      return res.status(200).json({
        success: true,
        isDuplicate: true,
        message: 'Your inquiry has already been received! Our engineering team is currently reviewing your project details.',
        data: recentDuplicate
      });
    }

    // 5. Structure Dimensions Object
    const parsedLength = Number(dimensions?.length ?? length ?? 0);
    const parsedWidth = Number(dimensions?.width ?? width ?? 0);
    const parsedDepth = Number(dimensions?.depth ?? depth ?? 0);
    const parsedUnit = (dimensions?.unit ?? unit ?? 'meters') === 'feet' ? 'feet' : 'meters';

    const newInquiry = new Inquiry({
      customerName: cleanName,
      phone: cleanPhone,
      email: (email || '').trim().toLowerCase(),
      location: cleanLocation,
      poolType: (poolType || 'Residential').trim(),
      service: (service || 'Swimming Pool Construction').trim(),
      dimensions: {
        length: isNaN(parsedLength) ? 0 : parsedLength,
        width: isNaN(parsedWidth) ? 0 : parsedWidth,
        depth: isNaN(parsedDepth) ? 0 : parsedDepth,
        unit: parsedUnit
      },
      budget: (budget || '').trim(),
      message: (message || '').trim(),
      status: 'New',
      submissionSource: submissionSource || 'Website Quote Form'
    });

    const savedInquiry = await newInquiry.save();

    res.status(201).json({
      success: true,
      message: 'Thank you! Your quote request has been recorded. Our team will contact you shortly.',
      data: savedInquiry
    });
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process inquiry submission.',
      error: error.message
    });
  }
}

/**
 * @desc    Get all inquiries with search, filter, and pagination
 * @route   GET /api/admin/inquiries
 * @access  Private (Admin only)
 */
export async function getAdminInquiries(req, res) {
  try {
    const { status, search, page = 1, limit = 25, sort = '-createdAt' } = req.query;

    const query = {};

    // Status Filter (unless 'all')
    if (status && status !== 'all' && status !== 'All') {
      query.status = status;
    }

    // Search filter across name, phone, email, and location
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { customerName: regex },
        { phone: regex },
        { email: regex },
        { location: regex },
        { service: regex }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const inquiries = await Inquiry.find(query).sort(sort).skip(skip).limit(limitNum);
    const total = await Inquiry.countDocuments(query);

    res.status(200).json({
      success: true,
      count: inquiries.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: inquiries
    });
  } catch (error) {
    console.error('Error fetching admin inquiries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inquiries.',
      error: error.message
    });
  }
}

/**
 * @desc    Get overview inquiry statistics for admin dashboard
 * @route   GET /api/admin/inquiries/stats
 * @access  Private (Admin only)
 */
export async function getInquiryStats(req, res) {
  try {
    const total = await Inquiry.countDocuments();
    const newCount = await Inquiry.countDocuments({ status: 'New' });
    const inProgressCount = await Inquiry.countDocuments({ status: 'In Progress' });
    const contactedCount = await Inquiry.countDocuments({ status: 'Contacted' });
    const completedCount = await Inquiry.countDocuments({ status: 'Completed' });
    const archivedCount = await Inquiry.countDocuments({ status: 'Archived' });
    const recent = await Inquiry.find().sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      success: true,
      data: {
        total,
        new: newCount,
        inProgress: inProgressCount,
        contacted: contactedCount,
        completed: completedCount,
        archived: archivedCount,
        recent
      }
    });
  } catch (error) {
    console.error('Error fetching inquiry stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve inquiry statistics.',
      error: error.message
    });
  }
}

/**
 * @desc    Get single inquiry details
 * @route   GET /api/admin/inquiries/:id
 * @access  Private (Admin only)
 */
export async function getInquiryById(req, res) {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    console.error('Error fetching inquiry by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inquiry details.',
      error: error.message
    });
  }
}

/**
 * @desc    Update inquiry status
 * @route   PATCH /api/admin/inquiries/:id/status
 * @access  Private (Admin only)
 */
export async function updateInquiryStatus(req, res) {
  try {
    const { status } = req.body;
    const allowed = ['New', 'In Progress', 'Contacted', 'Completed', 'Archived'];

    if (!status || !allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowed.join(', ')}`
      });
    }

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found.'
      });
    }

    const oldStatus = inquiry.status;
    inquiry.status = status;

    // Record automatic status change audit note
    const adminEmail = req.admin?.email || 'Administrator';
    inquiry.adminNotes.push({
      text: `Status transitioned from "${oldStatus}" to "${status}"`,
      author: adminEmail,
      createdAt: new Date()
    });

    const updated = await inquiry.save();

    res.status(200).json({
      success: true,
      message: `Inquiry status updated to ${status}.`,
      data: updated
    });
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update inquiry status.',
      error: error.message
    });
  }
}

/**
 * @desc    Add follow-up note to an inquiry
 * @route   POST /api/admin/inquiries/:id/notes
 * @access  Private (Admin only)
 */
export async function addAdminNote(req, res) {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Note text cannot be empty.'
      });
    }

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found.'
      });
    }

    const author = req.admin?.name || req.admin?.email || 'Admin';

    inquiry.adminNotes.push({
      text: text.trim(),
      author,
      createdAt: new Date()
    });

    const updated = await inquiry.save();

    res.status(200).json({
      success: true,
      message: 'Follow-up note added successfully.',
      data: updated
    });
  } catch (error) {
    console.error('Error adding admin note:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add follow-up note.',
      error: error.message
    });
  }
}

/**
 * @desc    Delete an inquiry permanently
 * @route   DELETE /api/admin/inquiries/:id
 * @access  Private (Admin only)
 */
export async function deleteInquiry(req, res) {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found.'
      });
    }

    await inquiry.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete inquiry.',
      error: error.message
    });
  }
}

