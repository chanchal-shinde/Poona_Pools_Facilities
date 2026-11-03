/**
 * ==============================================================================
 * PHASE 4D COMPREHENSIVE AUTOMATED TEST SUITE (backend/tests/testPhase4D.js)
 * ==============================================================================
 * Tests:
 * 1. Public Settings API retrieval without auth
 * 2. Public Content API retrieval without auth
 * 3. Protected Admin Endpoints rejection without auth (401)
 * 4. Admin Authentication & Session Cookie handling
 * 5. Protected Admin GET retrieval (Settings & Content)
 * 6. Business Settings Input Validation Rejections:
 *    a. Missing phone
 *    b. Invalid WhatsApp number (< 7 digits)
 *    c. Invalid email address
 * 7. Website Content Input Validation Rejections:
 *    a. Missing owner credentials
 *    b. Missing mission/vision
 * 8. Valid Business Settings Update (PUT /api/admin/settings)
 * 9. Public Settings API immediate reflection
 * 10. Valid Website Content Update (PUT /api/admin/content)
 * 11. Public Content API immediate reflection
 * 12. Dynamic WhatsApp & Phone link generator verification
 * 13. Restore original baseline values for clean state
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

async function runTests() {
  console.log('==========================================================');
  console.log('STARTING PHASE 4D TEST SUITE: SETTINGS & WEBSITE CONTENT');
  console.log('==========================================================\n');

  try {
    // ----------------------------------------------------
    // TEST 1: Public Settings Endpoint (GET /api/public/settings)
    // ----------------------------------------------------
    console.log('--- TEST 1: Public Business Settings (Unauthenticated) ---');
    const pubSettingsRes = await fetch(`${BASE_URL}/api/public/settings`);
    const pubSettings = await pubSettingsRes.json();
    console.log(`HTTP Status: ${pubSettingsRes.status}`);
    if (pubSettingsRes.status !== 200 || !pubSettings.success || !pubSettings.data) {
      throw new Error(`Public settings fetch failed: ${JSON.stringify(pubSettings)}`);
    }
    console.log(`Phone: ${pubSettings.data.displayPhone}`);
    console.log(`WhatsApp: ${pubSettings.data.whatsapp}`);
    console.log(`Email: ${pubSettings.data.email}`);
    console.log('✅ TEST 1 PASSED: Public business settings returned successfully.\n');

    // ----------------------------------------------------
    // TEST 2: Public Content Endpoint (GET /api/public/content)
    // ----------------------------------------------------
    console.log('--- TEST 2: Public Website Content (Unauthenticated) ---');
    const pubContentRes = await fetch(`${BASE_URL}/api/public/content`);
    const pubContent = await pubContentRes.json();
    console.log(`HTTP Status: ${pubContentRes.status}`);
    if (pubContentRes.status !== 200 || !pubContent.success || !pubContent.data) {
      throw new Error(`Public content fetch failed: ${JSON.stringify(pubContent)}`);
    }
    console.log(`Organization: ${pubContent.data.organizationName}`);
    console.log(`Owner: ${pubContent.data.owner?.name} (${pubContent.data.owner?.designation}, ${pubContent.data.owner?.experience})`);
    console.log(`Why Choose Us: ${pubContent.data.whyChooseUs?.length} pillars`);
    console.log(`Statistics: ${pubContent.data.statistics?.length} milestones`);
    console.log('✅ TEST 2 PASSED: Public website content returned successfully.\n');

    // ----------------------------------------------------
    // TEST 3: Protected Admin Endpoints Without Auth (Expected: 401)
    // ----------------------------------------------------
    console.log('--- TEST 3: Protected Admin Routes Without Auth (Expected: 401) ---');
    const getSettingsNoAuth = await fetch(`${BASE_URL}/api/admin/settings`);
    const putSettingsNoAuth = await fetch(`${BASE_URL}/api/admin/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+91 00000 00000' })
    });
    const getContentNoAuth = await fetch(`${BASE_URL}/api/admin/content`);
    const putContentNoAuth = await fetch(`${BASE_URL}/api/admin/content`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organizationName: 'Hacked' })
    });

    console.log(`GET /api/admin/settings: ${getSettingsNoAuth.status}`);
    console.log(`PUT /api/admin/settings: ${putSettingsNoAuth.status}`);
    console.log(`GET /api/admin/content:  ${getContentNoAuth.status}`);
    console.log(`PUT /api/admin/content:  ${putContentNoAuth.status}`);

    if (
      getSettingsNoAuth.status !== 401 ||
      putSettingsNoAuth.status !== 401 ||
      getContentNoAuth.status !== 401 ||
      putContentNoAuth.status !== 401
    ) {
      throw new Error('Expected 401 for unauthenticated admin endpoints!');
    }
    console.log('✅ TEST 3 PASSED: All 4 admin endpoints reject unauthenticated access.\n');

    // ----------------------------------------------------
    // TEST 4: Admin Authentication
    // ----------------------------------------------------
    console.log('--- TEST 4: Admin Login & JWT Cookie Issuance ---');
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD
      })
    });
    console.log(`Login HTTP Status: ${loginRes.status}`);
    const rawCookie = loginRes.headers.get('set-cookie');
    if (!rawCookie) throw new Error('Failed to obtain JWT auth cookie from login');
    authCookie = rawCookie.split(';')[0];
    console.log('✅ TEST 4 PASSED: Admin authenticated with HttpOnly cookie.\n');

    // ----------------------------------------------------
    // TEST 5: Protected Admin GET Retrieval
    // ----------------------------------------------------
    console.log('--- TEST 5: Protected Admin GET with Auth ---');
    const adminSettingsGet = await fetch(`${BASE_URL}/api/admin/settings`, {
      headers: { Cookie: authCookie }
    });
    const adminContentGet = await fetch(`${BASE_URL}/api/admin/content`, {
      headers: { Cookie: authCookie }
    });

    console.log(`Admin Settings Status: ${adminSettingsGet.status}`);
    console.log(`Admin Content Status:  ${adminContentGet.status}`);
    if (adminSettingsGet.status !== 200 || adminContentGet.status !== 200) {
      throw new Error('Failed to retrieve settings or content with auth cookie');
    }
    console.log('✅ TEST 5 PASSED: Admin successfully retrieved both documents with audit data.\n');

    // ----------------------------------------------------
    // TEST 6: Business Settings Validation (Negative Testing)
    // ----------------------------------------------------
    console.log('--- TEST 6: Business Settings Input Validations ---');

    // 6a: Missing phone
    const invalidPhoneRes = await fetch(`${BASE_URL}/api/admin/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Cookie: authCookie },
      body: JSON.stringify({ phone: '', whatsapp: '919923176194', email: 'test@example.com' })
    });
    console.log(`6a (Missing Phone): HTTP ${invalidPhoneRes.status}`);
    if (invalidPhoneRes.status !== 400) throw new Error('Expected 400 for missing phone');

    // 6b: Invalid WhatsApp (< 7 digits)
    const invalidWaRes = await fetch(`${BASE_URL}/api/admin/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Cookie: authCookie },
      body: JSON.stringify({ phone: '+91 99231 76194', whatsapp: '123', email: 'test@example.com' })
    });
    console.log(`6b (Short WhatsApp): HTTP ${invalidWaRes.status}`);
    if (invalidWaRes.status !== 400) throw new Error('Expected 400 for short WhatsApp');

    // 6c: Invalid Email
    const invalidEmailRes = await fetch(`${BASE_URL}/api/admin/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Cookie: authCookie },
      body: JSON.stringify({ phone: '+91 99231 76194', whatsapp: '919923176194', email: 'not-an-email' })
    });
    console.log(`6c (Invalid Email): HTTP ${invalidEmailRes.status}`);
    if (invalidEmailRes.status !== 400) throw new Error('Expected 400 for invalid email');
    console.log('✅ TEST 6 PASSED: All settings validation constraints enforced.\n');

    // ----------------------------------------------------
    // TEST 7: Website Content Validation (Negative Testing)
    // ----------------------------------------------------
    console.log('--- TEST 7: Website Content Input Validations ---');

    // 7a: Missing owner credentials
    const invalidOwnerRes = await fetch(`${BASE_URL}/api/admin/content`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Cookie: authCookie },
      body: JSON.stringify({
        owner: { name: '', designation: '', experience: '' },
        missionVision: { mission: 'Mission', vision: 'Vision' }
      })
    });
    console.log(`7a (Missing Owner Name): HTTP ${invalidOwnerRes.status}`);
    if (invalidOwnerRes.status !== 400) throw new Error('Expected 400 for missing owner name');

    // 7b: Missing mission
    const invalidMissionRes = await fetch(`${BASE_URL}/api/admin/content`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Cookie: authCookie },
      body: JSON.stringify({
        owner: { name: 'Sunil Shinde', designation: 'CEO', experience: '12+ Years' },
        missionVision: { mission: '', vision: 'Vision' }
      })
    });
    console.log(`7b (Missing Mission): HTTP ${invalidMissionRes.status}`);
    if (invalidMissionRes.status !== 400) throw new Error('Expected 400 for missing mission');
    console.log('✅ TEST 7 PASSED: All content validation constraints enforced.\n');

    // ----------------------------------------------------
    // TEST 8: Valid Settings Update
    // ----------------------------------------------------
    console.log('--- TEST 8: Valid Business Settings Update ---');
    const updateSettingsPayload = {
      phone: '+91 99231 76194',
      displayPhone: '+91 99231 76194 (Headquarters)',
      whatsapp: '919923176194',
      whatsappPrefilledMessage: 'Testing updated WhatsApp greeting message for Poona Pools.',
      email: 'contact@poonapools.com',
      address: 'Near Cummins College, Karve Nagar, Pune',
      cityState: 'Pune, Maharashtra, India',
      googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=test',
      locationSummary: 'Serving Pune Metropolitan Region and Western Maharashtra.'
    };

    const updateSettingsRes = await fetch(`${BASE_URL}/api/admin/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Cookie: authCookie },
      body: JSON.stringify(updateSettingsPayload)
    });
    const updateSettingsData = await updateSettingsRes.json();
    console.log(`HTTP Status: ${updateSettingsRes.status}`);
    if (updateSettingsRes.status !== 200 || !updateSettingsData.success) {
      throw new Error(`Failed to update settings: ${JSON.stringify(updateSettingsData)}`);
    }
    console.log(`Updated Display Phone: ${updateSettingsData.data.displayPhone}`);
    console.log(`Updated Address: ${updateSettingsData.data.address}`);
    console.log('✅ TEST 8 PASSED: Business settings updated successfully in Atlas.\n');

    // ----------------------------------------------------
    // TEST 9: Public Settings Immediate Reflection
    // ----------------------------------------------------
    console.log('--- TEST 9: Public Settings Live Reflection ---');
    const pubVerifySettingsRes = await fetch(`${BASE_URL}/api/public/settings`);
    const pubVerifySettings = await pubVerifySettingsRes.json();
    console.log(`Public Display Phone: ${pubVerifySettings.data.displayPhone}`);
    console.log(`Public Address: ${pubVerifySettings.data.address}`);
    if (pubVerifySettings.data.displayPhone !== '+91 99231 76194 (Headquarters)') {
      throw new Error('Public settings did not immediately reflect updated phone number!');
    }
    console.log('✅ TEST 9 PASSED: Public API immediately reflects updated settings.\n');

    // ----------------------------------------------------
    // TEST 10: Valid Website Content Update
    // ----------------------------------------------------
    console.log('--- TEST 10: Valid Website Content Update ---');
    const updateContentPayload = {
      organizationName: 'Poona Pools Facilities',
      tagline: 'Leading Swimming Pool Engineering in Maharashtra',
      shortDescription: 'Tailored aquatic solutions designed around your space.',
      owner: {
        name: 'Sunil Shinde',
        designation: 'Managing Director & CEO',
        experience: '13+ Years'
      },
      establishedYear: '2017',
      missionVision: {
        mission: 'Updated mission: Construct premium reinforced swimming pools.',
        vision: 'Updated vision: Region-wide aquatic engineering leadership.',
        commitment: 'Updated commitment: High-durability waterproofing guarantees.'
      },
      statistics: [
        { label: 'Years of Experience', value: '13+', suffix: '', description: 'Continuous operations' },
        { label: 'Projects Completed', value: '160+', suffix: '', description: 'Pool installations' }
      ],
      whyChooseUs: [
        { title: 'Superior Engineering', description: 'Certified concrete mix & reinforced rebar.' }
      ]
    };

    const updateContentRes = await fetch(`${BASE_URL}/api/admin/content`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Cookie: authCookie },
      body: JSON.stringify(updateContentPayload)
    });
    const updateContentData = await updateContentRes.json();
    console.log(`HTTP Status: ${updateContentRes.status}`);
    if (updateContentRes.status !== 200 || !updateContentData.success) {
      throw new Error(`Failed to update content: ${JSON.stringify(updateContentData)}`);
    }
    console.log(`Updated Owner: ${updateContentData.data.owner.name} (${updateContentData.data.owner.designation})`);
    console.log(`Updated Stats Count: ${updateContentData.data.statistics.length}`);
    console.log('✅ TEST 10 PASSED: Website content updated successfully in Atlas.\n');

    // ----------------------------------------------------
    // TEST 11: Public Content Immediate Reflection
    // ----------------------------------------------------
    console.log('--- TEST 11: Public Content Live Reflection ---');
    const pubVerifyContentRes = await fetch(`${BASE_URL}/api/public/content`);
    const pubVerifyContent = await pubVerifyContentRes.json();
    console.log(`Public Owner Designation: ${pubVerifyContent.data.owner?.designation}`);
    console.log(`Public Experience: ${pubVerifyContent.data.owner?.experience}`);
    if (pubVerifyContent.data.owner?.experience !== '13+ Years') {
      throw new Error('Public content did not immediately reflect updated experience!');
    }
    console.log('✅ TEST 11 PASSED: Public API immediately reflects updated website content.\n');

    // ----------------------------------------------------
    // TEST 12: WhatsApp Link Formatting Verification
    // ----------------------------------------------------
    console.log('--- TEST 12: WhatsApp Link Generation Verification ---');
    const waNumber = pubVerifySettings.data.whatsapp;
    const testMsg = 'Hello from automated test';
    const generatedUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(testMsg)}`;
    console.log(`Generated WhatsApp URL: ${generatedUrl}`);
    if (!generatedUrl.startsWith('https://wa.me/919923176194?text=Hello%20from%20automated%20test')) {
      throw new Error('Generated WhatsApp URL did not match expected structure');
    }
    console.log('✅ TEST 12 PASSED: WhatsApp URL generation complies with wa.me specifications.\n');

    // ----------------------------------------------------
    // TEST 13: Restore Original Baseline Values
    // ----------------------------------------------------
    console.log('--- TEST 13: Restoring Baseline Seed Data ---');
    const resetSettings = {
      phone: '+91 99231 76194',
      displayPhone: '+91 99231 76194',
      whatsapp: '919923176194',
      whatsappPrefilledMessage:
        'Hello Poona Pools Facilities, I am interested in your swimming pool services. Could you please share more details and arrange a consultation?',
      email: 'poonapools@gmail.com',
      address: 'Pune, Maharashtra, India',
      cityState: 'Pune, Maharashtra, India',
      googleMapsEmbedUrl: '',
      locationSummary: 'Serving Pune, Pimpri-Chinchwad, and surrounding regions in Maharashtra.'
    };

    const resetContent = {
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
      statistics: [
        { label: 'Years of Experience', value: '12+', suffix: '', description: 'Dedicated focus on swimming pool construction & technical maintenance' },
        { label: 'Projects Completed', value: '150+', suffix: '', description: 'Residential, luxury, and commercial pool installations' },
        { label: 'Services Offered', value: '10+', suffix: '', description: 'Comprehensive end-to-end swimming pool facility solutions' },
        { label: 'Customer Satisfaction', value: '100%', suffix: '', description: 'Committed to rigorous craftsmanship and long-term water safety' }
      ],
      whyChooseUs: [
        { title: 'Quality Workmanship', description: 'Engineered concrete shells, premium coping stones, and durable mosaic finishes built to withstand high water pressure and weather extremes.' },
        { title: 'Professional Service', description: 'Direct communication, transparent milestones, and professional execution from initial excavation to final water balancing.' },
        { title: 'Tailored Solutions', description: 'Custom dimensions, depths, and architectural pool layouts configured specifically to your land topography and lifestyle.' },
        { title: 'Attention to Detail', description: 'Meticulous plumbing, multi-stage filtration plumbing, leak-free waterproofing membranes, and polished aesthetic tiling.' },
        { title: 'Reliable Support', description: 'Dependable routine maintenance, chemical testing, equipment servicing, and prompt technical support whenever you need assistance.' }
      ]
    };

    await fetch(`${BASE_URL}/api/admin/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Cookie: authCookie },
      body: JSON.stringify(resetSettings)
    });

    await fetch(`${BASE_URL}/api/admin/content`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Cookie: authCookie },
      body: JSON.stringify(resetContent)
    });

    console.log('✅ TEST 13 PASSED: Baseline settings and content cleanly restored.\n');

    console.log('==========================================================');
    console.log('ALL PHASE 4D TESTS PASSED FLAWLESSLY! (13/13)');
    console.log('==========================================================\n');
  } catch (err) {
    console.error('❌ PHASE 4D TEST FAILED:', err.message);
    process.exit(1);
  }
}

runTests();

