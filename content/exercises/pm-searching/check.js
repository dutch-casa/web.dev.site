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

let linearSearch, binarySearch, findFirst;
try {
  const solution = require('./src/index.js');
  linearSearch = solution.linearSearch;
  binarySearch = solution.binarySearch;
  findFirst = solution.findFirst;
} catch (e) {
  console.log('✗ Your code has an error:\n');
  console.log(e.message);
  process.exit(1);
}

// linearSearch tests
test('linearSearch finds element at beginning', () => {
  if (linearSearch([1, 2, 3, 4, 5], 1) !== 0) throw new Error('Expected index 0');
});

test('linearSearch finds element in middle', () => {
  if (linearSearch([1, 2, 3, 4, 5], 3) !== 2) throw new Error('Expected index 2');
});

test('linearSearch returns -1 for missing element', () => {
  if (linearSearch([1, 2, 3], 99) !== -1) throw new Error('Expected -1');
});

// binarySearch tests
test('binarySearch finds element in sorted array', () => {
  if (binarySearch([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 7) !== 6) {
    throw new Error('Expected index 6');
  }
});

test('binarySearch finds first element', () => {
  if (binarySearch([1, 2, 3, 4, 5], 1) !== 0) throw new Error('Expected index 0');
});

test('binarySearch finds last element', () => {
  if (binarySearch([1, 2, 3, 4, 5], 5) !== 4) throw new Error('Expected index 4');
});

test('binarySearch returns -1 for missing element', () => {
  if (binarySearch([1, 2, 3, 4, 5], 99) !== -1) throw new Error('Expected -1');
});

// findFirst tests
test('findFirst finds first even number', () => {
  const result = findFirst([1, 3, 4, 6, 7], n => n % 2 === 0);
  if (result !== 4) throw new Error(`Expected 4 but got ${result}`);
});

test('findFirst returns undefined when no match', () => {
  const result = findFirst([1, 3, 5], n => n % 2 === 0);
  if (result !== undefined) throw new Error(`Expected undefined but got ${result}`);
});

test('findFirst works with objects', () => {
  const users = [{name: "Alice", age: 17}, {name: "Bob", age: 21}];
  const result = findFirst(users, u => u.age >= 18);
  if (result.name !== "Bob") throw new Error(`Expected Bob but got ${result.name}`);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed!');
}
