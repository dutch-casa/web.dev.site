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

let divide, parseJSON, validateUser, safeDivide;
try {
  const solution = require('./src/index.js');
  divide = solution.divide;
  parseJSON = solution.parseJSON;
  validateUser = solution.validateUser;
  safeDivide = solution.safeDivide;
} catch (e) {
  console.log('✗ Your code has an error:\n');
  console.log(e.message);
  process.exit(1);
}

// divide tests
test('divide(10, 2) returns 5', () => {
  if (divide(10, 2) !== 5) throw new Error(`Expected 5 but got ${divide(10, 2)}`);
});

test('divide(10, 0) throws "Cannot divide by zero"', () => {
  try {
    divide(10, 0);
    throw new Error('Should have thrown');
  } catch (e) {
    if (e.message !== 'Cannot divide by zero') {
      throw new Error(`Expected "Cannot divide by zero" but got "${e.message}"`);
    }
  }
});

// parseJSON tests
test('parseJSON parses valid JSON', () => {
  const result = parseJSON('{"a": 1}');
  if (result.a !== 1) throw new Error(`Expected {a: 1} but got ${JSON.stringify(result)}`);
});

test('parseJSON returns null for invalid JSON', () => {
  const result = parseJSON('not valid json');
  if (result !== null) throw new Error(`Expected null but got ${result}`);
});

// validateUser tests
test('validateUser returns true for valid user', () => {
  const user = {name: "Alice", age: 25, email: "alice@example.com"};
  if (validateUser(user) !== true) throw new Error('Expected true');
});

test('validateUser throws for missing name', () => {
  try {
    validateUser({name: "", age: 25, email: "a@b.com"});
    throw new Error('Should have thrown');
  } catch (e) {
    if (e.message !== 'Name is required') {
      throw new Error(`Expected "Name is required" but got "${e.message}"`);
    }
  }
});

test('validateUser throws for invalid age', () => {
  try {
    validateUser({name: "Alice", age: 0, email: "a@b.com"});
    throw new Error('Should have thrown');
  } catch (e) {
    if (e.message !== 'Age must be positive') {
      throw new Error(`Expected "Age must be positive" but got "${e.message}"`);
    }
  }
});

// safeDivide tests
test('safeDivide returns success result', () => {
  const result = safeDivide(10, 2);
  if (!result.success || result.value !== 5) {
    throw new Error(`Expected {success: true, value: 5} but got ${JSON.stringify(result)}`);
  }
});

test('safeDivide returns error result for division by zero', () => {
  const result = safeDivide(10, 0);
  if (result.success !== false) {
    throw new Error(`Expected {success: false, error: ...} but got ${JSON.stringify(result)}`);
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed!');
}
