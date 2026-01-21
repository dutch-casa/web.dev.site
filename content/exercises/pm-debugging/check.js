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

let calculateAverage, findIndex, removeDuplicates, countWords;
try {
  const solution = require('./src/index.js');
  calculateAverage = solution.calculateAverage;
  findIndex = solution.findIndex;
  removeDuplicates = solution.removeDuplicates;
  countWords = solution.countWords;
} catch (e) {
  console.log('✗ Your code has an error:\n');
  console.log(e.message);
  process.exit(1);
}

// calculateAverage tests
test('calculateAverage([1, 2, 3, 4, 5]) returns 3', () => {
  const result = calculateAverage([1, 2, 3, 4, 5]);
  if (result !== 3) throw new Error(`Expected 3 but got ${result}`);
});

test('calculateAverage([10, 20]) returns 15', () => {
  const result = calculateAverage([10, 20]);
  if (result !== 15) throw new Error(`Expected 15 but got ${result}`);
});

// findIndex tests
test('findIndex finds first element', () => {
  const result = findIndex(['a', 'b', 'c'], 'a');
  if (result !== 0) throw new Error(`Expected 0 but got ${result}`);
});

test('findIndex finds middle element', () => {
  const result = findIndex(['a', 'b', 'c'], 'b');
  if (result !== 1) throw new Error(`Expected 1 but got ${result}`);
});

test('findIndex returns -1 for missing element', () => {
  const result = findIndex(['a', 'b', 'c'], 'z');
  if (result !== -1) throw new Error(`Expected -1 but got ${result}`);
});

// removeDuplicates tests
test('removeDuplicates removes number duplicates', () => {
  const result = removeDuplicates([1, 2, 2, 3, 1, 4]);
  if (JSON.stringify(result) !== JSON.stringify([1, 2, 3, 4])) {
    throw new Error(`Expected [1, 2, 3, 4] but got ${JSON.stringify(result)}`);
  }
});

test('removeDuplicates removes string duplicates', () => {
  const result = removeDuplicates(['a', 'b', 'a', 'c']);
  if (JSON.stringify(result) !== JSON.stringify(['a', 'b', 'c'])) {
    throw new Error(`Expected ["a", "b", "c"] but got ${JSON.stringify(result)}`);
  }
});

// countWords tests
test('countWords counts simple sentence', () => {
  const result = countWords("hello world");
  if (result !== 2) throw new Error(`Expected 2 but got ${result}`);
});

test('countWords handles multiple spaces', () => {
  const result = countWords("hello   world");
  if (result !== 2) throw new Error(`Expected 2 but got ${result}`);
});

test('countWords returns 0 for empty string', () => {
  const result = countWords("");
  if (result !== 0) throw new Error(`Expected 0 but got ${result}`);
});

test('countWords returns 0 for whitespace only', () => {
  const result = countWords("   ");
  if (result !== 0) throw new Error(`Expected 0 but got ${result}`);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed!');
}
