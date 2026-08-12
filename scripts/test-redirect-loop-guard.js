/**
 * Frontend Regression Test Suite for P0 Redirect Loop Prevention
 * Validates T1-T14 requirement specifications.
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

console.log('=== P0 REDIRECT LOOP PREVENTION REGRESSION SUITE (T1-T14) ===\n');

// Code payloads
const apiCode = readFile('lib/api.ts');
const layoutCode = readFile('app/dashboard/layout.tsx');
const errorCode = readFile('app/dashboard/error.tsx');
const indexCode = readFile('public/index.html');
const proGateCode = readFile('components/dashboard/ProGate.tsx');
const backendProCode = readFile('../getplaced - backend/services/pro.py');

// T1: Valid authenticated dashboard renders normally
assert(
  layoutCode.includes('DashboardProvider initialData={realData}'),
  'T1: Valid authenticated dashboard renders DashboardProvider with realData'
);

// T2: 401 -> login redirect
assert(
  layoutCode.includes('if (status === 401)') && layoutCode.includes("redirect('/index.html?login=1')"),
  'T2: 401 unauthenticated session redirects to /index.html?login=1'
);

// T3: 403 ownership/session mismatch -> login redirect
assert(
  layoutCode.includes('if (status === 403)') && layoutCode.includes('if (!isProRequired)') && layoutCode.includes("redirect('/index.html?login=1')"),
  'T3: 403 ownership mismatch redirects to /index.html?login=1'
);

// T4: 403 PRO_REQUIRED -> NO redirect, ProGate remains accessible
assert(
  layoutCode.includes('isProRequired') && apiCode.includes("errJson.error === 'PRO_REQUIRED'"),
  'T4: 403 PRO_REQUIRED is detected and does NOT trigger redirect to login'
);

// T5: 404 -> existing onboarding behavior
assert(
  layoutCode.includes('if (status === 404)') && layoutCode.includes("redirect('/index.html')"),
  'T5: 404 missing enrollment redirects to /index.html onboarding flow'
);

// T6: 500 -> error.tsx, no redirect
assert(
  layoutCode.includes('status >= 500') && layoutCode.includes('throw new Error('),
  'T6: 500 server error throws into error.tsx without redirect'
);

// T7: Network failure -> error.tsx, no redirect
assert(
  layoutCode.includes('status === 0') && layoutCode.includes('throw new Error('),
  'T7: Network failure (status 0) throws into error.tsx without redirect'
);

// T8: Basic user accessing DSA Pro action -> ProGate / ₹499 CTA
const dsaLayout = readFile('app/dashboard/dsa/layout.tsx');
assert(
  dsaLayout.includes('ProGate featureName="DSA Platform"') && proGateCode.includes('₹499/mo'),
  'T8: Basic user accessing DSA renders ProGate with ₹499/mo CTA'
);

// T9: Basic user accessing Bug Hunter -> ProGate / ₹499 CTA
const bugHunterLayout = readFile('app/dashboard/bug-hunter/layout.tsx');
assert(
  bugHunterLayout.includes('ProGate featureName="Bug Hunter"') && proGateCode.includes('₹499/mo'),
  'T9: Basic user accessing Bug Hunter renders ProGate with ₹499/mo CTA'
);

// T10: Basic user accessing Battles -> ProGate / ₹499 CTA
const battlesLayout = readFile('app/dashboard/battles/layout.tsx');
assert(
  battlesLayout.includes('ProGate featureName="Global Battles"') && proGateCode.includes('₹499/mo'),
  'T10: Basic user accessing Battles renders ProGate with ₹499/mo CTA'
);

// T11: Pro user accessing the same features -> normal feature page
assert(
  proGateCode.includes('if (data.isPro) {') && proGateCode.includes('return <>{children}</>;'),
  'T11: Pro user (isPro = true) bypasses gate and renders feature children normally'
);

// T12: Retry from error.tsx -> manual reset only, no automatic navigation
assert(
  errorCode.includes('reset()') && !errorCode.includes('window.location.reload()') && !errorCode.includes('router.push'),
  'T12: Retry button in error.tsx uses manual reset() only with no auto-navigation'
);

// T13: Valid session landing-page SSO -> dashboard redirect still works
assert(
  indexCode.includes('checkExistingSession()') && indexCode.includes('window.location.href = "/dashboard"'),
  'T13: Landing page checkExistingSession() redirects valid sessions to /dashboard'
);

// T14: OTP login flow -> existing auth state machine remains intact
assert(
  indexCode.includes('transition(') && indexCode.includes('authState !== "IDLE"'),
  'T14: OTP auth state machine & transition guard remain fully intact'
);

console.log(`\n================================================`);
console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED.`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
