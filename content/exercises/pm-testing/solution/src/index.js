// Solution

const add = (a, b) => a + b;
const isEven = (n) => n % 2 === 0;
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const getFirst = (arr) => arr[0];

function testAdd() {
  if (add(2, 3) !== 5) {
    throw new Error("add(2, 3) should return 5");
  }
  if (add(-1, 1) !== 0) {
    throw new Error("add(-1, 1) should return 0");
  }
  return true;
}

function testIsEven() {
  if (isEven(4) !== true) {
    throw new Error("isEven(4) should return true");
  }
  if (isEven(7) !== false) {
    throw new Error("isEven(7) should return false");
  }
  return true;
}

function testCapitalize() {
  if (capitalize("hello") !== "Hello") {
    throw new Error('capitalize("hello") should return "Hello"');
  }
  if (capitalize("world") !== "World") {
    throw new Error('capitalize("world") should return "World"');
  }
  return true;
}

function testGetFirst() {
  if (getFirst([1, 2, 3]) !== 1) {
    throw new Error("getFirst([1, 2, 3]) should return 1");
  }
  if (getFirst(["a", "b"]) !== "a") {
    throw new Error('getFirst(["a", "b"]) should return "a"');
  }
  return true;
}

module.exports = { testAdd, testIsEven, testCapitalize, testGetFirst, add, isEven, capitalize, getFirst };
