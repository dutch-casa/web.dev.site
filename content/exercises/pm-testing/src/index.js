// Testing Exercise
//
// Write test functions for the following code. Each test function should:
// - Return true if the test passes
// - Throw an Error with a descriptive message if the test fails
//
// Functions to test (already implemented):
const add = (a, b) => a + b;
const isEven = (n) => n % 2 === 0;
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const getFirst = (arr) => arr[0];

// Write your tests below:

function testAdd() {
  // Test that add(2, 3) returns 5
  // Test that add(-1, 1) returns 0
  // Your code here
}

function testIsEven() {
  // Test that isEven(4) returns true
  // Test that isEven(7) returns false
  // Your code here
}

function testCapitalize() {
  // Test that capitalize("hello") returns "Hello"
  // Test that capitalize("world") returns "World"
  // Your code here
}

function testGetFirst() {
  // Test that getFirst([1, 2, 3]) returns 1
  // Test that getFirst(["a", "b"]) returns "a"
  // Your code here
}

module.exports = { testAdd, testIsEven, testCapitalize, testGetFirst, add, isEven, capitalize, getFirst };
