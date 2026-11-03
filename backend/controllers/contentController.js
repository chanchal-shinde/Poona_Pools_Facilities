/**
 * ==============================================================================
 * WEBSITE CONTENT CONTROLLER (backend/controllers/contentController.js)
 * ==============================================================================
 * Student / Developer Guide:
 * Handles HTTP requests for reading and updating website content, including:
 * - Leadership credentials (Sunil Shinde, CEO, 12+ Years)
 * - Mission, Vision, and Commitment
 * - Why Choose Us pillars
 * - Company statistics & milestones
 * 
 * Public Endpoint:
 * - GET /api/public/content  -> Returns website content for public pages
 * 
 * Protected Admin Endpoints:
 * - GET /api/admin/content   -> Returns website content with full audit timestamps
 * - PUT /api/admin/content   -> Validates and updates website content
 * ==============================================================================
 */

import WebsiteContent from '../models/WebsiteContent.js';

const defaultContent = {
  key: 'default',
  organizationName: 'Poona Pools Facilities',
  tagline: 'Professional Swimming Pool Construction, Filtration & Maintenance Solutions',
  shortDescription:
    'From custom swimming pool engineering and reinforced construction to filtration and routine maintenance, Poona Pools Facilities provides tailored solutions designed around your space.',
  owner: {
    name: 'Sunil Shinde',
    designation: 'CEO',
    experience: '12+ Years'
  },
  establishedYear: '2017',
  missionVision: {
    mission:
      'To construct and maintain superior swimming pool facilities with uncompromising structural integrity, energy-efficient filtration, and bespoke architectural aesthetics tailored to each client.',
    vision:
      'To be the most trusted and technically proficient swimming pool engineering and maintenance organization in the region, recognized for transparent craftsmanship and exceptional client service.',
    commitment:
      'We commit to using premium commercial-grade materials, precision waterproofing techniques, and prompt post-handover maintenance support so your swimming pool remains pristine, hygienic, and enjoyable for decades.'
  },
  whyChooseUs: [
    {
      title: 'Quality Workmanship',
      description:
        'Engineered concrete shells, premium coping stones, and durable mosaic finishes built to withstand high water pressure and weather extremes.'
    },
    {
      title: 'Professional Service',
      description:
        'Direct communication, transparent milestones, and professional execution from initial excavation to final water balancing.'
    },
    {
      title: 'Tailored Solutions',
      description:
        'Custom dimensions, depths, and architectural pool layouts configured specifically to your land topography and lifestyle.'
    },
    {
      title: 'Attention to Detail',
      description:
        'Meticulous plumbing, multi-stage filtration plumbing, leak-free waterproofing membranes, and polished aesthetic tiling.'
    },
    {
      title: 'Reliable Support',
      description:
        'Dependable routine maintenance, chemical testing, equipment servicing, and prompt technical support whenever you need assistance.'
    }
  ],
  statistics: [
    {
      label: 'Years of Experience',
      value: '12+',
      suffix: '',
      description: 'Dedicated focus on swimming pool construction & technical maintenance'
    },
    {
      label: 'Projects Completed',
      value: '150+',
      suffix: '',
      description: 'Residential, luxury, and commercial pool installations'
    },
    {
      label: 'Services Offered',
      value: '10+',
      suffix: '',
      description: 'Comprehensive end-to-end swimming pool facility solutions'
    },
    {
      label: 'Customer Satisfaction',
      value: '100%',
      suffix: '',
      description: 'Committed to rigorous craftsmanship and long-term water safety'
    }
  ],
  lastUpdatedBy: 'System Seed'
};

/**
 * @desc    Fetch website content for public pages (About, Home, etc.)
 * @route   GET /api/public/content
 * @access  Public
 */
export async function getPublicContent(req, res) {
  try {
    let content = await WebsiteContent.findOne({ key: 'default' }).select('-_id -__v -lastUpdatedBy');

    if (!content) {
      content = await WebsiteContent.create(defaultContent);
    }

    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error fetching public website content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve website content.',
      error: error.message
    });
  }
}

/**
 * @desc    Fetch website content for admin management
 * @route   GET /api/admin/content
 * @access  Private (Admin only)
 */
export async function getAdminContent(req, res) {
  try {
    let content = await WebsiteContent.findOne({ key: 'default' });

    if (!content) {
      content = await WebsiteContent.create(defaultContent);
    }

    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error fetching admin website content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve website content for admin.',
      error: error.message
    });
  }
}

/**
 * @desc    Update website content
 * @route   PUT /api/admin/content
 * @access  Private (Admin only)
 */
export async function updateContent(req, res) {
  try {
    const {
      organizationName,
      tagline,
      shortDescription,
      owner,
      establishedYear,
      missionVision,
      whyChooseUs,
      statistics
    } = req.body;

    // 1. Validation: Owner Credentials
    if (!owner || !owner.name || !owner.name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Owner name is required.'
      });
    }

    if (!owner.designation || !owner.designation.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Owner designation is required.'
      });
    }

    if (!owner.experience || !owner.experience.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Owner experience is required.'
      });
    }

    // 2. Validation: Mission & Vision
    if (!missionVision || !missionVision.mission?.trim() || !missionVision.vision?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Both mission and vision statements are required.'
      });
    }

    // 3. Validation: Statistics
    if (statistics && !Array.isArray(statistics)) {
      return res.status(400).json({
        success: false,
        message: 'Statistics must be an array of milestone objects.'
      });
    }

    // 4. Validation: Why Choose Us
    if (whyChooseUs && !Array.isArray(whyChooseUs)) {
      return res.status(400).json({
        success: false,
        message: 'Why Choose Us must be an array of strength pillars.'
      });
    }

    // Update singleton content document
    let content = await WebsiteContent.findOne({ key: 'default' });
    if (!content) {
      content = new WebsiteContent({ key: 'default' });
    }

    if (organizationName && organizationName.trim()) {
      content.organizationName = organizationName.trim();
    }
    if (tagline !== undefined) content.tagline = tagline.trim();
    if (shortDescription !== undefined) content.shortDescription = shortDescription.trim();

    content.owner = {
      name: owner.name.trim(),
      designation: owner.designation.trim(),
      experience: owner.experience.trim()
    };

    if (establishedYear !== undefined) content.establishedYear = establishedYear.trim();

    content.missionVision = {
      mission: missionVision.mission.trim(),
      vision: missionVision.vision.trim(),
      commitment: (missionVision.commitment || '').trim()
    };

    if (Array.isArray(whyChooseUs)) {
      content.whyChooseUs = whyChooseUs
        .filter((w) => w.title && w.title.trim())
        .map((w) => ({
          title: w.title.trim(),
          description: (w.description || '').trim()
        }));
    }

    if (Array.isArray(statistics)) {
      content.statistics = statistics
        .filter((s) => s.label && s.label.trim())
        .map((s) => ({
          label: s.label.trim(),
          value: (s.value || '').trim(),
          suffix: (s.suffix || '').trim(),
          description: (s.description || '').trim()
        }));
    }

    content.lastUpdatedBy = req.admin?.email || 'Admin';

    const savedContent = await content.save();

    res.status(200).json({
      success: true,
      message: 'Website content updated successfully and published live across the site.',
      data: savedContent
    });
  } catch (error) {
    console.error('Error updating website content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update website content.',
      error: error.message
    });
  }
}

