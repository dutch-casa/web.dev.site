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

let factorial, fibonacci, sumNested, flattenArray;
try {
  const solution = require('./src/index.js');
  factorial = solution.factorial;
  fibonacci = solution.fibonacci;
  sumNested = solution.sumNested;
  flattenArray = solution.flattenArray;
} catch (e) {
  console.log('✗ Your code has an error:\n');
  console.log(e.message);
  process.exit(1);
}

// factorial tests
test('factorial(5) returns 120', () => {
  if (factorial(5) !== 120) throw new Error(`Expected 120 but got ${factorial(5)}`);
});

test('factorial(0) returns 1', () => {
  if (factorial(0) !== 1) throw new Error(`Expected 1 but got ${factorial(0)}`);
});

test('factorial(1) returns 1', () => {
  if (factorial(1) !== 1) throw new Error(`Expected 1 but got ${factorial(1)}`);
});

// fibonacci tests
test('fibonacci(0) returns 0', () => {
  if (fibonacci(0) !== 0) throw new Error(`Expected 0 but got ${fibonacci(0)}`);
});

test('fibonacci(1) returns 1', () => {
  if (fibonacci(1) !== 1) throw new Error(`Expected 1 but got ${fibonacci(1)}`);
});

test('fibonacci(10) returns 55', () => {
  if (fibonacci(10) !== 55) throw new Error(`Expected 55 but got ${fibonacci(10)}`);
});

// sumNested tests
test('sumNested handles nested arrays', () => {
  const result = sumNested([1, [2, [3, 4]], 5]);
  if (result !== 15) throw new Error(`Expected 15 but got ${result}`);
});

test('sumNested handles flat array', () => {
  const result = sumNested([1, 2, 3]);
  if (result !== 6) throw new Error(`Expected 6 but got ${result}`);
});

// flattenArray tests
test('flattenArray flattens nested arrays', () => {
  const result = flattenArray([1, [2, [3, 4]], 5]);
  if (JSON.stringify(result) !== JSON.stringify([1, 2, 3, 4, 5])) {
    throw new Error(`Expected [1,2,3,4,5] but got ${JSON.stringify(result)}`);
  }
});

test('flattenArray handles deeply nested', () => {
  const result = flattenArray([[[[1]]]]);
  if (JSON.stringify(result) !== JSON.stringify([1])) {
    throw new Error(`Expected [1] but got ${JSON.stringify(result)}`);
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed!');
}
