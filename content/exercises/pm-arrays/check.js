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

let doubleAll, filterEvens, sumArray, findMax, pluck;
try {
  const solution = require('./src/index.js');
  doubleAll = solution.doubleAll;
  filterEvens = solution.filterEvens;
  sumArray = solution.sumArray;
  findMax = solution.findMax;
  pluck = solution.pluck;
} catch (e) {
  console.log('✗ Your code has an error:\n');
  console.log(e.message);
  process.exit(1);
}

// doubleAll tests
test('doubleAll([1, 2, 3]) returns [2, 4, 6]', () => {
  const result = doubleAll([1, 2, 3]);
  if (JSON.stringify(result) !== JSON.stringify([2, 4, 6])) {
    throw new Error(`Expected [2, 4, 6] but got ${JSON.stringify(result)}`);
  }
});

// filterEvens tests
test('filterEvens([1, 2, 3, 4, 5]) returns [2, 4]', () => {
  const result = filterEvens([1, 2, 3, 4, 5]);
  if (JSON.stringify(result) !== JSON.stringify([2, 4])) {
    throw new Error(`Expected [2, 4] but got ${JSON.stringify(result)}`);
  }
});

// sumArray tests
test('sumArray([1, 2, 3, 4]) returns 10', () => {
  if (sumArray([1, 2, 3, 4]) !== 10) {
    throw new Error(`Expected 10 but got ${sumArray([1, 2, 3, 4])}`);
  }
});

test('sumArray([]) returns 0', () => {
  if (sumArray([]) !== 0) {
    throw new Error(`Expected 0 but got ${sumArray([])}`);
  }
});

// findMax tests
test('findMax([3, 1, 4, 1, 5, 9, 2, 6]) returns 9', () => {
  if (findMax([3, 1, 4, 1, 5, 9, 2, 6]) !== 9) {
    throw new Error(`Expected 9 but got ${findMax([3, 1, 4, 1, 5, 9, 2, 6])}`);
  }
});

test('findMax([-5, -2, -8]) returns -2', () => {
  if (findMax([-5, -2, -8]) !== -2) {
    throw new Error(`Expected -2 but got ${findMax([-5, -2, -8])}`);
  }
});

// pluck tests
test('pluck extracts property from objects', () => {
  const users = [{name: "Alice", age: 30}, {name: "Bob", age: 25}];
  const result = pluck(users, "name");
  if (JSON.stringify(result) !== JSON.stringify(["Alice", "Bob"])) {
    throw new Error(`Expected ["Alice", "Bob"] but got ${JSON.stringify(result)}`);
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed!');
}
