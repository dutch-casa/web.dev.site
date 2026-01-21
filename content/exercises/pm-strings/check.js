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

let capitalize, reverseString, isPalindrome, truncate;
try {
  const solution = require('./src/index.js');
  capitalize = solution.capitalize;
  reverseString = solution.reverseString;
  isPalindrome = solution.isPalindrome;
  truncate = solution.truncate;
} catch (e) {
  console.log('✗ Your code has an error:\n');
  console.log(e.message);
  process.exit(1);
}

// capitalize tests
test('capitalize("hello world") returns "Hello World"', () => {
  const result = capitalize("hello world");
  if (result !== "Hello World") throw new Error(`Expected "Hello World" but got "${result}"`);
});

test('capitalize("JAVASCRIPT") returns "Javascript"', () => {
  const result = capitalize("JAVASCRIPT");
  if (result !== "Javascript") throw new Error(`Expected "Javascript" but got "${result}"`);
});

// reverseString tests
test('reverseString("hello") returns "olleh"', () => {
  const result = reverseString("hello");
  if (result !== "olleh") throw new Error(`Expected "olleh" but got "${result}"`);
});

test('reverseString("ab") returns "ba"', () => {
  const result = reverseString("ab");
  if (result !== "ba") throw new Error(`Expected "ba" but got "${result}"`);
});

// isPalindrome tests
test('isPalindrome("Race Car") returns true', () => {
  if (isPalindrome("Race Car") !== true) throw new Error(`Expected true but got false`);
});

test('isPalindrome("hello") returns false', () => {
  if (isPalindrome("hello") !== false) throw new Error(`Expected false but got true`);
});

test('isPalindrome("A man a plan a canal Panama") returns true', () => {
  if (isPalindrome("A man a plan a canal Panama") !== true) throw new Error(`Expected true`);
});

// truncate tests
test('truncate("Hello World", 8) returns "Hello..."', () => {
  const result = truncate("Hello World", 8);
  if (result !== "Hello...") throw new Error(`Expected "Hello..." but got "${result}"`);
});

test('truncate("Hi", 10) returns "Hi" (no truncation needed)', () => {
  const result = truncate("Hi", 10);
  if (result !== "Hi") throw new Error(`Expected "Hi" but got "${result}"`);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed!');
}
