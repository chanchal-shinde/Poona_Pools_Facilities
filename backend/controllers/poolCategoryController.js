/**
 * ==============================================================================
 * POOL CATEGORY CONTROLLER (backend/controllers/poolCategoryController.js)
 * ==============================================================================
 * Student / Developer Guide:
 * Manages swimming pool categories (Residential, Luxury, Commercial, etc.).
 * 
 * Safe Deletion Strategy:
 * When deleting a category, it checks if any PoolDesign documents are linked to it.
 * If designs exist, deletion is blocked with a 400 Bad Request to prevent
 * orphaned pool designs.
 * ==============================================================================
 */

import PoolCategory from '../models/PoolCategory.js';
import PoolDesign from '../models/PoolDesign.js';

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
 * @desc    Get all active pool categories for public gallery tabs
 * @route   GET /api/public/pool-categories
 * @access  Public
 */
export async function getPublicCategories(req, res) {
  try {
    const categories = await PoolCategory.find({ isActive: true }).sort({ order: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('❌ [getPublicCategories Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve pool categories.'
    });
  }
}

/**
 * @desc    Get all pool categories (with associated design count) for admin
 * @route   GET /api/admin/pool-categories
 * @access  Protected
 */
export async function getAdminCategories(req, res) {
  try {
    const categories = await PoolCategory.find({}).sort({ order: 1, createdAt: 1 }).lean();

    // Attach count of associated designs to each category sequentially to ensure connection stability
    const categoriesWithCounts = [];
    for (const cat of categories) {
      let designCount = 0;
      try {
        designCount = await PoolDesign.countDocuments({ category: cat._id });
      } catch (cntErr) {
        console.warn(`[getAdminCategories] Warning: count failed for category ${cat._id}:`, cntErr.message);
      }
      categoriesWithCounts.push({
        ...cat,
        designCount
      });
    }

    res.status(200).json({
      success: true,
      count: categoriesWithCounts.length,
      data: categoriesWithCounts
    });
  } catch (error) {
    console.error('❌ [getAdminCategories Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve pool categories for admin.'
    });
  }
}

/**
 * @desc    Get single pool category by ID
 * @route   GET /api/admin/pool-categories/:id
 * @access  Protected
 */
export async function getCategoryById(req, res) {
  try {
    const category = await PoolCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Pool category not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('❌ [getCategoryById Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve category details.'
    });
  }
}

/**
 * @desc    Create new pool category
 * @route   POST /api/admin/pool-categories
 * @access  Protected
 */
export async function createCategory(req, res) {
  try {
    const { label, categoryId, description, isActive, order } = req.body;

    if (!label || !label.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category label / name is required.'
      });
    }

    const slug = categoryId && categoryId.trim() ? slugify(categoryId) : slugify(label);

    // Duplicate check
    const existing = await PoolCategory.findOne({
      $or: [{ categoryId: slug }, { label: label.trim() }]
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A category with this name or identifier already exists.'
      });
    }

    const newCategory = await PoolCategory.create({
      categoryId: slug,
      label: label.trim(),
      description: description ? description.trim() : '',
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      order: order ? Number(order) : 0
    });

    res.status(201).json({
      success: true,
      message: 'Pool category created successfully.',
      data: newCategory
    });
  } catch (error) {
    console.error('❌ [createCategory Error]:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create category.'
    });
  }
}

/**
 * @desc    Update an existing pool category
 * @route   PUT /api/admin/pool-categories/:id
 * @access  Protected
 */
export async function updateCategory(req, res) {
  try {
    const category = await PoolCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Pool category not found.'
      });
    }

    const { label, categoryId, description, isActive, order } = req.body;

    if (label && label.trim() !== category.label) {
      const duplicateLabel = await PoolCategory.findOne({
        _id: { $ne: category._id },
        label: label.trim()
      });
      if (duplicateLabel) {
        return res.status(400).json({
          success: false,
          message: 'Another category is already using this label.'
        });
      }
      category.label = label.trim();
    }

    if (categoryId && categoryId.trim() !== category.categoryId) {
      const slug = slugify(categoryId);
      const duplicateSlug = await PoolCategory.findOne({
        _id: { $ne: category._id },
        categoryId: slug
      });
      if (duplicateSlug) {
        return res.status(400).json({
          success: false,
          message: 'Another category is already using this identifier slug.'
        });
      }
      category.categoryId = slug;
    }

    if (description !== undefined) category.description = description.trim();
    if (isActive !== undefined) category.isActive = Boolean(isActive);
    if (order !== undefined) category.order = Number(order);

    const updatedCategory = await category.save();

    // Synchronize label & slug to any associated designs in MongoDB
    await PoolDesign.updateMany(
      { category: category._id },
      { categorySlug: category.categoryId, categoryLabel: category.label }
    );

    res.status(200).json({
      success: true,
      message: 'Pool category updated successfully.',
      data: updatedCategory
    });
  } catch (error) {
    console.error('❌ [updateCategory Error]:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update category.'
    });
  }
}

/**
 * @desc    Toggle category active status
 * @route   PATCH /api/admin/pool-categories/:id/toggle
 * @access  Protected
 */
export async function toggleCategoryStatus(req, res) {
  try {
    const category = await PoolCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Pool category not found.'
      });
    }

    category.isActive = !category.isActive;
    await category.save();

    res.status(200).json({
      success: true,
      message: `Category "${category.label}" is now ${category.isActive ? 'Active' : 'Inactive'}.`,
      data: category
    });
  } catch (error) {
    console.error('❌ [toggleCategoryStatus Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update category status.'
    });
  }
}

/**
 * @desc    Delete pool category (Safe Deletion: prevents orphaned designs)
 * @route   DELETE /api/admin/pool-categories/:id
 * @access  Protected
 */
export async function deleteCategory(req, res) {
  try {
    const category = await PoolCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Pool category not found.'
      });
    }

    // SAFE DELETION: Check if any pool designs are assigned to this category
    const associatedDesignsCount = await PoolDesign.countDocuments({ category: req.params.id });

    if (associatedDesignsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete "${category.label}": It has ${associatedDesignsCount} associated pool design(s). Reassign or delete those designs first, or toggle this category to Inactive instead.`
      });
    }

    await PoolCategory.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: `Category "${category.label}" deleted successfully.`
    });
  } catch (error) {
    console.error('❌ [deleteCategory Error]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category.'
    });
  }
}

