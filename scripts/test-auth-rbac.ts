import "dotenv/config";
import jwt from "jsonwebtoken";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
const JWT_SECRET = process.env.JWT_SECRET || "warranty_super_secret_jwt_key_2026_change_me";

function generateTestToken(walletAddress: string, role: string): string {
  return jwt.sign(
    { walletAddress, role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

async function runTests() {
  console.log("==================================================");
  console.log("🧪 RUNNING AUTH & RBAC ACCESS CONTROL INTEGRATION TESTS");
  console.log(`Target URL: ${BASE_URL}`);
  console.log(`Using JWT Secret: ${JWT_SECRET.substring(0, 10)}...`);
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  // Test Case 1: Unauthenticated call to Employer Dashboard API -> 401
  try {
    const res = await fetch(`${BASE_URL}/api/dashboard/employer`);
    if (res.status === 401) {
      console.log("✅ TEST 1 PASSED: Unauthenticated call to /api/dashboard/employer returned 401 Unauthorized.");
      passed++;
    } else {
      console.error(`❌ TEST 1 FAILED: Expected status 401, got ${res.status}`);
      failed++;
    }
  } catch (err) {
    console.error("❌ TEST 1 FAILED with exception:", err);
    failed++;
  }

  // Test Case 2: Unauthenticated call to Freelancer Dashboard API -> 401
  try {
    const res = await fetch(`${BASE_URL}/api/dashboard/freelancer`);
    if (res.status === 401) {
      console.log("✅ TEST 2 PASSED: Unauthenticated call to /api/dashboard/freelancer returned 401 Unauthorized.");
      passed++;
    } else {
      console.error(`❌ TEST 2 FAILED: Expected status 401, got ${res.status}`);
      failed++;
    }
  } catch (err) {
    console.error("❌ TEST 2 FAILED with exception:", err);
    failed++;
  }

  // Test Case 3: Freelancer role calling Employer Dashboard API -> 403 Forbidden
  try {
    const freelancerToken = generateTestToken("0x1111111111111111111111111111111111111111", "FREELANCER");
    const res = await fetch(`${BASE_URL}/api/dashboard/employer`, {
      headers: { Authorization: `Bearer ${freelancerToken}` }
    });

    if (res.status === 403) {
      console.log("✅ TEST 3 PASSED: Freelancer role calling /api/dashboard/employer returned 403 Forbidden.");
      passed++;
    } else {
      console.error(`❌ TEST 3 FAILED: Expected status 403, got ${res.status}`);
      failed++;
    }
  } catch (err) {
    console.error("❌ TEST 3 FAILED with exception:", err);
    failed++;
  }

  // Test Case 4: Employer role calling Freelancer Dashboard API -> 403 Forbidden
  try {
    const employerToken = generateTestToken("0x2222222222222222222222222222222222222222", "EMPLOYER");
    const res = await fetch(`${BASE_URL}/api/dashboard/freelancer`, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });

    if (res.status === 403) {
      console.log("✅ TEST 4 PASSED: Employer role calling /api/dashboard/freelancer returned 403 Forbidden.");
      passed++;
    } else {
      console.error(`❌ TEST 4 FAILED: Expected status 403, got ${res.status}`);
      failed++;
    }
  } catch (err) {
    console.error("❌ TEST 4 FAILED with exception:", err);
    failed++;
  }

  // Test Case 5: Valid Employer token calling Employer Dashboard API -> 200 OK
  try {
    const employerToken = generateTestToken("0x2222222222222222222222222222222222222222", "EMPLOYER");
    const res = await fetch(`${BASE_URL}/api/dashboard/employer`, {
      headers: { Authorization: `Bearer ${employerToken}` }
    });

    if (res.status === 200) {
      console.log("✅ TEST 5 PASSED: Employer role calling /api/dashboard/employer returned 200 OK.");
      passed++;
    } else {
      console.error(`❌ TEST 5 FAILED: Expected status 200, got ${res.status}`);
      failed++;
    }
  } catch (err) {
    console.error("❌ TEST 5 FAILED with exception:", err);
    failed++;
  }

  // Test Case 6: Valid Freelancer token calling Freelancer Dashboard API -> 200 OK
  try {
    const freelancerToken = generateTestToken("0x1111111111111111111111111111111111111111", "FREELANCER");
    const res = await fetch(`${BASE_URL}/api/dashboard/freelancer`, {
      headers: { Authorization: `Bearer ${freelancerToken}` }
    });

    if (res.status === 200) {
      console.log("✅ TEST 6 PASSED: Freelancer role calling /api/dashboard/freelancer returned 200 OK.");
      passed++;
    } else {
      console.error(`❌ TEST 6 FAILED: Expected status 200, got ${res.status}`);
      failed++;
    }
  } catch (err) {
    console.error("❌ TEST 6 FAILED with exception:", err);
    failed++;
  }

  console.log("\n==================================================");
  console.log(`SUMMARY: Passed ${passed}/${passed + failed} tests.`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
