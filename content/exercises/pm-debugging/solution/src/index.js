// Solution - All bugs fixed

function calculateAverage(numbers) {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {  // Fixed: < instead of <=
    sum += numbers[i];
  }
  return sum / numbers.length;
}

function findIndex(arr, element) {
  for (let i = 0; i < arr.length; i++) {  // Fixed: start at 0, not 1
    if (arr[i] === element) {
      return i;
    }
  }
  return -1;
}

function removeDuplicates(arr) {
  const seen = new Set();  // Fixed: use Set instead of array
  const result = [];
  for (const item of arr) {
    if (!seen.has(item)) {  // Fixed: use Set.has()
      seen.add(item);
      result.push(item);
    }
  }
  return result;
}

function countWords(str) {
  if (str.trim().length === 0) return 0;  // Fixed: trim first
  return str.trim().split(/\s+/).length;  // Fixed: split on regex for multiple spaces
}

module.exports = { calculateAverage, findIndex, removeDuplicates, countWords };
