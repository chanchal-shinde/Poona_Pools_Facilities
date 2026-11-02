# Poona Pools Facilities - Business Website

A complete, responsive, and visually modern business website for **Poona Pools Facilities**, specializing in swimming pool construction, filtration systems, routine maintenance, renovations, and waterproofing in Pune, Maharashtra.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (version 18 or newer recommended)
- npm (comes bundled with Node.js)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173/`

### 3. Run Production Build
```bash
npm run build
```
This generates the optimized production bundle inside the `dist/` directory.

### 4. Preview Production Build Locally
```bash
npm run preview
```

---

## 📁 Project Structure

```
Poona Pool Facilities/
├── public/
│   ├── images/              # High-resolution pool & facility photographs
│   ├── favicon.svg          # Stylized swimming pool wave favicon
│   ├── robots.txt           # SEO robots configuration
│   └── sitemap.xml          # XML sitemap covering all 5 pages
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Sticky header with top contact bar & mobile menu
│   │   ├── Footer.jsx          # Corporate footer with direct links & contact cards
│   │   ├── HeroSlider.jsx      # Accessible pool photography slider with controls
│   │   ├── WhatsAppButton.jsx  # Floating WhatsApp button appearing on all pages
│   │   ├── ServiceCard.jsx     # Reusable service display card
│   │   ├── PoolCard.jsx        # Photography pool card with WhatsApp inquiry
│   │   ├── SectionHeading.jsx  # Consistent section titles with water dividers
│   │   └── ScrollToTop.jsx     # Automatically scrolls to top on route change
│   │
│   ├── pages/
│   │   ├── Home.jsx            # Hero slider, statistics, previews, values, CTA
│   │   ├── Services.jsx        # 7 detailed services & 5-step engineering process
│   │   ├── SwimmingPools.jsx   # Filterable pool design gallery
│   │   ├── About.jsx           # Leadership profile, milestones, core values, gallery
│   │   └── Contact.jsx         # Contact cards, maps placeholder, direct WhatsApp, FAQs
│   │
│   ├── data/
│   │   ├── services.js         # Centralized list of services & descriptions
│   │   └── pools.js            # Centralized list of pool designs & specifications
│   │
│   ├── config/
│   │   └── siteConfig.js       # Centralized business information, phone, WhatsApp, owner
│   │
│   ├── App.jsx                 # React Router routing & layout wrapper
│   ├── main.jsx                # Application entry point
│   └── index.css               # Design system & custom CSS with Bootstrap 5
│
├── vercel.json                 # Vercel SPA rewrites for direct navigation & refresh
├── index.html                  # HTML template with SEO meta tags & Google Fonts
├── package.json                # Project dependencies and npm scripts
└── vite.config.js              # Vite configuration
```

---

## 🛠️ How to Customize Business Details

All business details are centralized so you do **not** need to edit React components directly.

### 1. How to Change Phone, WhatsApp, and Business Details
Open file: `src/config/siteConfig.js`

- **Organization Name**: Update `organizationName: 'Poona Pools Facilities'`
- **Owner Name & Designation**: Update `owner.name`, `owner.designation`, and `owner.bio`
- **Phone Number**: Update `contact.phone` and `contact.displayPhone`
- **Business Address & Hours**: Update `contact.address` and `contact.businessHours`
- **Statistics**: Update the values in `statistics` (e.g., `value: '15+'` for years of experience)

#### ⚠️ WhatsApp Number Format:
In `src/config/siteConfig.js`:
```javascript
// Digits only with international country code.
// No '+' sign, no hyphens, no spaces.
// Example for India (+91 98765 43210):
whatsapp: '919876543210',
```

### 2. How to Add Your Google Maps Location
Open file: `src/config/siteConfig.js`
1. Open [Google Maps](https://maps.google.com).
2. Search for your business location.
3. Click **Share** > **Embed a map**.
4. Copy the URL inside the `src="..."` attribute of the iframe.
5. Paste it into `contact.googleMapsEmbedUrl`:
```javascript
googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=...'
```
*(If left empty, a clean location card is automatically displayed instead).*

### 3. How to Replace Swimming Pool Images
All images are located in the `public/images/` directory:
- `hero-pool-1.jpg`, `hero-pool-2.jpg`, `hero-pool-3.jpg` (Hero slider)
- `pool-construction.jpg` (Construction service)
- `pool-maintenance.jpg` (Maintenance service)
- `pool-filtration.jpg` (Filtration plants)
- `pool-renovation.jpg` (Renovation)
- `pool-waterproofing.jpg` (Waterproofing)
- `pool-equipment.jpg` (Equipment & accessories)
- `residential-pool.jpg`, `commercial-pool.jpg`, `luxury-pool.jpg`, etc. (Pool designs)
- `owner-photo.jpg` (Owner / leadership photo)

You can replace any photo simply by saving your new file with the **same filename** in `public/images/`.

### 4. How to Edit Services
Open file: `src/data/services.js`
- Edit existing services, titles, descriptions, and key points.
- To add a new service, copy an existing service object block and change its `id`, `title`, and `fullDescription`.

### 5. How to Edit Swimming Pool Categories & Designs
Open file: `src/data/pools.js`
- Edit pool titles, category tags, descriptions, and specifications.
- Filter categories are defined in `poolCategories`.

---

## ☁️ How to Deploy to Vercel

The project includes `vercel.json` preconfigured with single-page application (SPA) rewrites.

### Method 1: Deploy with Git (Recommended)
1. Push your repository to **GitHub** or **GitLab**.
2. Log in to [Vercel](https://vercel.com).
3. Click **Add New...** > **Project**.
4. Select your repository.
5. Vercel automatically detects **Vite**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **Deploy**.

### Method 2: Deploy with Vercel CLI
```bash
npx vercel
```
Follow the interactive prompts to deploy.
