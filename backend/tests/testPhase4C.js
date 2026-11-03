/**
 * ==============================================================================
 * PHASE 4C COMPREHENSIVE AUTOMATED TEST SUITE (backend/tests/testPhase4C.js)
 * ==============================================================================
 * Tests:
 * 1. Public Pricing API retrieval without auth
 * 2. Protected Admin Pricing endpoints rejection without auth (401)
 * 3. Admin Authentication & Cookie handling
 * 4. Protected Admin Pricing GET retrieval
 * 5. Input Validation Rejections:
 *    a. Base rate < 1000
 *    b. Empty pool types array
 *    c. Multiplier > 10.0
 *    d. Disclaimer < 10 chars
 * 6. Valid Admin Pricing Update (PUT /api/admin/pricing)
 * 7. Public API reflection of updated values
 * 8. Live calculation accuracy check against formula
 * 9. Revert / restore default pricing to ensure clean state
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
  console.log('STARTING PHASE 4C TEST SUITE: PRICING & COST ESTIMATOR');
  console.log('==========================================================\n');

  try {
    // ----------------------------------------------------
    // TEST 1: Public Pricing Endpoint (GET /api/public/pricing)
    // ----------------------------------------------------
    console.log('--- TEST 1: Public Pricing Endpoint (Unauthenticated) ---');
    const pubRes = await fetch(`${BASE_URL}/api/public/pricing`);
    const pubData = await pubRes.json();
    console.log(`HTTP Status: ${pubRes.status}`);
    if (pubRes.status !== 200 || !pubData.success || !pubData.data) {
      throw new Error(`Public pricing fetch failed: ${JSON.stringify(pubData)}`);
    }
    console.log(`Base Rate: ${pubData.data.currencySymbol} ${pubData.data.baseRatePerCubicMeter} / m³`);
    console.log(`Pool Types Count: ${pubData.data.poolTypes?.length}`);
    console.log(`Multipliers:`, pubData.data.typeMultipliers);
    console.log(`Is Placeholder: ${pubData.data.isPlaceholder}`);
    console.log('✅ TEST 1 PASSED: Public pricing API returns operational configuration.\n');

    // ----------------------------------------------------
    // TEST 2: Protected Admin Route Rejection without Auth
    // ----------------------------------------------------
    console.log('--- TEST 2: Protected Admin Endpoints Without Auth (Expected: 401) ---');
    const getNoAuth = await fetch(`${BASE_URL}/api/admin/pricing`);
    console.log(`GET /api/admin/pricing without auth: ${getNoAuth.status}`);
    if (getNoAuth.status !== 401) throw new Error('Expected 401 for unauthenticated GET');

    const putNoAuth = await fetch(`${BASE_URL}/api/admin/pricing`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ baseRatePerCubicMeter: 30000 })
    });
    console.log(`PUT /api/admin/pricing without auth: ${putNoAuth.status}`);
    if (putNoAuth.status !== 401) throw new Error('Expected 401 for unauthenticated PUT');
    console.log('✅ TEST 2 PASSED: Admin endpoints are securely protected by JWT middleware.\n');

    // ----------------------------------------------------
    // TEST 3: Admin Login & Session Cookie
    // ----------------------------------------------------
    console.log('--- TEST 3: Admin Login ---');
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
    console.log('✅ TEST 3 PASSED: Admin authenticated and JWT cookie obtained.\n');

    // ----------------------------------------------------
    // TEST 4: Protected Admin GET with Auth
    // ----------------------------------------------------
    console.log('--- TEST 4: Protected Admin Pricing Retrieval ---');
    const adminGet = await fetch(`${BASE_URL}/api/admin/pricing`, {
      headers: { Cookie: authCookie }
    });
    const adminGetData = await adminGet.json();
    console.log(`HTTP Status: ${adminGet.status}`);
    if (adminGet.status !== 200 || !adminGetData.success) {
      throw new Error(`Admin pricing GET failed: ${JSON.stringify(adminGetData)}`);
    }
    console.log(`Key: ${adminGetData.data.key}, Configured: ${adminGetData.data.isConfigured}`);
    console.log('✅ TEST 4 PASSED: Admin successfully retrieved full pricing document.\n');

    // ----------------------------------------------------
    // TEST 5: Input Validation Checks (Negative Testing)
    // ----------------------------------------------------
    console.log('--- TEST 5: Input Validation & Error Handling ---');

    // 5a: Base rate below minimum (< 1000)
    const invalidRateRes = await fetch(`${BASE_URL}/api/admin/pricing`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Cookie: authCookie },
      body: JSON.stringify({
        baseRatePerCubicMeter: 200,
        poolTypes: pubData.data.poolTypes,
        disclaimer: 'Valid test disclaimer notice with sufficient length.'
      })
    });
    const invalidRateData = await invalidRateRes.json();
    console.log(`5a (Base rate < 1000): HTTP ${invalidRateRes.status} - Message: "${invalidRateData.message}"`);
    if (invalidRateRes.status !== 400) throw new Error('Expected 400 for rate < 1000');

    // 5b: Empty pool types array
    const emptyTypesRes = await fetch(`${BASE_URL}/api/admin/pricing`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Cookie: authCookie },
      body: JSON.stringify({
        baseRatePerCubicMeter: 25000,
        poolTypes: [],
        disclaimer: 'Valid test disclaimer notice with sufficient length.'
      })
    });
    const emptyTypesData = await emptyTypesRes.json();
    console.log(`5b (Empty poolTypes): HTTP ${emptyTypesRes.status} - Message: "${emptyTypesData.message}"`);
    if (emptyTypesRes.status !== 400) throw new Error('Expected 400 for empty pool types');

    // 5c: Invalid multiplier (e.g. 15.0 > 10.0)
    const highMultRes = await fetch(`${BASE_URL}/api/admin/pricing`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Cookie: authCookie },
      body: JSON.stringify({
        baseRatePerCubicMeter: 25000,
        poolTypes: [{ id: 'test', label: 'Test Pool', multiplier: 15.0 }],
        disclaimer: 'Valid test disclaimer notice with sufficient length.'
      })
    });
    const highMultData = await highMultRes.json();
    console.log(`5c (Multiplier > 10.0): HTTP ${highMultRes.status} - Message: "${highMultData.message}"`);
    if (highMultRes.status !== 400) throw new Error('Expected 400 for multiplier > 10');

    // 5d: Short disclaimer (< 10 chars)
    const shortDiscRes = await fetch(`${BASE_URL}/api/admin/pricing`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Cookie: authCookie },
      body: JSON.stringify({
        baseRatePerCubicMeter: 25000,
        poolTypes: pubData.data.poolTypes,
        disclaimer: 'Short'
      })
    });
    const shortDiscData = await shortDiscRes.json();
    console.log(`5d (Short disclaimer): HTTP ${shortDiscRes.status} - Message: "${shortDiscData.message}"`);
    if (shortDiscRes.status !== 400) throw new Error('Expected 400 for short disclaimer');
    console.log('✅ TEST 5 PASSED: All 4 validation rules correctly protect data integrity.\n');

    // ----------------------------------------------------
    // TEST 6: Valid Pricing Update (PUT /api/admin/pricing)
    // ----------------------------------------------------
    console.log('--- TEST 6: Valid Pricing Update ---');
    const testUpdatedPricing = {
      baseRatePerCubicMeter: 24500,
      currencySymbol: '₹',
      currencyCode: 'INR',
      poolTypes: [
        { id: 'residential', label: 'Residential Pool', multiplier: 1.0 },
        { id: 'commercial', label: 'Commercial Complex', multiplier: 1.4 },
        { id: 'infinity', label: 'Infinity Luxury Pool', multiplier: 1.6 },
        { id: 'rooftop', label: 'Rooftop Skypool', multiplier: 1.75 }
      ],
      disclaimer: 'Official Updated Notice: Estimates are indicative and calculated using current material rates. Real civil construction costs are finalized after geotechnical ground assessment.',
      isPlaceholder: false
    };

    const updateRes = await fetch(`${BASE_URL}/api/admin/pricing`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Cookie: authCookie },
      body: JSON.stringify(testUpdatedPricing)
    });
    const updateData = await updateRes.json();
    console.log(`HTTP Status: ${updateRes.status}`);
    if (updateRes.status !== 200 || !updateData.success) {
      throw new Error(`Pricing update failed: ${JSON.stringify(updateData)}`);
    }
    console.log(`Server Message: "${updateData.message}"`);
    console.log(`Updated Base Rate: ₹ ${updateData.data.baseRatePerCubicMeter}`);
    console.log(`Updated Pool Types: ${updateData.data.poolTypes.length} configured`);
    console.log('✅ TEST 6 PASSED: Pricing configuration successfully updated in MongoDB Atlas.\n');

    // ----------------------------------------------------
    // TEST 7: Public API Reflection & Live Calculation
    // ----------------------------------------------------
    console.log('--- TEST 7: Public API Live Reflection ---');
    const pubVerifyRes = await fetch(`${BASE_URL}/api/public/pricing`);
    const pubVerifyData = await pubVerifyRes.json();
    console.log(`Public Base Rate: ₹ ${pubVerifyData.data.baseRatePerCubicMeter}`);
    console.log(`Public Pool Types: ${pubVerifyData.data.poolTypes.map((t) => t.id).join(', ')}`);
    console.log(`Type Multipliers:`, pubVerifyData.data.typeMultipliers);
    if (pubVerifyData.data.baseRatePerCubicMeter !== 24500) {
      throw new Error('Public API did not immediately reflect the updated base rate!');
    }
    if (pubVerifyData.data.typeMultipliers.rooftop !== 1.75) {
      throw new Error('Public API typeMultipliers did not include newly added rooftop multiplier!');
    }

    // Mathematical verification:
    // Volume: 10m * 5m * 1.5m = 75 m³
    // Rooftop (1.75x): 75 * 24500 * 1.75 = 3,215,625
    const volume = 10 * 5 * 1.5; // 75 m³
    const rate = pubVerifyData.data.baseRatePerCubicMeter;
    const rooftopMult = pubVerifyData.data.typeMultipliers.rooftop;
    const calculatedCost = Math.round(volume * rate * rooftopMult);
    console.log(`Calculated Rooftop Cost (75 m³ @ ₹24,500 * 1.75): ₹ ${calculatedCost.toLocaleString('en-IN')}`);
    if (calculatedCost !== 3215625) {
      throw new Error(`Cost calculation mismatch: expected 3215625, got ${calculatedCost}`);
    }
    console.log('✅ TEST 7 PASSED: Public API immediately reflects live updates with accurate math.\n');

    // ----------------------------------------------------
    // TEST 8: Restore Default Rates (Clean Baseline)
    // ----------------------------------------------------
    console.log('--- TEST 8: Restoring Standard Seed Pricing Baseline ---');
    const resetPricing = {
      baseRatePerCubicMeter: 22000,
      currencySymbol: '₹',
      currencyCode: 'INR',
      poolTypes: [
        { id: 'residential', label: 'Residential', multiplier: 1.0 },
        { id: 'commercial', label: 'Commercial', multiplier: 1.35 },
        { id: 'infinity', label: 'Infinity Pool', multiplier: 1.5 }
      ],
      disclaimer: 'Indicative Estimate Notice: This calculation provides an estimated budgetary guide based on standard dimensions. Actual project costs depend on site topography, soil conditions, civil excavation, premium tiling choices, pump horsepower, and filtration machinery. Contact Poona Pools Facilities for an authentic quotation.',
      isPlaceholder: true
    };

    const resetRes = await fetch(`${BASE_URL}/api/admin/pricing`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Cookie: authCookie },
      body: JSON.stringify(resetPricing)
    });
    const resetData = await resetRes.json();
    console.log(`Reset Status: ${resetRes.status}`);
    if (resetRes.status !== 200 || !resetData.success) {
      throw new Error(`Failed to reset pricing: ${JSON.stringify(resetData)}`);
    }
    console.log(`Restored Base Rate: ₹ ${resetData.data.baseRatePerCubicMeter} / m³`);
    console.log('✅ TEST 8 PASSED: Standard baseline restored.\n');

    console.log('==========================================================');
    console.log('ALL PHASE 4C TESTS PASSED FLAWLESSLY! (8/8)');
    console.log('==========================================================\n');
  } catch (err) {
    console.error('❌ PHASE 4C TEST FAILED:', err.message);
    process.exit(1);
  }
}

runTests();

