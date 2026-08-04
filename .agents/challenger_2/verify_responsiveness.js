const fs = require('fs');
const path = require('path');

const targetDir = 'c:/Users/DELL/getplaced.ai/dashboard-next';

const responsivenessRules = [
  {
    component: 'app/dashboard/page.tsx',
    checks: [
      { breakpoint: '375px', requirement: 'Main padding p-4, single col spacing space-y-12', pattern: /p-4 md:p-8/ },
      { breakpoint: '768px', requirement: '2-column grids for cards', pattern: /grid grid-cols-1 md:grid-cols-2 gap-6/ },
      { breakpoint: '1280px', requirement: 'Container max-width max-w-7xl', pattern: /max-w-7xl mx-auto/ }
    ]
  },
  {
    component: 'components/dashboard/Navbar.tsx',
    checks: [
      { breakpoint: '375px', requirement: 'Placely text hidden on small screens', pattern: /hidden sm:inline-block/ },
      { breakpoint: '768px', requirement: 'Navbar padding md:px-8', pattern: /px-4 md:px-8/ }
    ]
  },
  {
    component: 'components/dashboard/HeroGreeting.tsx',
    checks: [
      { breakpoint: '375px', requirement: 'Flex col layout on mobile', pattern: /flex flex-col md:flex-row/ },
      { breakpoint: '768px', requirement: 'Text align left on md', pattern: /text-center md:text-left/ }
    ]
  },
  {
    component: 'components/dashboard/TodaysMission.tsx',
    checks: [
      { breakpoint: '375px', requirement: 'Task row stacks vertically on mobile, flex-col md:flex-row', pattern: /flex flex-col md:flex-row/ },
      { breakpoint: '768px', requirement: 'Task metadata aligns right on md', pattern: /mt-3 md:mt-0/ }
    ]
  },
  {
    component: 'components/dashboard/CareerBreakdown.tsx',
    checks: [
      { breakpoint: '375px', requirement: '1 col mobile, 2 col sm, 4 col lg', pattern: /grid-cols-1 sm:grid-cols-2 lg:grid-cols-4/ }
    ]
  },
  {
    component: 'components/dashboard/PlacementJourney.tsx',
    checks: [
      { breakpoint: '375px', requirement: 'Vertical timeline on mobile md:hidden line', pattern: /md:hidden absolute left-6 top-6 w-1/ },
      { breakpoint: '768px', requirement: 'Horizontal timeline on desktop hidden md:block line', pattern: /hidden md:block absolute top-6 left-6 right-6/ }
    ]
  },
  {
    component: 'components/dashboard/PlacementTracker.tsx',
    checks: [
      { breakpoint: '375px', requirement: '2 col mobile, 3 col lg grid', pattern: /grid grid-cols-2 lg:grid-cols-3/ },
      { breakpoint: '768px', requirement: 'Flex col on sm flex row header', pattern: /flex flex-col sm:flex-row/ }
    ]
  },
  {
    component: 'components/dashboard/QuickActions.tsx',
    checks: [
      { breakpoint: '375px', requirement: '2 col mobile, 3 col sm, 4 col lg grid', pattern: /grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4/ }
    ]
  },
  {
    component: 'components/dashboard/StreakXPCard.tsx',
    checks: [
      { breakpoint: '375px', requirement: '1 col mobile, 2 col md grid with divider', pattern: /grid grid-cols-1 md:grid-cols-2/ }
    ]
  }
];

console.log('--- RESPONSIVENESS & BREAKPOINT VERIFICATION ---');

let passed = true;

responsivenessRules.forEach(r => {
  const filePath = path.join(targetDir, r.component);
  if (!fs.existsSync(filePath)) {
    console.log(`[FAIL] ${r.component} not found`);
    passed = false;
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`\nComponent: ${r.component}`);
  r.checks.forEach(c => {
    const match = c.pattern.test(content);
    if (match) {
      console.log(`  [PASS] ${c.breakpoint}: ${c.requirement}`);
    } else {
      console.log(`  [FAIL] ${c.breakpoint}: ${c.requirement}`);
      passed = false;
    }
  });
});

console.log(`\nResponsiveness Checks Result: ${passed ? 'PASS' : 'FAIL'}`);
