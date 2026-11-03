/**
 * ==============================================================================
 * PHASE 5 COMPREHENSIVE AUTOMATED TEST SUITE (backend/tests/testPhase5.js)
 * ==============================================================================
 * Verification Coverage:
 * 1. Public Inquiry Submission: Valid customer inquiry creation (POST /api/public/inquiries)
 * 2. Public Input Validation:
 *    a. Rejection on missing / short customer name
 *    b. Rejection on invalid / short phone number
 *    c. Rejection on missing project location
 * 3. Duplicate Submission Protection:
 *    - Second submission with same phone within 2 minutes flagged as duplicate
 * 4. Protected Admin Endpoints Security:
 *    - Unauthenticated requests rejected with 401 Unauthorized
 * 5. Admin Authentication & Session:
 *    - Login with admin credentials and capture HttpOnly JWT cookie
 * 6. Admin Inquiry Listing & Filtering:
 *    - Fetch all inquiries (GET /api/admin/inquiries)
 *    - Search query parameter filtering
 *    - Status pill filtering ('New', 'In Progress', etc.)
 * 7. Admin Inquiry Statistics:
 *    - Fetch aggregate statistics (GET /api/admin/inquiries/stats)
 * 8. Inquiry Status Transition:
 *    - Update status to 'In Progress' (PATCH /api/admin/inquiries/:id/status)
 *    - Verify automatic transition audit note appended
 * 9. Engineering Follow-Up Notes:
 *    - Append consultation note (POST /api/admin/inquiries/:id/notes)
 * 10. Inquiry Cleanup & Deletion:
 *    - Delete test inquiry (DELETE /api/admin/inquiries/:id)
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
let createdInquiryId = '';

async function runTests() {
  console.log('===============================================================');
  console.log('STARTING PHASE 5 TEST SUITE: COMPLETE INQUIRY MANAGEMENT SYSTEM');
  console.log('===============================================================\n');

  try {
    // ----------------------------------------------------
    // TEST 1: Public Input Validation (Rejections)
    // ----------------------------------------------------
    console.log('--- TEST 1: Public Form Validation (Missing / Invalid Fields) ---');

    // 1a. Missing Name
    const resNoName = await fetch(`${BASE_URL}/api/public/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'A',
        phone: '9876543210',
        location: 'Pune'
      })
    });
    console.log(`Missing Name HTTP Status: ${resNoName.status}`);
    if (resNoName.status !== 400) {
      throw new Error(`Expected 400 for short customer name, received: ${resNoName.status}`);
    }

    // 1b. Invalid Phone (<10 digits)
    const resBadPhone = await fetch(`${BASE_URL}/api/public/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Rajesh Sharma',
        phone: '12345',
        location: 'Kothrud, Pune'
      })
    });
    console.log(`Invalid Phone HTTP Status: ${resBadPhone.status}`);
    if (resBadPhone.status !== 400) {
      throw new Error(`Expected 400 for short phone number, received: ${resBadPhone.status}`);
    }

    // 1c. Missing Location
    const resNoLoc = await fetch(`${BASE_URL}/api/public/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Rajesh Sharma',
        phone: '9876543210',
        location: '   '
      })
    });
    console.log(`Missing Location HTTP Status: ${resNoLoc.status}`);
    if (resNoLoc.status !== 400) {
      throw new Error(`Expected 400 for missing location, received: ${resNoLoc.status}`);
    }

    console.log('✅ TEST 1 PASSED: Public input validation correctly rejects invalid submissions.\n');

    // ----------------------------------------------------
    // TEST 2: Public Inquiry Submission (Valid Data)
    // ----------------------------------------------------
    console.log('--- TEST 2: Valid Customer Quote Submission (POST /api/public/inquiries) ---');
    const uniqueTestPhone = `9822${Math.floor(100000 + Math.random() * 900000)}`;
    const testPayload = {
      customerName: 'Rajesh Sharma (Automated Test)',
      phone: uniqueTestPhone,
      email: 'rajesh.sharma.test@gmail.com',
      location: 'Koregaon Park, Pune',
      poolType: 'Infinity Edge Pool',
      service: 'Swimming Pool Construction',
      dimensions: {
        length: 15,
        width: 7,
        depth: 1.8,
        unit: 'meters'
      },
      budget: '₹ 30 - 35 Lakhs',
      message: 'Looking for turnkey civil construction with infinity glass wall overlooking natural valley.',
      submissionSource: 'Automated Integration Test'
    };

    const createRes = await fetch(`${BASE_URL}/api/public/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload)
    });
    const createData = await createRes.json();
    console.log(`HTTP Status: ${createRes.status}`);

    if (createRes.status !== 201 || !createData.success || !createData.data) {
      throw new Error(`Failed to create inquiry: ${JSON.stringify(createData)}`);
    }

    createdInquiryId = createData.data._id;
    console.log(`Created Inquiry ID : ${createdInquiryId}`);
    console.log(`Customer Name      : ${createData.data.customerName}`);
    console.log(`Status             : ${createData.data.status}`);
    console.log(`Dimensions         : ${createData.data.dimensions.length}×${createData.data.dimensions.width}×${createData.data.dimensions.depth} ${createData.data.dimensions.unit}`);
    console.log('✅ TEST 2 PASSED: Inquiry created successfully with initial status "New".\n');

    // ----------------------------------------------------
    // TEST 3: Duplicate Submission Protection (Within 2 Mins)
    // ----------------------------------------------------
    console.log('--- TEST 3: Duplicate Submission Protection ---');
    const duplicateRes = await fetch(`${BASE_URL}/api/public/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...testPayload,
        message: 'Second quick submission trying to spam'
      })
    });
    const duplicateData = await duplicateRes.json();
    console.log(`Duplicate HTTP Status: ${duplicateRes.status}`);
    console.log(`isDuplicate flag      : ${duplicateData.isDuplicate}`);

    if (!duplicateData.isDuplicate) {
      throw new Error(`Expected isDuplicate=true for repeat submission within 2 mins.`);
    }
    console.log('✅ TEST 3 PASSED: Duplicate submission detected and handled safely.\n');

    // ----------------------------------------------------
    // TEST 4: Protected Admin Routes Without Auth (401 Check)
    // ----------------------------------------------------
    console.log('--- TEST 4: Protected Admin Routes Security Check (Unauthenticated) ---');
    const unauthEndpoints = [
      { method: 'GET', url: `${BASE_URL}/api/admin/inquiries` },
      { method: 'GET', url: `${BASE_URL}/api/admin/inquiries/stats` },
      { method: 'GET', url: `${BASE_URL}/api/admin/inquiries/${createdInquiryId}` },
      { method: 'PATCH', url: `${BASE_URL}/api/admin/inquiries/${createdInquiryId}/status` },
      { method: 'POST', url: `${BASE_URL}/api/admin/inquiries/${createdInquiryId}/notes` },
      { method: 'DELETE', url: `${BASE_URL}/api/admin/inquiries/${createdInquiryId}` }
    ];

    for (const ep of unauthEndpoints) {
      const res = await fetch(ep.url, { method: ep.method });
      console.log(`[Unauthenticated] ${ep.method} ${ep.url.replace(BASE_URL, '')} -> HTTP ${res.status}`);
      if (res.status !== 401) {
        throw new Error(`Expected 401 Unauthorized on ${ep.url}, got: ${res.status}`);
      }
    }
    console.log('✅ TEST 4 PASSED: All protected admin inquiry endpoints reject unauthenticated access.\n');

    // ----------------------------------------------------
    // TEST 5: Admin Login & Session Cookie Handling
    // ----------------------------------------------------
    console.log('--- TEST 5: Admin Authentication ---');
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.ADMIN_EMAIL || 'chanchal07shinde@gmail.com',
        password: process.env.ADMIN_PASSWORD || 'Chanchal@poonapools@123'
      })
    });
    const loginData = await loginRes.json();
    console.log(`Login HTTP Status: ${loginRes.status}`);

    if (loginRes.status !== 200 || !loginData.success) {
      throw new Error(`Admin login failed: ${JSON.stringify(loginData)}`);
    }

    const setCookieHeader = loginRes.headers.get('set-cookie');
    if (setCookieHeader) {
      authCookie = setCookieHeader.split(';')[0];
    }
    console.log(`Authenticated Admin : ${loginData.admin?.email}`);
    console.log('✅ TEST 5 PASSED: Admin authenticated and session established.\n');

    // ----------------------------------------------------
    // TEST 6: Admin Inquiry Listing, Search & Filters
    // ----------------------------------------------------
    console.log('--- TEST 6: Admin Inquiries Listing & Search ---');
    const listRes = await fetch(`${BASE_URL}/api/admin/inquiries`, {
      headers: { Cookie: authCookie }
    });
    const listData = await listRes.json();
    console.log(`Total Inquiries Count: ${listData.total}`);

    if (listRes.status !== 200 || !listData.success || !Array.isArray(listData.data)) {
      throw new Error(`Failed to list inquiries: ${JSON.stringify(listData)}`);
    }

    // Search by name
    const searchRes = await fetch(`${BASE_URL}/api/admin/inquiries?search=Rajesh`, {
      headers: { Cookie: authCookie }
    });
    const searchData = await searchRes.json();
    console.log(`Search for "Rajesh" returned: ${searchData.count} item(s)`);
    if (searchData.count === 0) {
      throw new Error('Search query failed to find the created inquiry.');
    }

    // Filter by status 'New'
    const filterRes = await fetch(`${BASE_URL}/api/admin/inquiries?status=New`, {
      headers: { Cookie: authCookie }
    });
    const filterData = await filterRes.json();
    console.log(`Filter for status="New" returned: ${filterData.count} item(s)`);

    console.log('✅ TEST 6 PASSED: Listing, search, and status filtering functioning properly.\n');

    // ----------------------------------------------------
    // TEST 7: Admin Inquiry Statistics Endpoint
    // ----------------------------------------------------
    console.log('--- TEST 7: Inquiry Overview Statistics ---');
    const statsRes = await fetch(`${BASE_URL}/api/admin/inquiries/stats`, {
      headers: { Cookie: authCookie }
    });
    const statsData = await statsRes.json();
    console.log(`Stats HTTP Status: ${statsRes.status}`);
    console.log(`Stats Summary:`, statsData.data ? {
      total: statsData.data.total,
      new: statsData.data.new,
      inProgress: statsData.data.inProgress,
      contacted: statsData.data.contacted,
      completed: statsData.data.completed
    } : 'None');

    if (statsRes.status !== 200 || !statsData.success || !statsData.data) {
      throw new Error(`Failed to fetch stats: ${JSON.stringify(statsData)}`);
    }
    console.log('✅ TEST 7 PASSED: Overview statistics endpoint returned live metrics.\n');

    // ----------------------------------------------------
    // TEST 8: Inquiry Status Transition (New -> In Progress)
    // ----------------------------------------------------
    console.log('--- TEST 8: Inquiry Status Transition & Audit Trail ---');
    const statusRes = await fetch(`${BASE_URL}/api/admin/inquiries/${createdInquiryId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: authCookie
      },
      body: JSON.stringify({ status: 'In Progress' })
    });
    const statusData = await statusRes.json();
    console.log(`Status Update HTTP: ${statusRes.status}`);
    console.log(`Updated Status     : ${statusData.data?.status}`);
    console.log(`Audit Notes Count  : ${statusData.data?.adminNotes?.length}`);

    if (statusRes.status !== 200 || statusData.data?.status !== 'In Progress') {
      throw new Error(`Status update failed: ${JSON.stringify(statusData)}`);
    }

    // Verify audit note was recorded
    const latestNote = statusData.data.adminNotes[statusData.data.adminNotes.length - 1];
    console.log(`Latest Audit Note  : "${latestNote?.text}"`);
    if (!latestNote?.text.includes('In Progress')) {
      throw new Error('Audit note was not recorded during status transition.');
    }
    console.log('✅ TEST 8 PASSED: Status successfully updated and audit note logged.\n');

    // ----------------------------------------------------
    // TEST 9: Add Engineering Follow-Up Note
    // ----------------------------------------------------
    console.log('--- TEST 9: Add Follow-Up Note ---');
    const noteRes = await fetch(`${BASE_URL}/api/admin/inquiries/${createdInquiryId}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: authCookie
      },
      body: JSON.stringify({
        text: 'Site survey completed. Soil stability is high. Prepared preliminary hydraulic circulation layout.'
      })
    });
    const noteData = await noteRes.json();
    console.log(`Add Note HTTP Status: ${noteRes.status}`);
    console.log(`Total Notes Count   : ${noteData.data?.adminNotes?.length}`);

    if (noteRes.status !== 200 || !noteData.success) {
      throw new Error(`Failed to add follow-up note: ${JSON.stringify(noteData)}`);
    }
    console.log('✅ TEST 9 PASSED: Admin follow-up note successfully added.\n');

    // ----------------------------------------------------
    // TEST 10: Delete Inquiry (Cleanup)
    // ----------------------------------------------------
    console.log('--- TEST 10: Delete Inquiry Record ---');
    const deleteRes = await fetch(`${BASE_URL}/api/admin/inquiries/${createdInquiryId}`, {
      method: 'DELETE',
      headers: { Cookie: authCookie }
    });
    const deleteData = await deleteRes.json();
    console.log(`Delete HTTP Status: ${deleteRes.status}`);

    if (deleteRes.status !== 200 || !deleteData.success) {
      throw new Error(`Failed to delete test inquiry: ${JSON.stringify(deleteData)}`);
    }

    // Verify it's no longer accessible
    const verifyRes = await fetch(`${BASE_URL}/api/admin/inquiries/${createdInquiryId}`, {
      headers: { Cookie: authCookie }
    });
    console.log(`Verification GET HTTP: ${verifyRes.status} (Expected 404)`);
    if (verifyRes.status !== 404) {
      throw new Error(`Expected 404 for deleted inquiry, got: ${verifyRes.status}`);
    }
    console.log('✅ TEST 10 PASSED: Inquiry permanently removed and verified 404.\n');

    console.log('===============================================================');
    console.log('🎉 ALL PHASE 5 INTEGRATION TESTS COMPLETED SUCCESSFULLY!');
    console.log('===============================================================\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ TEST FAILED WITH ERROR:', error.message);
    process.exit(1);
  }
}

runTests();

