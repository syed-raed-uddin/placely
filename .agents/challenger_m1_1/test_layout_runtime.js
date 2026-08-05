const fs = require('fs');
const path = require('path');

// Test AST and layout properties
const layoutCode = fs.readFileSync(path.join(__dirname, '../../app/dashboard/layout.tsx'), 'utf8');

console.log('Testing layout component exports...');

// Check layout function signature
if (!layoutCode.includes('export default function DashboardLayout')) {
  console.error('ERROR: DashboardLayout default export missing');
  process.exit(1);
}

// Check children parameter definition
if (!layoutCode.includes('children: React.ReactNode') && !layoutCode.includes('children')) {
  console.error('ERROR: children prop not defined in DashboardLayout');
  process.exit(1);
}

console.log('Layout component structure verified.');
