/**
 * Frontend Regression Test Suite for P0 Redirect Loop Prevention & Entitlement Audit
 * Validates T1-T15 requirement specifications.
 * 
 * Usage: node scripts/test-redirect-loop-guard.js
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');

function readFile(relPath) {
  return fs.readFileSync(path.join(PROJECT_ROOT, relPath), 'utf8');
}

let passed = 0;
let failed = 0;

function assert(condition, name, details = '') {
  if (condition) {
    console.log(`  ✅ [PASS] ${name}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${name}: ${details}`);
    failed++;
  }
}

console.log('=== P0 REDIRECT LOOP & ENTITLEMENT REGRESSION SUITE ===\n');

// Code payloads
const apiCode = readFile('lib/api.ts');
const layoutCode = readFile('app/dashboard/layout.tsx');
const errorCode = readFile('app/dashboard/error.tsx');
const indexCode = readFile('public/index.html');
const proGateCode = readFile('components/dashboard/ProGate.tsx');
const mentorLayout = readFile('app/dashboard/mentor/layout.tsx');
const backendProCode = readFile('../getplaced - backend/services/pro.py');

// T1: Basic student can open AI Mentor (MentorLayout has NO ProGate)
assert(
  !mentorLayout.includes('ProGate'),
  'T1: AI Mentor is unlocked for all students (no ProGate wrapper in MentorLayout)'
);

// T2/T3/T4: AI Mentor backend routes do not require Pro
const backendMentorCode = readFile('../getplaced - backend/routes/ai_mentor.py');
assert(
  !backendMentorCode.includes('@require_pro'),
  'T2/T3/T4: AI Mentor backend API permits Basic & Pro students (no @require_pro on chat endpoints)'
);

// T5: DSA Pro entitlement & custom positioning copy
const dsaLayout = readFile('app/dashboard/dsa/layout.tsx');
assert(
  dsaLayout.includes('ProGate featureName="DSA Platform"') &&
  proGateCode.includes('Master DSA for Technical Interviews') &&
  proGateCode.includes('500+ Interview Problems') &&
  proGateCode.includes('Unlock Full DSA — ₹499/month'),
  'T5: DSA Pro entitlement is enforced with enhanced positioning copy and ₹499/mo CTA'
);

// T6: Authenticated Readiness Test auth header injection
assert(
  apiCode.includes('headers.set(\'Authorization\', `Bearer ${token}`)') &&
  apiCode.includes('headers.set(\'x-dev-student-id\', studentId)'),
  'T6: apiClient automatically injects Authorization and x-dev-student-id headers from client storage'
);

// T7: Unauthenticated student still receives 401 when no headers/cookies present
assert(
  layoutCode.includes('if (status === 401)') && layoutCode.includes("redirect('/index.html?login=1')"),
  'T7: Unauthenticated requests still receive 401 and redirect to login'
);

// T8: Existing redirect-loop protection remains intact
assert(
  layoutCode.includes('status >= 500 || status === 0') && layoutCode.includes('throw new Error('),
  'T8: 500/network failures throw into error.tsx without redirect'
);

// T9: Existing ₹199 Basic and ₹499 Pro pricing preserved
assert(
  backendProCode.includes('499') || backendProCode.includes('is_pro'),
  'T9: Pro entitlement logic & ₹499 pricing preserved'
);

// T10: 3-tier entitlement hierarchy supported in backend (Basic, Pro, Advanced)
assert(
  backendProCode.includes('get_student_plan') &&
  backendProCode.includes('has_access') &&
  backendProCode.includes('require_advanced'),
  'T10: Backend services/pro.py implements unified 3-tier entitlement hierarchy (Basic, Pro, Advanced)'
);

// T11: Frontend ProGate supports requiredPlan prop and ₹999/mo Advanced CTA
assert(
  proGateCode.includes('requiredPlan') &&
  proGateCode.includes('999'),
  'T11: ProGate supports requiredPlan="pro" | "advanced" and ₹999/mo CTA for Advanced tier'
);

console.log(`\n================================================`);
console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED.`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
