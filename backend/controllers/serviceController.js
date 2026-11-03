/**
 * ==============================================================================
 * SERVICE CONTROLLER (backend/controllers/serviceController.js)
 * ==============================================================================
 * Student / Developer Guide:
 * Handles all business logic and database interactions for swimming pool services.
 * 
 * Public Routes:
 * - getPublicServices: Fetches only active services (isActive: true)
 * 
 * Protected Admin Routes (Requires HttpOnly JWT cookie):
 * - getAdminServices: Fetches all services (active & inactive)
 * - getServiceById: Fetches details for a specific service
 * - createService: Validates & saves a new service
 * - updateService: Validates & updates an existing service
 * - deleteService: Permanently removes a service
 * - toggleServiceStatus: Switches a service between active & inactive
 * ==============================================================================
 */

import Service from '../models/Service.js';

/**
 * Helper to generate a URL-friendly slug from title
 * e.g. "Swimming Pool Construction" -> "swimming-pool-construction"
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * @desc    Get all active services for the public website
 * @route   GET /api/public/services
 * @access  Public
 */
export async function getPublicServices(req, res) {
  try {
    // Only return services that have isActive set to true
    const services = await Service.find({ isActive: true }).sort({ order: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    console.error('❌ [getPublicServices Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve services.'
    });
  }
}

/**
 * @desc    Get all services (active and inactive) for admin management
 * @route   GET /api/admin/services
 * @access  Protected
 */
export async function getAdminServices(req, res) {
  try {
    const services = await Service.find({}).sort({ order: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    console.error('❌ [getAdminServices Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve services for dashboard.'
    });
  }
}

/**
 * @desc    Get single service by ID
 * @route   GET /api/admin/services/:id
 * @access  Protected
 */
export async function getServiceById(req, res) {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('❌ [getServiceById Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve service details.'
    });
  }
}

/**
 * @desc    Create a new service
 * @route   POST /api/admin/services
 * @access  Protected
 */
export async function createService(req, res) {
  try {
    const {
      title,
      shortDescription,
      fullDescription,
      image,
      icon,
      keyPoints,
      inquiryMessage,
      isActive,
      order,
      serviceId
    } = req.body;

    // 1. Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Service title is required.' });
    }
    if (!shortDescription || !shortDescription.trim()) {
      return res.status(400).json({ success: false, message: 'Short description is required.' });
    }
    if (!fullDescription || !fullDescription.trim()) {
      return res.status(400).json({ success: false, message: 'Full description is required.' });
    }

    // 2. Generate slug if not provided
    const slug = serviceId && serviceId.trim() ? slugify(serviceId) : slugify(title);

    // 3. Duplicate Prevention Check
    const existing = await Service.findOne({
      $or: [{ serviceId: slug }, { title: title.trim() }]
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A service with this title or identifier already exists.'
      });
    }

    // 4. Format keyPoints (handle array or newline-separated string)
    let formattedKeyPoints = [];
    if (Array.isArray(keyPoints)) {
      formattedKeyPoints = keyPoints.map((p) => p.trim()).filter(Boolean);
    } else if (typeof keyPoints === 'string') {
      formattedKeyPoints = keyPoints.split('\n').map((p) => p.trim()).filter(Boolean);
    }

    // 5. Default inquiry message
    const defaultInquiryMessage =
      inquiryMessage && inquiryMessage.trim()
        ? inquiryMessage.trim()
        : `Hello, I would like to inquire about ${title.trim()} services from Poona Pools Facilities.`;

    // 6. Create document in MongoDB Atlas
    const newService = await Service.create({
      serviceId: slug,
      title: title.trim(),
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim(),
      image: image && image.trim() ? image.trim() : '/images/pool-construction.jpg',
      icon: icon || 'hammer',
      keyPoints: formattedKeyPoints,
      inquiryMessage: defaultInquiryMessage,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      order: order ? Number(order) : 0
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully.',
      data: newService
    });
  } catch (error) {
    console.error('❌ [createService Error]:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create service.'
    });
  }
}

/**
 * @desc    Update an existing service
 * @route   PUT /api/admin/services/:id
 * @access  Protected
 */
export async function updateService(req, res) {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.'
      });
    }

    const {
      title,
      shortDescription,
      fullDescription,
      image,
      icon,
      keyPoints,
      inquiryMessage,
      isActive,
      order,
      serviceId
    } = req.body;

    // Check title conflict with another service
    if (title && title.trim() !== service.title) {
      const duplicateTitle = await Service.findOne({
        _id: { $ne: service._id },
        title: title.trim()
      });
      if (duplicateTitle) {
        return res.status(400).json({
          success: false,
          message: 'Another service is already using this title.'
        });
      }
      service.title = title.trim();
    }

    // Check slug conflict if slug is being updated
    if (serviceId && serviceId.trim() !== service.serviceId) {
      const slug = slugify(serviceId);
      const duplicateSlug = await Service.findOne({
        _id: { $ne: service._id },
        serviceId: slug
      });
      if (duplicateSlug) {
        return res.status(400).json({
          success: false,
          message: 'Another service is already using this identifier slug.'
        });
      }
      service.serviceId = slug;
    }

    if (shortDescription !== undefined) service.shortDescription = shortDescription.trim();
    if (fullDescription !== undefined) service.fullDescription = fullDescription.trim();
    if (image !== undefined) service.image = image.trim();
    if (icon !== undefined) service.icon = icon;
    if (inquiryMessage !== undefined) service.inquiryMessage = inquiryMessage.trim();
    if (isActive !== undefined) service.isActive = Boolean(isActive);
    if (order !== undefined) service.order = Number(order);

    if (keyPoints !== undefined) {
      if (Array.isArray(keyPoints)) {
        service.keyPoints = keyPoints.map((p) => p.trim()).filter(Boolean);
      } else if (typeof keyPoints === 'string') {
        service.keyPoints = keyPoints.split('\n').map((p) => p.trim()).filter(Boolean);
      }
    }

    const updatedService = await service.save();

    res.status(200).json({
      success: true,
      message: 'Service updated successfully.',
      data: updatedService
    });
  } catch (error) {
    console.error('❌ [updateService Error]:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update service.'
    });
  }
}

/**
 * @desc    Toggle service active status (active <-> inactive)
 * @route   PATCH /api/admin/services/:id/toggle
 * @access  Protected
 */
export async function toggleServiceStatus(req, res) {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.'
      });
    }

    service.isActive = !service.isActive;
    await service.save();

    res.status(200).json({
      success: true,
      message: `Service "${service.title}" is now ${service.isActive ? 'Active' : 'Inactive'}.`,
      data: service
    });
  } catch (error) {
    console.error('❌ [toggleServiceStatus Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update service status.'
    });
  }
}

/**
 * @desc    Delete a service
 * @route   DELETE /api/admin/services/:id
 * @access  Protected
 */
export async function deleteService(req, res) {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.'
      });
    }

    await Service.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: `Service "${service.title}" deleted successfully.`
    });
  } catch (error) {
    console.error('❌ [deleteService Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service.'
    });
  }
}

