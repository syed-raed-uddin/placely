const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    if (file === 'node_modules' || file === '.next' || file === '.git') return;
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(filePath));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(filePath);
    }
  });
  return results;
}

const targetDir = 'c:/Users/DELL/getplaced.ai/dashboard-next';
const files = getFiles(targetDir);
let totalFiles = 0;
let failedFiles = [];

console.log("--- LINE COUNT CHECK ---");
files.forEach(f => {
  totalFiles++;
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n').length;
  const relPath = path.relative(targetDir, f);
  const pass = lines < 200;
  console.log(`[${pass ? 'PASS' : 'FAIL'}] ${lines} lines - ${relPath}`);
  if (!pass) {
    failedFiles.push({ file: relPath, lines });
  }
});

console.log("\nSummary:");
console.log(`Total TS/TSX files: ${totalFiles}`);
console.log(`Failed files (>=200 lines): ${failedFiles.length}`);
if (failedFiles.length > 0) {
  console.log("Failed details:", JSON.stringify(failedFiles, null, 2));
}
