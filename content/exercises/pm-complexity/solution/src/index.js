// Solution

const COMPLEXITY_SUM = "O(n)";  // Linear - must visit each element once

function sumArray(arr) {
  let sum = 0;
  for (const num of arr) {
    sum += num;
  }
  return sum;
}

const COMPLEXITY_DUPLICATES = "O(n)";  // Linear with hash set

function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = new Set();

  for (const item of arr) {
    if (seen.has(item)) {
      duplicates.add(item);
    }
    seen.add(item);
  }

  return Array.from(duplicates);
}

const COMPLEXITY_TWOSUM = "O(n)";  // Linear with hash map

function twoSum(arr, target) {
  const seen = new Map();

  for (let i = 0; i < arr.length; i++) {
    const complement = target - arr[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(arr[i], i);
  }

  return null;
}

module.exports = {
  sumArray, COMPLEXITY_SUM,
  findDuplicates, COMPLEXITY_DUPLICATES,
  twoSum, COMPLEXITY_TWOSUM
};
