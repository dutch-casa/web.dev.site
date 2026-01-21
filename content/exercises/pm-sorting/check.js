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

let bubbleSort, insertionSort, sortByKey;
try {
  const solution = require('./src/index.js');
  bubbleSort = solution.bubbleSort;
  insertionSort = solution.insertionSort;
  sortByKey = solution.sortByKey;
} catch (e) {
  console.log('✗ Your code has an error:\n');
  console.log(e.message);
  process.exit(1);
}

// bubbleSort tests
test('bubbleSort sorts numbers', () => {
  const result = bubbleSort([64, 34, 25, 12, 22, 11, 90]);
  const expected = [11, 12, 22, 25, 34, 64, 90];
  if (JSON.stringify(result) !== JSON.stringify(expected)) {
    throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(result)}`);
  }
});

test('bubbleSort does not modify original', () => {
  const original = [3, 1, 2];
  bubbleSort(original);
  if (JSON.stringify(original) !== JSON.stringify([3, 1, 2])) {
    throw new Error('Original array was modified');
  }
});

// insertionSort tests
test('insertionSort sorts numbers', () => {
  const result = insertionSort([5, 2, 8, 1, 9]);
  const expected = [1, 2, 5, 8, 9];
  if (JSON.stringify(result) !== JSON.stringify(expected)) {
    throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(result)}`);
  }
});

test('insertionSort handles already sorted', () => {
  const result = insertionSort([1, 2, 3]);
  if (JSON.stringify(result) !== JSON.stringify([1, 2, 3])) {
    throw new Error('Should handle already sorted array');
  }
});

// sortByKey tests
test('sortByKey sorts by string property', () => {
  const input = [{name: "Charlie"}, {name: "Alice"}, {name: "Bob"}];
  const result = sortByKey(input, "name");
  if (result[0].name !== "Alice" || result[1].name !== "Bob" || result[2].name !== "Charlie") {
    throw new Error('Not sorted correctly by name');
  }
});

test('sortByKey sorts by number property', () => {
  const input = [{age: 30}, {age: 20}, {age: 25}];
  const result = sortByKey(input, "age");
  if (result[0].age !== 20 || result[1].age !== 25 || result[2].age !== 30) {
    throw new Error('Not sorted correctly by age');
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed!');
}
