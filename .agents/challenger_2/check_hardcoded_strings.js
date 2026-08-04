const fs = require('fs');
const path = require('path');

const targetDir = 'c:/Users/DELL/getplaced.ai/dashboard-next';
const componentsDir = path.join(targetDir, 'components');
const appDir = path.join(targetDir, 'app');
const mockDataPath = path.join(targetDir, 'lib/mockData.ts');

const mockDataContent = fs.readFileSync(mockDataPath, 'utf8');

// Extract strings from mockData to test if any exist hardcoded in components
const knownUserDataStrings = [
  "Syed Raed",
  "Mock Interview Round 2",
  "Solve 3 Hard Graph DP Problems on LeetCode",
  "Design Distributed Caching Strategy for System Design",
  "Review & Refactor ATS Parsing Algorithm in AI Resume Parser",
  "Practice STAR Method for Amazon Behavioral Mock Interview",
  "Full Stack SDE Track",
  "System Design & Distributed Caching",
  "AI Resume Parser & Scorer",
  "ATS Parsing Algorithm",
  "Your DSA consistency is up 40%!",
  "High response rate! Send 3 more applications",
  "Kiro"
];

function getTsxFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getTsxFiles(filePath));
    } else if (file.endsWith('.tsx')) {
      results.push(filePath);
    }
  });
  return results;
}

const tsxFiles = [...getTsxFiles(componentsDir), ...getTsxFiles(appDir)];

console.log(`Scanning ${tsxFiles.length} TSX files for hardcoded user data...`);

const findings = [];

tsxFiles.forEach(file => {
  const relativePath = path.relative(targetDir, file);
  const content = fs.readFileSync(file, 'utf8');

  // Check 1: Direct matches with mock user data strings
  knownUserDataStrings.forEach(str => {
    if (content.includes(str)) {
      findings.push({
        file: relativePath,
        type: "Exact Mock Data Match",
        detail: `File contains mock user data string: "${str}"`
      });
    }
  });

  // Check 2: hardcoded user-facing strings that should be in mockData or props
  // Search for hardcoded text inside components
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    // Check for hardcoded Kiro - AI Mentor
    if (line.includes("Kiro - AI Mentor")) {
      findings.push({
        file: relativePath,
        line: index + 1,
        type: "Hardcoded User/Mentor Name",
        detail: `Hardcoded name "Kiro - AI Mentor" found in component line ${index + 1}: ${line.trim()}`
      });
    }
    // Check for hardcoded streak messages inside component logic
    if (line.includes("Unstoppable consistency!") || line.includes("Great momentum!") || line.includes("Build your daily habit!")) {
      findings.push({
        file: relativePath,
        line: index + 1,
        type: "Hardcoded Motivational Message String",
        detail: `Hardcoded motivational text in helper function line ${index + 1}: ${line.trim()}`
      });
    }
  });
});

console.log('\n--- HARDCODED STRINGS AUDIT RESULTS ---');
console.log(`Total Findings: ${findings.length}`);
console.stringify ? console.log(JSON.stringify(findings, null, 2)) : console.log(findings);
