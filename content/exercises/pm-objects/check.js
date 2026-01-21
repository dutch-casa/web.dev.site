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

let createPerson, getProperty, mergeObjects, countProperties;
try {
  const solution = require('./src/index.js');
  createPerson = solution.createPerson;
  getProperty = solution.getProperty;
  mergeObjects = solution.mergeObjects;
  countProperties = solution.countProperties;
} catch (e) {
  console.log('✗ Your code has an error:\n');
  console.log(e.message);
  process.exit(1);
}

// createPerson tests
test('createPerson returns object with name and age', () => {
  const person = createPerson("Alice", 30);
  if (person.name !== "Alice" || person.age !== 30) {
    throw new Error(`Expected {name: "Alice", age: 30} but got ${JSON.stringify(person)}`);
  }
});

test('createPerson has working greet method', () => {
  const person = createPerson("Bob", 25);
  const greeting = person.greet();
  if (greeting !== "Hello, my name is Bob") {
    throw new Error(`Expected "Hello, my name is Bob" but got "${greeting}"`);
  }
});

// getProperty tests
test('getProperty gets nested property', () => {
  const obj = {a: {b: {c: 42}}};
  if (getProperty(obj, "a.b.c") !== 42) {
    throw new Error(`Expected 42 but got ${getProperty(obj, "a.b.c")}`);
  }
});

test('getProperty returns undefined for missing path', () => {
  const obj = {a: 1};
  if (getProperty(obj, "b.c") !== undefined) {
    throw new Error(`Expected undefined but got ${getProperty(obj, "b.c")}`);
  }
});

// mergeObjects tests
test('mergeObjects combines two objects', () => {
  const result = mergeObjects({a: 1}, {b: 2});
  if (result.a !== 1 || result.b !== 2) {
    throw new Error(`Expected {a: 1, b: 2} but got ${JSON.stringify(result)}`);
  }
});

test('mergeObjects overwrites with second object', () => {
  const result = mergeObjects({a: 1}, {a: 2});
  if (result.a !== 2) {
    throw new Error(`Expected {a: 2} but got ${JSON.stringify(result)}`);
  }
});

// countProperties tests
test('countProperties counts object keys', () => {
  if (countProperties({a: 1, b: 2, c: 3}) !== 3) {
    throw new Error(`Expected 3`);
  }
});

test('countProperties returns 0 for empty object', () => {
  if (countProperties({}) !== 0) {
    throw new Error(`Expected 0`);
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed!');
}
