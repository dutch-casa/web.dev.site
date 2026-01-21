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

let uniqueValues, wordFrequency, intersection, groupBy;
try {
  const solution = require('./src/index.js');
  uniqueValues = solution.uniqueValues;
  wordFrequency = solution.wordFrequency;
  intersection = solution.intersection;
  groupBy = solution.groupBy;
} catch (e) {
  console.log('✗ Your code has an error:\n');
  console.log(e.message);
  process.exit(1);
}

// uniqueValues tests
test('uniqueValues removes duplicates', () => {
  const result = uniqueValues([1, 2, 2, 3, 3, 3]);
  if (JSON.stringify(result.sort()) !== JSON.stringify([1, 2, 3])) {
    throw new Error(`Expected [1, 2, 3] but got ${JSON.stringify(result)}`);
  }
});

// wordFrequency tests
test('wordFrequency counts words', () => {
  const result = wordFrequency("hello world hello");
  if (!(result instanceof Map)) throw new Error('Should return a Map');
  if (result.get("hello") !== 2) throw new Error('hello should have count 2');
  if (result.get("world") !== 1) throw new Error('world should have count 1');
});

test('wordFrequency handles empty string', () => {
  const result = wordFrequency("");
  if (result.size !== 0) throw new Error('Should return empty Map for empty string');
});

// intersection tests
test('intersection finds common elements', () => {
  const result = intersection([1, 2, 3, 4], [3, 4, 5, 6]);
  if (JSON.stringify(result.sort()) !== JSON.stringify([3, 4])) {
    throw new Error(`Expected [3, 4] but got ${JSON.stringify(result)}`);
  }
});

test('intersection returns empty for no common', () => {
  const result = intersection([1, 2], [3, 4]);
  if (result.length !== 0) throw new Error('Should return empty array');
});

// groupBy tests
test('groupBy groups by function result', () => {
  const result = groupBy([1, 2, 3, 4, 5, 6], n => n % 2 === 0 ? "even" : "odd");
  if (!(result instanceof Map)) throw new Error('Should return a Map');
  if (JSON.stringify(result.get("odd")) !== JSON.stringify([1, 3, 5])) {
    throw new Error('odd group incorrect');
  }
  if (JSON.stringify(result.get("even")) !== JSON.stringify([2, 4, 6])) {
    throw new Error('even group incorrect');
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed!');
}
