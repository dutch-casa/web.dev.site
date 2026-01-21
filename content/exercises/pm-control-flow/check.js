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

let gradeToLetter, fizzBuzz, countVowels;
try {
  const solution = require('./src/index.js');
  gradeToLetter = solution.gradeToLetter;
  fizzBuzz = solution.fizzBuzz;
  countVowels = solution.countVowels;
} catch (e) {
  console.log('✗ Your code has an error:\n');
  console.log(e.message);
  process.exit(1);
}

// gradeToLetter tests
test('gradeToLetter(95) returns "A"', () => {
  if (gradeToLetter(95) !== "A") throw new Error(`Expected "A" but got "${gradeToLetter(95)}"`);
});

test('gradeToLetter(85) returns "B"', () => {
  if (gradeToLetter(85) !== "B") throw new Error(`Expected "B" but got "${gradeToLetter(85)}"`);
});

test('gradeToLetter(75) returns "C"', () => {
  if (gradeToLetter(75) !== "C") throw new Error(`Expected "C" but got "${gradeToLetter(75)}"`);
});

test('gradeToLetter(65) returns "D"', () => {
  if (gradeToLetter(65) !== "D") throw new Error(`Expected "D" but got "${gradeToLetter(65)}"`);
});

test('gradeToLetter(55) returns "F"', () => {
  if (gradeToLetter(55) !== "F") throw new Error(`Expected "F" but got "${gradeToLetter(55)}"`);
});

// fizzBuzz tests
test('fizzBuzz(5) returns correct array', () => {
  const result = fizzBuzz(5);
  const expected = [1, 2, "Fizz", 4, "Buzz"];
  if (JSON.stringify(result) !== JSON.stringify(expected)) {
    throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(result)}`);
  }
});

test('fizzBuzz(15) includes "FizzBuzz" at position 15', () => {
  const result = fizzBuzz(15);
  if (result[14] !== "FizzBuzz") {
    throw new Error(`Expected "FizzBuzz" at index 14 but got "${result[14]}"`);
  }
});

// countVowels tests
test('countVowels("hello") returns 2', () => {
  if (countVowels("hello") !== 2) throw new Error(`Expected 2 but got ${countVowels("hello")}`);
});

test('countVowels("AEIOU") returns 5', () => {
  if (countVowels("AEIOU") !== 5) throw new Error(`Expected 5 but got ${countVowels("AEIOU")}`);
});

test('countVowels("xyz") returns 0', () => {
  if (countVowels("xyz") !== 0) throw new Error(`Expected 0 but got ${countVowels("xyz")}`);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed!');
}
