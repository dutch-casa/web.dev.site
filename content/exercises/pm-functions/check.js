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

let add, multiply, calculateArea, compose;
try {
  const solution = require('./src/index.js');
  add = solution.add;
  multiply = solution.multiply;
  calculateArea = solution.calculateArea;
  compose = solution.compose;
} catch (e) {
  console.log('✗ Your code has an error:\n');
  console.log(e.message);
  process.exit(1);
}

// add tests
test('add(2, 3) returns 5', () => {
  if (add(2, 3) !== 5) throw new Error(`Expected 5 but got ${add(2, 3)}`);
});

test('add(-1, 1) returns 0', () => {
  if (add(-1, 1) !== 0) throw new Error(`Expected 0 but got ${add(-1, 1)}`);
});

// multiply tests
test('multiply(3, 4) returns 12', () => {
  if (multiply(3, 4) !== 12) throw new Error(`Expected 12 but got ${multiply(3, 4)}`);
});

test('multiply(5) returns 5 (default b = 1)', () => {
  if (multiply(5) !== 5) throw new Error(`Expected 5 but got ${multiply(5)}`);
});

// calculateArea tests
test('calculateArea("rectangle", 4, 5) returns 20', () => {
  if (calculateArea("rectangle", 4, 5) !== 20) {
    throw new Error(`Expected 20 but got ${calculateArea("rectangle", 4, 5)}`);
  }
});

test('calculateArea("circle", 2) returns correct area', () => {
  const expected = Math.PI * 4;
  const result = calculateArea("circle", 2);
  if (Math.abs(result - expected) > 0.001) {
    throw new Error(`Expected ${expected} but got ${result}`);
  }
});

test('calculateArea("triangle", 6, 4) returns 12', () => {
  if (calculateArea("triangle", 6, 4) !== 12) {
    throw new Error(`Expected 12 but got ${calculateArea("triangle", 6, 4)}`);
  }
});

test('calculateArea("unknown", 1, 2) returns 0', () => {
  if (calculateArea("unknown", 1, 2) !== 0) {
    throw new Error(`Expected 0 but got ${calculateArea("unknown", 1, 2)}`);
  }
});

// compose tests
test('compose works correctly', () => {
  const double = x => x * 2;
  const addOne = x => x + 1;
  const doubleThenAddOne = compose(addOne, double);
  if (doubleThenAddOne(3) !== 7) {
    throw new Error(`Expected 7 but got ${doubleThenAddOne(3)}`);
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed!');
}
