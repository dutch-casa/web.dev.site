// Solution

function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

function fibonacci(n) {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

function sumNested(arr) {
  // Base case: empty array
  if (arr.length === 0) return 0;

  // Recursive case: process first element + rest
  const [first, ...rest] = arr;
  const firstValue = Array.isArray(first) ? sumNested(first) : first;
  return firstValue + sumNested(rest);
}

function flattenArray(arr) {
  // Base case: empty array
  if (arr.length === 0) return [];

  // Recursive case: flatten first element + rest
  const [first, ...rest] = arr;
  const flatFirst = Array.isArray(first) ? flattenArray(first) : [first];
  return [...flatFirst, ...flattenArray(rest)];
}

module.exports = { factorial, fibonacci, sumNested, flattenArray };
