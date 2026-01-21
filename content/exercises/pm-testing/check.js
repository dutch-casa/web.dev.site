const { execSync } = require('child_process');

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

let testAdd, testIsEven, testCapitalize, testGetFirst;
try {
  const solution = require('./src/index.js');
  testAdd = solution.testAdd;
  testIsEven = solution.testIsEven;
  testCapitalize = solution.testCapitalize;
  testGetFirst = solution.testGetFirst;
} catch (e) {
  console.log('✗ Your code has an error:\n');
  console.log(e.message);
  process.exit(1);
}

test('testAdd passes and returns true', () => {
  const result = testAdd();
  if (result !== true) throw new Error('testAdd should return true');
});

test('testIsEven passes and returns true', () => {
  const result = testIsEven();
  if (result !== true) throw new Error('testIsEven should return true');
});

test('testCapitalize passes and returns true', () => {
  const result = testCapitalize();
  if (result !== true) throw new Error('testCapitalize should return true');
});

test('testGetFirst passes and returns true', () => {
  const result = testGetFirst();
  if (result !== true) throw new Error('testGetFirst should return true');
});

// Verify functions are defined
test('All test functions are properly defined', () => {
  if (typeof testAdd !== 'function') throw new Error('testAdd must be a function');
  if (typeof testIsEven !== 'function') throw new Error('testIsEven must be a function');
  if (typeof testCapitalize !== 'function') throw new Error('testCapitalize must be a function');
  if (typeof testGetFirst !== 'function') throw new Error('testGetFirst must be a function');
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed!');
}
