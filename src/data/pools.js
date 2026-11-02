/**
 * ============================================================================
 * POONA POOLS FACILITIES - SWIMMING POOLS GALLERY & CATEGORIES DATA
 * ============================================================================
 * 
 * Edit, add, or customize pool categories and designs here.
 * Images reference local files in public/images/
 * 
 * Note: Movable/portable pool categories feature an informative disclaimer
 * explaining the distinct nature of constructed vs prefabricated installations.
 * ============================================================================
 */

export const poolCategories = [
  { id: 'all', label: 'All Designs' },
  { id: 'residential', label: 'Residential Pools' },
  { id: 'luxury', label: 'Luxury & Infinity' },
  { id: 'indoor-outdoor', label: 'Indoor & Outdoor' },
  { id: 'commercial', label: 'Commercial Pools' },
  { id: 'custom-specialty', label: 'Custom & Portable' }
];

export const poolsData = [
  {
    id: 'residential-pool-1',
    title: 'Modern Residential Villa Pool',
    category: 'residential',
    categoryLabel: 'Residential Swimming Pool',
    image: '/images/hero-pool-1.jpg',
    description: 'A private residential pool featuring integrated entry steps, natural stone decking, and crystal-clear turquoise water designed for family relaxation and private entertaining.',
    specifications: [
      'Type: In-ground Reinforced Concrete (RCC)',
      'Finish: Premium Porcelain Mosaic Tiles',
      'Filtration: High-rate Sand Filter & Energy-efficient Pump',
      'Lighting: Flush Submerged LED Lighting'
    ],
    inquiryMessage: 'Hello, I am inquiring about the Modern Residential Villa Pool design seen on your website.'
  },
  {
    id: 'luxury-infinity-1',
    title: 'Architectural Infinity Edge Pool',
    category: 'luxury',
    categoryLabel: 'Infinity Swimming Pool',
    image: '/images/hero-pool-3.jpg',
    description: 'A scenic infinity edge pool creating an optical illusion where water merges seamlessly into the horizon. Features a concealed surge tank, perimeter drainage gutter, and ambient LED fixtures.',
    specifications: [
      'Type: Vanishing Edge Overflow System',
      'Feature: Concealed Balancing Surge Tank',
      'Coping: Custom Beveled Natural Granite',
      'Automation: Automated Water Level Leveling Controller'
    ],
    inquiryMessage: 'Hello, I would like more information regarding the Architectural Infinity Edge Pool design.'
  },
  {
    id: 'indoor-pool-1',
    title: 'Climate-Controlled Indoor Lap Pool',
    category: 'indoor-outdoor',
    categoryLabel: 'Indoor Swimming Pool',
    image: '/images/hero-pool-2.jpg',
    description: 'Year-round indoor swimming facility designed with acoustic wooden ceiling slats, specialized dehumidification considerations, recessed underwater lighting, and low-chemical circulation.',
    specifications: [
      'Type: Enclosed Architectural Indoor Facility',
      'Water Care: Multi-layer Filtration & Low-Odor Sanitization',
      'Decking: Non-porous Anti-slip Polished Concrete / Tile',
      'Illumination: Linear Architectural Ceiling & Submerged Lights'
    ],
    inquiryMessage: 'Hello, I am interested in building or upgrading a Climate-Controlled Indoor Swimming Pool.'
  },
  {
    id: 'luxury-pool-2',
    title: 'Luxury Estate Resort-Style Pool',
    category: 'luxury',
    categoryLabel: 'Luxury Swimming Pool',
    image: '/images/luxury-pool.jpg',
    description: 'Expansive private resort-style pool with integrated sun shelves (Baja shelf), dedicated shallow zones, lounge chair water ledges, and architectural water bubblers.',
    specifications: [
      'Type: Multi-tier Luxury Residential Facility',
      'Features: Shallow Sun Shelf & Integrated Spa Jet Nook',
      'Finish: Shimmering Iridescent Glass Mosaic',
      'Equipment: Dual-speed High Capacity Filtration Plant'
    ],
    inquiryMessage: 'Hello, I would like to consult about the Luxury Estate Resort-Style Pool solution.'
  },
  {
    id: 'outdoor-pool-1',
    title: 'Outdoor Garden Courtyard Pool',
    category: 'indoor-outdoor',
    categoryLabel: 'Outdoor Swimming Pool',
    image: '/images/outdoor-pool.jpg',
    description: 'Harmoniously integrated into landscaped backyard gardens. Engineered with durable perimeter waterproofing and child-safe boundary planning.',
    specifications: [
      'Type: Outdoor Rectangular or Freeform Basin',
      'Decking: Slip-resistant Travertine Stone Pavers',
      'Safety: Shallow Step Entry & Grab Rails',
      'Cleaning: Suction Inlets for Automatic Pool Cleaners'
    ],
    inquiryMessage: 'Hello, I would like an estimate for an Outdoor Garden Courtyard Pool.'
  },
  {
    id: 'commercial-pool-1',
    title: 'Commercial & Hospitality Pool Facility',
    category: 'commercial',
    categoryLabel: 'Commercial Swimming Pool',
    image: '/images/commercial-pool.jpg',
    description: 'High-capacity swimming pool engineered for hotels, fitness clubs, housing societies, and educational institutions with heavy bather loads and stringent hygiene regulations.',
    specifications: [
      'Type: Heavy Bather Load Commercial Pool',
      'Turnover: Rapid 4-6 Hour Complete Water Turnover Rate',
      'Plant Room: Commercial Blue Sand Filters & Dual Pumps',
      'Regulatory: Anti-entrapment Safety Drain Covers'
    ],
    inquiryMessage: 'Hello, I represent an organization and would like to consult regarding a Commercial Swimming Pool Facility.'
  },
  {
    id: 'custom-pool-1',
    title: 'Custom Architectural Geometric Pool',
    category: 'custom-specialty',
    categoryLabel: 'Custom Swimming Pool Design',
    image: '/images/custom-pool.jpg',
    description: 'Custom-tailored pool designed to match challenging plot dimensions, split-level elevations, or unique landscape contours with bespoke spillways.',
    specifications: [
      'Type: Bespoke Civil Architectural Design',
      'Customization: Configurable Dimensions & Variable Depths',
      'Features: Integrated Water Cascade & Custom Seating',
      'Piping: Pressure-rated Heavy Gauge Schedule 40 PVC'
    ],
    inquiryMessage: 'Hello, I have custom project requirements for a Swimming Pool Design.'
  },
  {
    id: 'movable-pool-1',
    title: 'Modular & Semi-Permanent Pool Solutions',
    category: 'custom-specialty',
    categoryLabel: 'Movable / Portable Pool Options',
    image: '/images/movable-pool.jpg',
    description: 'Above-ground modular structures and portable pool alternatives suitable for temporary installations or areas with civil excavation constraints. Note: Site feasibility review required.',
    isDisclaimerNotice: true,
    disclaimerText: 'Notice: Portable and movable pools differ fundamentally in structure and longevity from in-ground concrete pools. Installation viability and equipment compatibility are subject to direct site verification.',
    specifications: [
      'Type: Modular / Above-Ground Structural Frame',
      'Installation: Non-invasive, Minimal Civil Foundation',
      'Portability: Relocatable Framework Options',
      'Suitability: Subject to Site Assessment'
    ],
    inquiryMessage: 'Hello, I would like to inquire about Modular / Portable Pool alternatives and site feasibility.'
  }
];
