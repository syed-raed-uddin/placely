const fs = require('fs');
const path = require('path');

const layoutPath = path.join(__dirname, '../../app/dashboard/layout.tsx');
const pagePath = path.join(__dirname, '../../app/dashboard/page.tsx');

let passed = true;
const results = [];

function check(title, condition, detail) {
  if (condition) {
    results.push(`✅ PASS: ${title}`);
  } else {
    passed = false;
    results.push(`❌ FAIL: ${title} - ${detail}`);
  }
}

// 1. Read files
const layoutContent = fs.readFileSync(layoutPath, 'utf8');
const pageContent = fs.readFileSync(pagePath, 'utf8');

// 2. Check layout.tsx auth guard
check(
  'Layout imports cookies from next/headers',
  layoutContent.includes("import { cookies } from 'next/headers'"),
  'next/headers cookies import missing in layout.tsx'
);

check(
  'Layout imports redirect from next/navigation',
  layoutContent.includes("import { redirect } from 'next/navigation'"),
  'next/navigation redirect import missing in layout.tsx'
);

check(
  'Layout checks placely_student_id cookie',
  layoutContent.includes("cookieStore.get('placely_student_id')"),
  'placely_student_id cookie check missing in layout.tsx'
);

check(
  'Layout redirects to / when studentId is missing',
  /if\s*\(\s*!studentId\s*\)\s*{\s*redirect\('\/'\);\s*}/.test(layoutContent),
  'Redirect to / when studentId missing not found in layout.tsx'
);

// 3. Check Navbar in layout.tsx
check(
  'Layout imports Navbar component',
  layoutContent.includes("import Navbar from '@/components/dashboard/Navbar'"),
  'Navbar import missing in layout.tsx'
);

check(
  'Layout renders Navbar and children',
  layoutContent.includes('<Navbar />') && layoutContent.includes('{children}'),
  'Navbar or children missing in layout.tsx return JSX'
);

// 4. Check Navbar removal from page.tsx
check(
  'Page does NOT import Navbar component',
  !pageContent.includes("import Navbar from '@/components/dashboard/Navbar'") && !pageContent.includes("import Navbar from"),
  'Navbar is still imported in app/dashboard/page.tsx'
);

check(
  'Page does NOT render Navbar element',
  !pageContent.includes('<Navbar />') && !pageContent.includes('<Navbar'),
  'Navbar is still rendered in app/dashboard/page.tsx'
);

// 5. Check page.tsx auth guard intact
check(
  'Page checks placely_student_id cookie',
  pageContent.includes("cookieStore.get('placely_student_id')"),
  'placely_student_id cookie check missing in page.tsx'
);

check(
  'Page redirects to / when studentId is missing',
  /if\s*\(\s*!studentId\s*\)\s*{\s*redirect\('\/'\);\s*}/.test(pageContent),
  'Redirect to / when studentId missing not found in page.tsx'
);

console.log('--- EMPIRICAL VERIFICATION RESULTS ---');
results.forEach((r) => console.log(r));
console.log('------------------------------------');
console.log(`OVERALL VERDICT: ${passed ? 'APPROVE' : 'REJECT'}`);

if (!passed) process.exit(1);
