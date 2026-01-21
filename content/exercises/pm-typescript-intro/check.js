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

// Check for type annotations in the source
test('User interface is defined', () => {
  if (!tsContent.includes('interface User')) {
    throw new Error('Missing User interface');
  }
});

test('Product interface is defined', () => {
  if (!tsContent.includes('interface Product')) {
    throw new Error('Missing Product interface');
  }
});

test('greet function has type annotations', () => {
  if (!tsContent.match(/function greet\s*\(\s*name\s*:\s*string\s*\)/)) {
    throw new Error('greet should have name: string parameter');
  }
});

test('add function has type annotations', () => {
  if (!tsContent.match(/function add\s*\(\s*a\s*:\s*number\s*,\s*b\s*:\s*number\s*\)/)) {
    throw new Error('add should have a: number, b: number parameters');
  }
});

test('getUser returns User type', () => {
  if (!tsContent.match(/function getUser\s*\([^)]*\)\s*:\s*User/)) {
    throw new Error('getUser should return User type');
  }
});

test('filterProducts has proper types', () => {
  if (!tsContent.match(/function filterProducts\s*\(\s*products\s*:\s*Product\[\]/)) {
    throw new Error('filterProducts should have products: Product[] parameter');
  }
});

test('calculateTotal has proper types', () => {
  if (!tsContent.match(/function calculateTotal\s*\(\s*products\s*:\s*Product\[\]\s*\)\s*:\s*number/)) {
    throw new Error('calculateTotal should have products: Product[] and return number');
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
