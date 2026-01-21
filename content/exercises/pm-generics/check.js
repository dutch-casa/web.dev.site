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

// Check for generic type parameters
test('identity uses generic type parameter', () => {
  if (!tsContent.match(/function identity\s*<\s*T\s*>/)) {
    throw new Error('identity should have <T> type parameter');
  }
});

test('first uses generic type parameter', () => {
  if (!tsContent.match(/function first\s*<\s*T\s*>/)) {
    throw new Error('first should have <T> type parameter');
  }
});

test('last uses generic type parameter', () => {
  if (!tsContent.match(/function last\s*<\s*T\s*>/)) {
    throw new Error('last should have <T> type parameter');
  }
});

test('reverse uses generic type parameter', () => {
  if (!tsContent.match(/function reverse\s*<\s*T\s*>/)) {
    throw new Error('reverse should have <T> type parameter');
  }
});

test('map uses two generic type parameters', () => {
  if (!tsContent.match(/function map\s*<\s*T\s*,\s*U\s*>/)) {
    throw new Error('map should have <T, U> type parameters');
  }
});

test('filter uses generic type parameter', () => {
  if (!tsContent.match(/function filter\s*<\s*T\s*>/)) {
    throw new Error('filter should have <T> type parameter');
  }
});

test('Pair interface is defined with generics', () => {
  if (!tsContent.match(/interface Pair\s*<\s*T\s*,\s*U\s*>/)) {
    throw new Error('Pair interface should have <T, U> type parameters');
  }
});

test('makePair uses two generic type parameters', () => {
  if (!tsContent.match(/function makePair\s*<\s*T\s*,\s*U\s*>/)) {
    throw new Error('makePair should have <T, U> type parameters');
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
  console.log('\n🎉 All tests passed!');
}
