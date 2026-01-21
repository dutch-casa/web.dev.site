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

let sumArray, COMPLEXITY_SUM, findDuplicates, COMPLEXITY_DUPLICATES, twoSum, COMPLEXITY_TWOSUM;
try {
  const solution = require('./src/index.js');
  sumArray = solution.sumArray;
  COMPLEXITY_SUM = solution.COMPLEXITY_SUM;
  findDuplicates = solution.findDuplicates;
  COMPLEXITY_DUPLICATES = solution.COMPLEXITY_DUPLICATES;
  twoSum = solution.twoSum;
  COMPLEXITY_TWOSUM = solution.COMPLEXITY_TWOSUM;
} catch (e) {
  console.log('✗ Your code has an error:\n');
  console.log(e.message);
  process.exit(1);
}

// sumArray tests
test('sumArray returns correct sum', () => {
  if (sumArray([1, 2, 3, 4, 5]) !== 15) throw new Error('Expected 15');
});

test('sumArray complexity is O(n)', () => {
  if (COMPLEXITY_SUM !== "O(n)") throw new Error(`Expected O(n) but got ${COMPLEXITY_SUM}`);
});

// findDuplicates tests
test('findDuplicates finds duplicates', () => {
  const result = findDuplicates([1, 2, 2, 3, 3, 3, 4]);
  const sorted = result.sort((a, b) => a - b);
  if (JSON.stringify(sorted) !== JSON.stringify([2, 3])) {
    throw new Error(`Expected [2, 3] but got ${JSON.stringify(sorted)}`);
  }
});

test('findDuplicates returns empty for no duplicates', () => {
  const result = findDuplicates([1, 2, 3]);
  if (result.length !== 0) throw new Error('Expected empty array');
});

test('findDuplicates complexity is O(n)', () => {
  if (COMPLEXITY_DUPLICATES !== "O(n)") throw new Error(`Expected O(n) but got ${COMPLEXITY_DUPLICATES}`);
});

// twoSum tests
test('twoSum finds pair', () => {
  const result = twoSum([2, 7, 11, 15], 9);
  if (!result || result[0] !== 0 || result[1] !== 1) {
    throw new Error(`Expected [0, 1] but got ${JSON.stringify(result)}`);
  }
});

test('twoSum returns null when no pair', () => {
  const result = twoSum([1, 2, 3], 100);
  if (result !== null) throw new Error('Expected null');
});

test('twoSum complexity is O(n)', () => {
  if (COMPLEXITY_TWOSUM !== "O(n)") throw new Error(`Expected O(n) but got ${COMPLEXITY_TWOSUM}`);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed!');
}
