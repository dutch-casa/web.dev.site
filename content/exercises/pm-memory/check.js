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

let shallowCopy, deepCopy, areEqual, freezeDeep;
try {
  const solution = require('./src/index.js');
  shallowCopy = solution.shallowCopy;
  deepCopy = solution.deepCopy;
  areEqual = solution.areEqual;
  freezeDeep = solution.freezeDeep;
} catch (e) {
  console.log('✗ Your code has an error:\n');
  console.log(e.message);
  process.exit(1);
}

// shallowCopy tests
test('shallowCopy creates independent array', () => {
  const original = [1, 2, 3];
  const copy = shallowCopy(original);
  copy[0] = 99;
  if (original[0] !== 1) {
    throw new Error('Modifying copy affected original');
  }
});

// deepCopy tests
test('deepCopy creates independent nested objects', () => {
  const original = {a: {b: 1}};
  const copy = deepCopy(original);
  copy.a.b = 99;
  if (original.a.b !== 1) {
    throw new Error('Modifying nested property affected original');
  }
});

test('deepCopy handles arrays', () => {
  const original = {arr: [1, 2, 3]};
  const copy = deepCopy(original);
  copy.arr.push(4);
  if (original.arr.length !== 3) {
    throw new Error('Modifying nested array affected original');
  }
});

// areEqual tests
test('areEqual compares primitives', () => {
  if (!areEqual(5, 5)) throw new Error('5 should equal 5');
  if (areEqual(5, 6)) throw new Error('5 should not equal 6');
});

test('areEqual compares arrays', () => {
  if (!areEqual([1, 2, 3], [1, 2, 3])) throw new Error('Arrays should be equal');
  if (areEqual([1, 2], [1, 2, 3])) throw new Error('Different length arrays should not be equal');
});

test('areEqual compares nested objects', () => {
  const a = {x: {y: 1}};
  const b = {x: {y: 1}};
  if (!areEqual(a, b)) throw new Error('Nested objects should be equal');
});

// freezeDeep tests
test('freezeDeep freezes nested objects', () => {
  const obj = {a: {b: 1}};
  freezeDeep(obj);
  try {
    obj.a.b = 99;
  } catch (e) {
    // Expected in strict mode
  }
  if (obj.a.b === 99) {
    throw new Error('Nested object was not frozen');
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed!');
}
