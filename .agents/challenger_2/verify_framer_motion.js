const fs = require('fs');
const path = require('path');

const targetDir = 'c:/Users/DELL/getplaced.ai/dashboard-next';

const checks = [
  {
    name: 'CircularRing animation props',
    file: 'components/ui/CircularRing.tsx',
    verify: (content) => {
      const hasUseClient = content.startsWith("'use client'") || content.startsWith('"use client"');
      const hasMotionCircle = content.includes('<motion.circle');
      const hasInitial = content.includes('initial={{ strokeDashoffset: circumference }}');
      const hasAnimate = content.includes('animate={{ strokeDashoffset: targetOffset }}');
      const hasTransition = content.includes('transition={{ duration: 1.5, ease: \'easeOut\' }}');
      return {
        pass: hasUseClient && hasMotionCircle && hasInitial && hasAnimate && hasTransition,
        details: { hasUseClient, hasMotionCircle, hasInitial, hasAnimate, hasTransition }
      };
    }
  },
  {
    name: 'AnimatedNumber framer-motion animate() hook/control',
    file: 'components/ui/AnimatedNumber.tsx',
    verify: (content) => {
      const hasUseClient = content.startsWith("'use client'") || content.startsWith('"use client"');
      const hasUseInView = content.includes('useInView');
      const hasAnimate = content.includes('animate(0, value');
      const hasOnUpdate = content.includes('onUpdate(latest)');
      const hasCleanup = content.includes('controls.stop()');
      return {
        pass: hasUseClient && hasUseInView && hasAnimate && hasOnUpdate && hasCleanup,
        details: { hasUseClient, hasUseInView, hasAnimate, hasOnUpdate, hasCleanup }
      };
    }
  },
  {
    name: 'ProgressBar motion.div width animation',
    file: 'components/ui/ProgressBar.tsx',
    verify: (content) => {
      const hasUseClient = content.startsWith("'use client'") || content.startsWith('"use client"');
      const hasMotionDiv = content.includes('<motion.div');
      const hasInitialWidth = content.includes('initial={{ width: 0 }}');
      const hasAnimateWidth = content.includes('animate={{ width: `${percentage}%` }}');
      return {
        pass: hasUseClient && hasMotionDiv && hasInitialWidth && hasAnimateWidth,
        details: { hasUseClient, hasMotionDiv, hasInitialWidth, hasAnimateWidth }
      };
    }
  },
  {
    name: 'PlacementJourney line fill animations (Desktop & Mobile)',
    file: 'components/dashboard/PlacementJourney.tsx',
    verify: (content) => {
      const hasDesktopLine = content.includes('hidden md:block absolute top-6 left-6 h-1 bg-[#FF7A00]');
      const hasDesktopAnimate = content.includes('animate={{ width: `${fillPercentage}%` }}');
      const hasMobileLine = content.includes('md:hidden absolute left-6 top-6 w-1 bg-[#FF7A00]');
      const hasMobileAnimate = content.includes('animate={{ height: `${fillPercentage}%` }}');
      const hasCurrentPulse = content.includes('animate={{ scale: [1, 1.25, 1], opacity: [0.8, 0.2, 0.8] }}');
      return {
        pass: hasDesktopLine && hasDesktopAnimate && hasMobileLine && hasMobileAnimate && hasCurrentPulse,
        details: { hasDesktopLine, hasDesktopAnimate, hasMobileLine, hasMobileAnimate, hasCurrentPulse }
      };
    }
  },
  {
    name: 'QuickActions hover scale & glow styling',
    file: 'components/dashboard/QuickActions.tsx',
    verify: (content) => {
      const hasWhileHover = content.includes('whileHover={{ scale: 1.05 }}');
      const hasHoverBorder = content.includes('hover:border-[#FF7A00]');
      const hasHoverGlow = content.includes('hover:shadow-[0_0_20px_rgba(255,122,0,0.25)]');
      return {
        pass: hasWhileHover && hasHoverBorder && hasHoverGlow,
        details: { hasWhileHover, hasHoverBorder, hasHoverGlow }
      };
    }
  }
];

console.log('--- FRAMER MOTION & ANIMATION VERIFICATION ---');

let allPassed = true;

checks.forEach(c => {
  const filePath = path.join(targetDir, c.file);
  if (!fs.existsSync(filePath)) {
    console.log(`[FAIL] ${c.name}: File not found ${c.file}`);
    allPassed = false;
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const res = c.verify(content);
  if (res.pass) {
    console.log(`[PASS] ${c.name}`);
  } else {
    console.log(`[FAIL] ${c.name}`);
    console.log('  Details:', JSON.stringify(res.details));
    allPassed = false;
  }
});

console.log(`\nFramer Motion Checks Passed: ${allPassed}`);
