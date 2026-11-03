/**
 * ==============================================================================
 * POOL DESIGN CONTROLLER (backend/controllers/poolDesignController.js)
 * ==============================================================================
 * Student / Developer Guide:
 * Handles pool design concepts and completed projects.
 * 
 * Relationships:
 * Each design references its parent PoolCategory via the `category` field.
 * ==============================================================================
 */

import PoolDesign from '../models/PoolDesign.js';
import PoolCategory from '../models/PoolCategory.js';

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
 * @desc    Get all active pool designs for the public showcase
 * @route   GET /api/public/pool-designs
 * @access  Public
 */
export async function getPublicDesigns(req, res) {
  try {
    // Only return designs where design is active and parent category is active
    const activeCategories = await PoolCategory.find({ isActive: true }).select('_id');
    const activeCategoryIds = activeCategories.map((c) => c._id);

    const designs = await PoolDesign.find({
      isActive: true,
      category: { $in: activeCategoryIds }
    })
      .sort({ order: 1, createdAt: 1 })
      .populate('category', 'label categoryId');

    res.status(200).json({
      success: true,
      count: designs.length,
      data: designs
    });
  } catch (error) {
    console.error('❌ [getPublicDesigns Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve pool designs.'
    });
  }
}

/**
 * @desc    Get all pool designs for admin dashboard
 * @route   GET /api/admin/pool-designs
 * @access  Protected
 */
export async function getAdminDesigns(req, res) {
  try {
    const designs = await PoolDesign.find({})
      .sort({ order: 1, createdAt: 1 })
      .populate('category', 'label categoryId isActive');

    res.status(200).json({
      success: true,
      count: designs.length,
      data: designs
    });
  } catch (error) {
    console.error('❌ [getAdminDesigns Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve pool designs for admin.'
    });
  }
}

/**
 * @desc    Get single pool design by ID
 * @route   GET /api/admin/pool-designs/:id
 * @access  Protected
 */
export async function getDesignById(req, res) {
  try {
    const design = await PoolDesign.findById(req.params.id).populate('category');

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Pool design not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: design
    });
  } catch (error) {
    console.error('❌ [getDesignById Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve design details.'
    });
  }
}

/**
 * @desc    Create new pool design
 * @route   POST /api/admin/pool-designs
 * @access  Protected
 */
export async function createDesign(req, res) {
  try {
    const {
      title,
      designId,
      categoryId,
      image,
      description,
      specifications,
      dimensions,
      inquiryMessage,
      isDisclaimerNotice,
      disclaimerText,
      isActive,
      order
    } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Design title is required.' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ success: false, message: 'Description is required.' });
    }
    if (!categoryId) {
      return res.status(400).json({ success: false, message: 'Please select a parent pool category.' });
    }

    // Verify parent category exists in MongoDB
    const parentCategory = await PoolCategory.findById(categoryId);
    if (!parentCategory) {
      return res.status(400).json({ success: false, message: 'Invalid parent pool category.' });
    }

    const slug = designId && designId.trim() ? slugify(designId) : slugify(title);

    // Duplicate check
    const existing = await PoolDesign.findOne({
      $or: [{ designId: slug }, { title: title.trim() }]
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A pool design with this title or identifier already exists.'
      });
    }

    // Parse specifications
    let formattedSpecs = [];
    if (Array.isArray(specifications)) {
      formattedSpecs = specifications.map((s) => s.trim()).filter(Boolean);
    } else if (typeof specifications === 'string') {
      formattedSpecs = specifications.split('\n').map((s) => s.trim()).filter(Boolean);
    }

    const defaultInquiryMessage =
      inquiryMessage && inquiryMessage.trim()
        ? inquiryMessage.trim()
        : `Hello, I would like to inquire about the ${title.trim()} design seen on your website.`;

    const newDesign = await PoolDesign.create({
      designId: slug,
      title: title.trim(),
      category: parentCategory._id,
      categorySlug: parentCategory.categoryId,
      categoryLabel: parentCategory.label,
      image: image && image.trim() ? image.trim() : '/images/hero-pool-1.jpg',
      description: description.trim(),
      specifications: formattedSpecs,
      dimensions: dimensions ? dimensions.trim() : '',
      inquiryMessage: defaultInquiryMessage,
      isDisclaimerNotice: Boolean(isDisclaimerNotice),
      disclaimerText: disclaimerText ? disclaimerText.trim() : '',
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      order: order ? Number(order) : 0
    });

    res.status(201).json({
      success: true,
      message: 'Pool design created successfully.',
      data: newDesign
    });
  } catch (error) {
    console.error('❌ [createDesign Error]:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create pool design.'
    });
  }
}

/**
 * @desc    Update an existing pool design
 * @route   PUT /api/admin/pool-designs/:id
 * @access  Protected
 */
export async function updateDesign(req, res) {
  try {
    const design = await PoolDesign.findById(req.params.id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Pool design not found.'
      });
    }

    const {
      title,
      designId,
      categoryId,
      image,
      description,
      specifications,
      dimensions,
      inquiryMessage,
      isDisclaimerNotice,
      disclaimerText,
      isActive,
      order
    } = req.body;

    // Check title conflict
    if (title && title.trim() !== design.title) {
      const duplicateTitle = await PoolDesign.findOne({
        _id: { $ne: design._id },
        title: title.trim()
      });
      if (duplicateTitle) {
        return res.status(400).json({
          success: false,
          message: 'Another pool design is already using this title.'
        });
      }
      design.title = title.trim();
    }

    // Check slug conflict
    if (designId && designId.trim() !== design.designId) {
      const slug = slugify(designId);
      const duplicateSlug = await PoolDesign.findOne({
        _id: { $ne: design._id },
        designId: slug
      });
      if (duplicateSlug) {
        return res.status(400).json({
          success: false,
          message: 'Another pool design is already using this identifier slug.'
        });
      }
      design.designId = slug;
    }

    // Update parent category reference if changed
    if (categoryId && categoryId !== design.category.toString()) {
      const parentCat = await PoolCategory.findById(categoryId);
      if (!parentCat) {
        return res.status(400).json({ success: false, message: 'Invalid parent pool category.' });
      }
      design.category = parentCat._id;
      design.categorySlug = parentCat.categoryId;
      design.categoryLabel = parentCat.label;
    }

    if (image !== undefined) design.image = image.trim();
    if (description !== undefined) design.description = description.trim();
    if (dimensions !== undefined) design.dimensions = dimensions.trim();
    if (inquiryMessage !== undefined) design.inquiryMessage = inquiryMessage.trim();
    if (isDisclaimerNotice !== undefined) design.isDisclaimerNotice = Boolean(isDisclaimerNotice);
    if (disclaimerText !== undefined) design.disclaimerText = disclaimerText.trim();
    if (isActive !== undefined) design.isActive = Boolean(isActive);
    if (order !== undefined) design.order = Number(order);

    if (specifications !== undefined) {
      if (Array.isArray(specifications)) {
        design.specifications = specifications.map((s) => s.trim()).filter(Boolean);
      } else if (typeof specifications === 'string') {
        design.specifications = specifications.split('\n').map((s) => s.trim()).filter(Boolean);
      }
    }

    const updatedDesign = await design.save();

    res.status(200).json({
      success: true,
      message: 'Pool design updated successfully.',
      data: updatedDesign
    });
  } catch (error) {
    console.error('❌ [updateDesign Error]:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update pool design.'
    });
  }
}

/**
 * @desc    Toggle design active status
 * @route   PATCH /api/admin/pool-designs/:id/toggle
 * @access  Protected
 */
export async function toggleDesignStatus(req, res) {
  try {
    const design = await PoolDesign.findById(req.params.id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Pool design not found.'
      });
    }

    design.isActive = !design.isActive;
    await design.save();

    res.status(200).json({
      success: true,
      message: `Pool design "${design.title}" is now ${design.isActive ? 'Active' : 'Inactive'}.`,
      data: design
    });
  } catch (error) {
    console.error('❌ [toggleDesignStatus Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update design status.'
    });
  }
}

/**
 * @desc    Delete a pool design
 * @route   DELETE /api/admin/pool-designs/:id
 * @access  Protected
 */
export async function deleteDesign(req, res) {
  try {
    const design = await PoolDesign.findById(req.params.id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Pool design not found.'
      });
    }

    await PoolDesign.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: `Pool design "${design.title}" deleted successfully.`
    });
  } catch (error) {
    console.error('❌ [deleteDesign Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete pool design.'
    });
  }
}

