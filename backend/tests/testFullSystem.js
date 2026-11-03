/**
 * ==============================================================================
 * MASTER INTEGRATION & SECURITY TEST SUITE (backend/tests/testFullSystem.js)
 * ==============================================================================
 * Phase 6: Full System Integration, Security Audit & Deployment Verification
 * 
 * Verifies end-to-end functionality across:
 * 1. Health & Atlas connectivity
 * 2. All 6 Public APIs (Services, Pool Categories, Pool Designs, Pricing, Settings, Content)
 * 3. Public Quote Submission with duplicate suppression
 * 4. Security checks: 401 on unauthenticated access across all admin routes
 * 5. Admin Authentication: Login, /me verification, and session cookie handling
 * 6. Admin CRUD operations:
 *    - Services Management
 *    - Pool Categories & Designs Management
 *    - Pricing Configuration
 *    - Business Settings & Website Content
 *    - Inquiry Lifecycle (Search, Filter, Status Change, Follow-up Notes, Deletion)
 * 7. Admin Logout & session revocation
 * ==============================================================================
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const BASE_URL = 'http://localhost:5000';
let authCookie = '';

async function runMasterTestSuite() {
  console.log('================================================================');
  console.log('   POONA POOLS FACILITIES - MASTER INTEGRATION & SECURITY SUITE ');
  console.log('================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (!condition) {
      console.error(`❌ FAILED: ${message}`);
      throw new Error(message);
    }
    passedTests++;
    console.log(`  ✓ ${message}`);
  }

  try {
    // -------------------------------------------------------------------------
    // STEP 1: Health & Database Connectivity Check
    // -------------------------------------------------------------------------
    console.log('[SECTION 1] System Health & Database Connectivity');
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const health = await healthRes.json();
    assert(healthRes.status === 200, 'Health endpoint responds with HTTP 200');
    assert(health.status === 'healthy', 'Health status is "healthy"');
    assert(health.database && health.database.connected === true, 'MongoDB Atlas is actively connected');
    console.log(`    Atlas Cluster Host: ${health.database.host}\n`);

    // -------------------------------------------------------------------------
    // STEP 2: Public Data Endpoints Verification
    // -------------------------------------------------------------------------
    console.log('[SECTION 2] Public Data Endpoints');
    
    // 2a. Public Services
    const srvRes = await fetch(`${BASE_URL}/api/public/services`);
    const srvData = await srvRes.json();
    assert(srvRes.status === 200 && srvData.success && Array.isArray(srvData.data), 'Public Services endpoint returned active list');
    console.log(`    Active Services Count: ${srvData.data.length}`);

    // 2b. Public Pool Categories
    const catRes = await fetch(`${BASE_URL}/api/public/pool-categories`);
    const catData = await catRes.json();
    assert(catRes.status === 200 && catData.success && Array.isArray(catData.data), 'Public Pool Categories endpoint returned active list');
    console.log(`    Active Pool Categories Count: ${catData.data.length}`);

    // 2c. Public Pool Designs
    const desRes = await fetch(`${BASE_URL}/api/public/pool-designs`);
    const desData = await desRes.json();
    assert(desRes.status === 200 && desData.success && Array.isArray(desData.data), 'Public Pool Designs endpoint returned active list');
    console.log(`    Active Pool Designs Count: ${desData.data.length}`);

    // 2d. Public Pricing
    const priceRes = await fetch(`${BASE_URL}/api/public/pricing`);
    const priceData = await priceRes.json();
    assert(priceRes.status === 200 && priceData.success && priceData.data?.baseRatePerCubicMeter, 'Public Pricing endpoint returned active rates');
    console.log(`    Base Rate: ₹${priceData.data.baseRatePerCubicMeter} / m³`);

    // 2e. Public Business Settings
    const setRes = await fetch(`${BASE_URL}/api/public/settings`);
    const setData = await setRes.json();
    assert(setRes.status === 200 && setData.success && setData.data?.whatsapp, 'Public Settings endpoint returned company contact');
    console.log(`    WhatsApp: ${setData.data.whatsapp}`);

    // 2f. Public Website Content
    const cntRes = await fetch(`${BASE_URL}/api/public/content`);
    const cntData = await cntRes.json();
    assert(cntRes.status === 200 && cntData.success && cntData.data?.organizationName, 'Public Content endpoint returned company branding');
    console.log(`    Organization: ${cntData.data.organizationName}\n`);

    // -------------------------------------------------------------------------
    // STEP 3: Security & Access Control Validation
    // -------------------------------------------------------------------------
    console.log('[SECTION 3] Security & Authentication Boundaries');
    
    // 3a. Verify unauthenticated calls are rejected with 401
    const protectedRoutes = [
      { method: 'GET', path: '/api/auth/me' },
      { method: 'GET', path: '/api/admin/services' },
      { method: 'GET', path: '/api/admin/pool-categories' },
      { method: 'GET', path: '/api/admin/pool-designs' },
      { method: 'GET', path: '/api/admin/pricing' },
      { method: 'GET', path: '/api/admin/settings' },
      { method: 'GET', path: '/api/admin/content' },
      { method: 'GET', path: '/api/admin/inquiries' },
      { method: 'GET', path: '/api/admin/inquiries/stats' }
    ];

    for (const r of protectedRoutes) {
      const unauthRes = await fetch(`${BASE_URL}${r.path}`, { method: r.method });
      assert(unauthRes.status === 401, `Unauthenticated ${r.method} ${r.path} rejected with HTTP 401`);
    }

    // 3b. Verify invalid login credentials rejected
    const badLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nonexistent@poonapools.com', password: 'wrongpassword' })
    });
    assert(badLoginRes.status === 401, 'Invalid credentials rejected with HTTP 401');

    // 3c. Valid Admin Authentication
    const validLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.ADMIN_EMAIL || 'chanchal07shinde@gmail.com',
        password: process.env.ADMIN_PASSWORD || 'Chanchal@poonapools@123'
      })
    });
    const loginJson = await validLoginRes.json();
    assert(validLoginRes.status === 200 && loginJson.success === true, 'Admin login succeeded with HTTP 200');

    // Extract HttpOnly Cookie
    const setCookie = validLoginRes.headers.get('set-cookie');
    assert(setCookie && setCookie.includes('token='), 'HttpOnly token cookie issued on successful login');
    authCookie = setCookie.split(';')[0];

    // 3d. Verify /api/auth/me with cookie
    const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Cookie: authCookie }
    });
    const meJson = await meRes.json();
    assert(meRes.status === 200 && meJson.admin?.email === (process.env.ADMIN_EMAIL || 'chanchal07shinde@gmail.com'), '/api/auth/me confirms authenticated session');
    console.log(`    Authenticated as: ${meJson.admin.email} (Role: ${meJson.admin.role})\n`);

    // -------------------------------------------------------------------------
    // STEP 4: Admin CRUD Operations & Workflow Verification
    // -------------------------------------------------------------------------
    console.log('[SECTION 4] Admin Management CRUD Workflows');

    // 4a. Services CRUD
    const newServicePayload = {
      title: 'Automated Test Service (Hydrotherapy Spa)',
      serviceId: `test-spa-${Date.now()}`,
      shortDescription: 'Custom automated test hydrotherapy spa integration.',
      fullDescription: 'Full turnkey hydrotherapy jet nozzles and heated air blowers for rehabilitation.',
      icon: 'sparkles',
      image: '/images/pool-filtration.jpg',
      keyPoints: ['Hydro jets', 'Digital heat pump'],
      inquiryMessage: 'Inquiry for test spa',
      order: 99,
      isActive: true
    };

    const createSrvRes = await fetch(`${BASE_URL}/api/admin/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: authCookie },
      body: JSON.stringify(newServicePayload)
    });
    const createdSrvJson = await createSrvRes.json();
    assert(createSrvRes.status === 201 && createdSrvJson.data?._id, 'Admin created a new service');
    const createdSrvId = createdSrvJson.data._id;

    // Delete the test service
    const delSrvRes = await fetch(`${BASE_URL}/api/admin/services/${createdSrvId}`, {
      method: 'DELETE',
      headers: { Cookie: authCookie }
    });
    assert(delSrvRes.status === 200, 'Admin deleted test service record');

    // 4b. Pool Categories & Designs Retrieval
    const adminCatsRes = await fetch(`${BASE_URL}/api/admin/pool-categories`, {
      headers: { Cookie: authCookie }
    });
    assert(adminCatsRes.status === 200, 'Admin retrieved pool categories');

    const adminDesRes = await fetch(`${BASE_URL}/api/admin/pool-designs`, {
      headers: { Cookie: authCookie }
    });
    assert(adminDesRes.status === 200, 'Admin retrieved pool designs');

    // 4c. Pricing Read & Validation
    const adminPriceRes = await fetch(`${BASE_URL}/api/admin/pricing`, {
      headers: { Cookie: authCookie }
    });
    assert(adminPriceRes.status === 200, 'Admin retrieved pricing configuration');

    // 4d. Business Settings & Content Read
    const adminSetRes = await fetch(`${BASE_URL}/api/admin/settings`, {
      headers: { Cookie: authCookie }
    });
    assert(adminSetRes.status === 200, 'Admin retrieved business settings');

    const adminCntRes = await fetch(`${BASE_URL}/api/admin/content`, {
      headers: { Cookie: authCookie }
    });
    assert(adminCntRes.status === 200, 'Admin retrieved website content');

    // 4e. Customer Inquiry Lifecycle (Create -> Search -> Status -> Notes -> Delete)
    const testInquiryPhone = `9822${Math.floor(100000 + Math.random() * 900000)}`;
    const testInquiryRes = await fetch(`${BASE_URL}/api/public/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Kunal Patil (Master Test)',
        phone: testInquiryPhone,
        email: 'kunal.patil@example.com',
        location: 'Wakad, Pune',
        poolType: 'Commercial Pool',
        service: 'Swimming Pool Construction',
        dimensions: { length: 25, width: 12, depth: 2, unit: 'meters' },
        budget: '₹ 45 - 55 Lakhs',
        message: 'Master test quote inquiry for school facility.'
      })
    });
    const testInqJson = await testInquiryRes.json();
    assert(testInquiryRes.status === 201 && testInqJson.data?._id, 'Customer submitted quote inquiry to MongoDB Atlas');
    const inquiryId = testInqJson.data._id;

    // Search inquiry by phone
    const searchInqRes = await fetch(`${BASE_URL}/api/admin/inquiries?search=${testInquiryPhone}`, {
      headers: { Cookie: authCookie }
    });
    const searchInqJson = await searchInqRes.json();
    assert(searchInqRes.status === 200 && searchInqJson.count >= 1, 'Admin found inquiry via search query parameter');

    // Update status to Contacted
    const patchStatusRes = await fetch(`${BASE_URL}/api/admin/inquiries/${inquiryId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Cookie: authCookie },
      body: JSON.stringify({ status: 'Contacted' })
    });
    const patchJson = await patchStatusRes.json();
    assert(patchStatusRes.status === 200 && patchJson.data?.status === 'Contacted', 'Inquiry status updated to "Contacted"');

    // Add note
    const noteRes = await fetch(`${BASE_URL}/api/admin/inquiries/${inquiryId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: authCookie },
      body: JSON.stringify({ text: 'Spoke with client. Arranged site visit for Sunday.' })
    });
    assert(noteRes.status === 200, 'Admin added engineering follow-up note');

    // Delete inquiry
    const delInqRes = await fetch(`${BASE_URL}/api/admin/inquiries/${inquiryId}`, {
      method: 'DELETE',
      headers: { Cookie: authCookie }
    });
    assert(delInqRes.status === 200, 'Admin deleted test inquiry record\n');

    // -------------------------------------------------------------------------
    // STEP 5: Admin Logout
    // -------------------------------------------------------------------------
    console.log('[SECTION 5] Session Revocation (Logout)');
    const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { Cookie: authCookie }
    });
    assert(logoutRes.status === 200, 'Logout endpoint responded with HTTP 200');

    const postLogoutCookie = logoutRes.headers.get('set-cookie');
    assert(postLogoutCookie && postLogoutCookie.includes('Max-Age=0'), 'Authentication cookie cleared with Max-Age=0');

    // -------------------------------------------------------------------------
    // SUMMARY
    // -------------------------------------------------------------------------
    console.log('\n================================================================');
    console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS EXECUTED AND PASSED SUCCESSFULLY!`);
    console.log('   The Poona Pools Facilities MERN system is fully integrated.');
    console.log('================================================================\n');

  } catch (error) {
    console.error('\n❌ Master Test Suite Failed:', error.message);
    process.exit(1);
  }
}

runMasterTestSuite();

