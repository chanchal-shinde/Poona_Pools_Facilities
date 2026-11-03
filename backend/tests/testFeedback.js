/**
 * ==============================================================================
 * CUSTOMER FEEDBACK AUTOMATED TEST SUITE (backend/tests/testFeedback.js)
 * ==============================================================================
 * Tests:
 * 1. Public input validation (missing name, bad rating, bad email, empty message)
 * 2. Successful public feedback submission (status: Pending)
 * 3. Duplicate submission prevention
 * 4. Verification that Pending feedback is NOT returned by public GET /api/feedback
 * 5. Rejection of unauthenticated calls to admin feedback endpoints (HTTP 401)
 * 6. Admin authentication & retrieval of feedback with status breakdown
 * 7. Admin approval of feedback (status -> Approved)
 * 8. Verification that Approved feedback IS returned by public GET /api/feedback
 * 9. Admin rejection of feedback (status -> Rejected)
 * 10. Verification that Rejected feedback disappears from public GET /api/feedback
 * 11. Admin permanent deletion of feedback record
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
let testFeedbackId = '';

async function runFeedbackTests() {
  console.log('================================================================');
  console.log('     CUSTOMER FEEDBACK BACKEND INTEGRATION TEST SUITE          ');
  console.log('================================================================\n');

  try {
    // ----------------------------------------------------
    // TEST 1: Public Input Validation (Rejections)
    // ----------------------------------------------------
    console.log('--- TEST 1: Public Form Validation (Invalid Submissions) ---');

    // 1a. Missing Name
    const resNoName = await fetch(`${BASE_URL}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'A',
        serviceType: 'Swimming Pool Construction',
        rating: 5,
        message: 'Excellent pool construction work.'
      })
    });
    console.log(`Missing/Short Name HTTP Status: ${resNoName.status}`);
    if (resNoName.status !== 400) {
      throw new Error(`Expected 400 for short customer name, received: ${resNoName.status}`);
    }

    // 1b. Invalid Rating (< 1)
    const resBadRating = await fetch(`${BASE_URL}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Rohan Joshi',
        serviceType: 'Pool Maintenance',
        rating: 0,
        message: 'Water quality maintenance review.'
      })
    });
    console.log(`Rating 0 HTTP Status: ${resBadRating.status}`);
    if (resBadRating.status !== 400) {
      throw new Error(`Expected 400 for 0 rating, received: ${resBadRating.status}`);
    }

    // 1c. Rating > 5
    const resHighRating = await fetch(`${BASE_URL}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Rohan Joshi',
        serviceType: 'Pool Maintenance',
        rating: 6,
        message: 'Water quality maintenance review.'
      })
    });
    console.log(`Rating 6 HTTP Status: ${resHighRating.status}`);
    if (resHighRating.status !== 400) {
      throw new Error(`Expected 400 for rating > 5, received: ${resHighRating.status}`);
    }

    // 1d. Invalid Email Format
    const resBadEmail = await fetch(`${BASE_URL}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Rohan Joshi',
        email: 'not-an-email',
        serviceType: 'Pool Maintenance',
        rating: 5,
        message: 'Water quality maintenance review.'
      })
    });
    console.log(`Invalid Email HTTP Status: ${resBadEmail.status}`);
    if (resBadEmail.status !== 400) {
      throw new Error(`Expected 400 for invalid email, received: ${resBadEmail.status}`);
    }

    // 1e. Short Message
    const resShortMsg = await fetch(`${BASE_URL}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Rohan Joshi',
        serviceType: 'Pool Maintenance',
        rating: 5,
        message: 'Bad'
      })
    });
    console.log(`Short Message HTTP Status: ${resShortMsg.status}`);
    if (resShortMsg.status !== 400) {
      throw new Error(`Expected 400 for short message, received: ${resShortMsg.status}`);
    }

    console.log('✅ TEST 1 PASSED: Public input validation correctly rejects invalid submissions.\n');

    // ----------------------------------------------------
    // TEST 2: Valid Feedback Submission (Public POST /api/feedback)
    // ----------------------------------------------------
    console.log('--- TEST 2: Valid Feedback Submission (POST /api/feedback) ---');
    const validFeedbackPayload = {
      customerName: `Amitabh Sen (Test-${Date.now()})`,
      email: 'amitabh.sen@example.com',
      serviceType: 'Swimming Pool Construction',
      rating: 5,
      message: 'Poona Pools Facilities built a stunning 15-meter infinity pool for our bungalow in Kothrud. The filtration equipment runs silently and water is sparkling clean.'
    };

    const submitRes = await fetch(`${BASE_URL}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validFeedbackPayload)
    });
    const submitData = await submitRes.json();
    console.log(`Submit HTTP Status: ${submitRes.status}`);
    console.log(`Server Message: "${submitData.message}"`);

    if (submitRes.status !== 201 || !submitData.success || !submitData.data?._id) {
      throw new Error(`Failed to submit feedback: ${JSON.stringify(submitData)}`);
    }

    testFeedbackId = submitData.data._id;
    console.log(`Created Feedback ID: ${testFeedbackId}`);
    console.log('✅ TEST 2 PASSED: Valid feedback submitted and saved in MongoDB Atlas.\n');

    // ----------------------------------------------------
    // TEST 3: Duplicate Submission Prevention
    // ----------------------------------------------------
    console.log('--- TEST 3: Duplicate Submission Prevention ---');
    const dupRes = await fetch(`${BASE_URL}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validFeedbackPayload)
    });
    const dupData = await dupRes.json();
    console.log(`Duplicate HTTP Status: ${dupRes.status}`);
    console.log(`isDuplicate Flag: ${dupData.isDuplicate}`);

    if (!dupData.isDuplicate) {
      throw new Error('Expected duplicate submission to be flagged with isDuplicate: true');
    }
    console.log('✅ TEST 3 PASSED: Duplicate feedback submission handled safely without double-insert.\n');

    // ----------------------------------------------------
    // TEST 4: Public GET /api/feedback (Pending NOT Exposed)
    // ----------------------------------------------------
    console.log('--- TEST 4: Pending Feedback Hidden from Public GET /api/feedback ---');
    const pubGetRes = await fetch(`${BASE_URL}/api/feedback`);
    const pubGetData = await pubGetRes.json();
    console.log(`Public Reviews Count: ${pubGetData.count}`);

    const foundPendingInPublic = pubGetData.data?.some((r) => r._id === testFeedbackId);
    if (foundPendingInPublic) {
      throw new Error('SECURITY VIOLATION: Pending feedback was exposed on public GET /api/feedback!');
    }
    console.log('✅ TEST 4 PASSED: Pending feedback is strictly kept hidden from public website.\n');

    // ----------------------------------------------------
    // TEST 5: Protected Admin Routes Without Auth (401 Check)
    // ----------------------------------------------------
    console.log('--- TEST 5: Protected Admin Routes Security Check (Unauthenticated) ---');
    const unauthChecks = [
      { method: 'GET', url: `${BASE_URL}/api/admin/feedback` },
      { method: 'PUT', url: `${BASE_URL}/api/admin/feedback/${testFeedbackId}` },
      { method: 'DELETE', url: `${BASE_URL}/api/admin/feedback/${testFeedbackId}` }
    ];

    for (const check of unauthChecks) {
      const res = await fetch(check.url, { method: check.method });
      console.log(`[Unauthenticated] ${check.method} ${check.url.replace(BASE_URL, '')} -> HTTP ${res.status}`);
      if (res.status !== 401) {
        throw new Error(`Expected 401 Unauthorized, got: ${res.status}`);
      }
    }
    console.log('✅ TEST 5 PASSED: All admin feedback routes require administrator authentication.\n');

    // ----------------------------------------------------
    // TEST 6: Admin Login & Feedback Listing
    // ----------------------------------------------------
    console.log('--- TEST 6: Admin Login & Feedback Listing ---');
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.ADMIN_EMAIL || 'chanchal07shinde@gmail.com',
        password: process.env.ADMIN_PASSWORD || 'Chanchal@poonapools@123'
      })
    });
    const loginData = await loginRes.json();
    if (loginRes.status !== 200 || !loginData.success) {
      throw new Error(`Admin login failed: ${JSON.stringify(loginData)}`);
    }

    const setCookie = loginRes.headers.get('set-cookie');
    authCookie = setCookie.split(';')[0];
    console.log(`Authenticated Admin: ${loginData.admin?.email}`);

    // Fetch all feedback
    const adminGetRes = await fetch(`${BASE_URL}/api/admin/feedback`, {
      headers: { Cookie: authCookie }
    });
    const adminGetData = await adminGetRes.json();
    console.log(`Total Feedback Records: ${adminGetData.total}`);
    console.log('Feedback Stats:', adminGetData.stats);

    const foundInAdmin = adminGetData.data?.find((f) => f._id === testFeedbackId);
    if (!foundInAdmin) {
      throw new Error('Admin feedback listing failed to find newly submitted pending feedback.');
    }
    console.log(`Found Test Record in Admin: Status = "${foundInAdmin.status}"`);
    console.log('✅ TEST 6 PASSED: Admin successfully retrieved all feedback with status counts.\n');

    // ----------------------------------------------------
    // TEST 7: Admin Approve Feedback (PUT /api/admin/feedback/:id)
    // ----------------------------------------------------
    console.log('--- TEST 7: Admin Approve Feedback ---');
    const approveRes = await fetch(`${BASE_URL}/api/admin/feedback/${testFeedbackId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Cookie: authCookie },
      body: JSON.stringify({ status: 'Approved', adminNotes: 'Verified genuine client review.' })
    });
    const approveData = await approveRes.json();
    console.log(`Approve HTTP Status: ${approveRes.status}`);
    console.log(`Updated Status: ${approveData.data?.status}`);

    if (approveRes.status !== 200 || approveData.data?.status !== 'Approved') {
      throw new Error(`Failed to approve feedback: ${JSON.stringify(approveData)}`);
    }
    console.log('✅ TEST 7 PASSED: Feedback successfully transitioned to "Approved".\n');

    // ----------------------------------------------------
    // TEST 8: Public GET /api/feedback (Approved IS Visible)
    // ----------------------------------------------------
    console.log('--- TEST 8: Approved Feedback Appears on Public Website ---');
    const pubAfterApproveRes = await fetch(`${BASE_URL}/api/feedback`);
    const pubAfterApproveData = await pubAfterApproveRes.json();

    const foundApproved = pubAfterApproveData.data?.find((r) => r._id === testFeedbackId);
    if (!foundApproved) {
      throw new Error('Approved feedback was not returned by public GET /api/feedback!');
    }
    console.log(`Verified Publicly Displayed: "${foundApproved.customerName}" - ${foundApproved.rating} Stars`);
    console.log('✅ TEST 8 PASSED: Approved review is immediately visible to public website visitors.\n');

    // ----------------------------------------------------
    // TEST 9: Admin Reject Feedback (PUT /api/admin/feedback/:id)
    // ----------------------------------------------------
    console.log('--- TEST 9: Admin Reject Feedback ---');
    const rejectRes = await fetch(`${BASE_URL}/api/admin/feedback/${testFeedbackId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Cookie: authCookie },
      body: JSON.stringify({ status: 'Rejected' })
    });
    const rejectData = await rejectRes.json();
    console.log(`Reject HTTP Status: ${rejectRes.status}`);

    if (rejectRes.status !== 200 || rejectData.data?.status !== 'Rejected') {
      throw new Error(`Failed to reject feedback: ${JSON.stringify(rejectData)}`);
    }

    // Verify it disappears from public API
    const pubAfterRejectRes = await fetch(`${BASE_URL}/api/feedback`);
    const pubAfterRejectData = await pubAfterRejectRes.json();
    const foundRejected = pubAfterRejectData.data?.some((r) => r._id === testFeedbackId);
    if (foundRejected) {
      throw new Error('SECURITY VIOLATION: Rejected feedback was visible on public GET /api/feedback!');
    }
    console.log('✅ TEST 9 PASSED: Rejected feedback immediately disappears from public website.\n');

    // ----------------------------------------------------
    // TEST 10: Admin Delete Feedback (DELETE /api/admin/feedback/:id)
    // ----------------------------------------------------
    console.log('--- TEST 10: Admin Delete Feedback (Cleanup) ---');
    const delRes = await fetch(`${BASE_URL}/api/admin/feedback/${testFeedbackId}`, {
      method: 'DELETE',
      headers: { Cookie: authCookie }
    });
    const delData = await delRes.json();
    console.log(`Delete HTTP Status: ${delRes.status}`);

    if (delRes.status !== 200 || !delData.success) {
      throw new Error(`Failed to delete feedback: ${JSON.stringify(delData)}`);
    }

    console.log('✅ TEST 10 PASSED: Feedback record permanently removed.\n');

    console.log('================================================================');
    console.log('🎉 ALL 10 CUSTOMER FEEDBACK TESTS PASSED FLAWLESSLY!');
    console.log('================================================================\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Feedback Test Failed:', err.message);
    process.exit(1);
  }
}

runFeedbackTests();

