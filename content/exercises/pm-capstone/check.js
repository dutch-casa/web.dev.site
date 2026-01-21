const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Checking your solution...\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (e) {
    console.log(`✗ ${name}`);
    console.log(`  ${e.message}\n`);
    failed++;
  }
}

// Read the TypeScript file
const tsContent = fs.readFileSync(path.join(__dirname, 'src/index.ts'), 'utf8');

// Check type definitions
test('Priority type is defined', () => {
  if (!tsContent.match(/type\s+Priority\s*=.*"low".*"medium".*"high"/s) &&
      !tsContent.match(/type\s+Priority\s*=.*"high".*"medium".*"low"/s)) {
    throw new Error('Priority should be "low" | "medium" | "high"');
  }
});

test('TaskStatus type is defined', () => {
  if (!tsContent.match(/type\s+TaskStatus\s*=/)) {
    throw new Error('TaskStatus type should be defined');
  }
});

test('Task interface is defined', () => {
  if (!tsContent.match(/interface\s+Task/)) {
    throw new Error('Task interface should be defined');
  }
});

test('Task has required properties', () => {
  if (!tsContent.includes('id:') ||
      !tsContent.includes('title:') ||
      !tsContent.includes('priority:') ||
      !tsContent.includes('status:') ||
      !tsContent.includes('createdAt:')) {
    throw new Error('Task should have id, title, priority, status, and createdAt');
  }
});

test('TaskManager class is defined', () => {
  if (!tsContent.match(/class\s+TaskManager/)) {
    throw new Error('TaskManager class should be defined');
  }
});

test('TaskManager has private tasks array', () => {
  if (!tsContent.match(/private\s+tasks/)) {
    throw new Error('TaskManager should have private tasks array');
  }
});

test('TaskManager has addTask method', () => {
  if (!tsContent.includes('addTask(') && !tsContent.includes('addTask (')) {
    throw new Error('TaskManager should have addTask method');
  }
});

test('TaskManager has updateStatus method', () => {
  if (!tsContent.includes('updateStatus(') && !tsContent.includes('updateStatus (')) {
    throw new Error('TaskManager should have updateStatus method');
  }
});

test('TaskManager has getStats method', () => {
  if (!tsContent.includes('getStats(') && !tsContent.includes('getStats (')) {
    throw new Error('TaskManager should have getStats method');
  }
});

test('sortByPriority function is defined', () => {
  if (!tsContent.match(/function\s+sortByPriority/)) {
    throw new Error('sortByPriority function should be defined');
  }
});

test('sortByDate function is defined', () => {
  if (!tsContent.match(/function\s+sortByDate/)) {
    throw new Error('sortByDate function should be defined');
  }
});

test('filterOverdue function is defined', () => {
  if (!tsContent.match(/function\s+filterOverdue/)) {
    throw new Error('filterOverdue function should be defined');
  }
});

// Try to compile with TypeScript
test('TypeScript compiles without errors', () => {
  try {
    execFileSync('npx', ['tsc', '--noEmit', '--strict', 'src/index.ts'], {
      cwd: __dirname,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
  } catch (e) {
    throw new Error(`TypeScript compilation failed:\n${e.stderr || e.message}`);
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 Congratulations! You completed the capstone project!');
  console.log('You have demonstrated mastery of:');
  console.log('  - TypeScript types and interfaces');
  console.log('  - Classes and object-oriented design');
  console.log('  - Array methods (filter, sort, map)');
  console.log('  - Working with dates');
  console.log('  - Proper type annotations');
}
