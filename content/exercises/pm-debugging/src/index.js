// Debugging Exercise
//
// Each function below has a bug. Find and fix them!
//
// 1. calculateAverage - Should return the average of an array of numbers
//    Bug: Currently returns wrong value
//
// 2. findIndex - Should return the index of an element, or -1 if not found
//    Bug: Returns wrong value for first element
//
// 3. removeDuplicates - Should remove duplicate values from array
//    Bug: Doesn't work correctly
//
// 4. countWords - Should count words in a string (words separated by spaces)
//    Bug: Returns wrong count for strings with multiple spaces

function calculateAverage(numbers) {
  let sum = 0;
  for (let i = 0; i <= numbers.length; i++) {  // Bug is here
    sum += numbers[i];
  }
  return sum / numbers.length;
}

function findIndex(arr, element) {
  for (let i = 1; i < arr.length; i++) {  // Bug is here
    if (arr[i] === element) {
      return i;
    }
  }
  return -1;
}

function removeDuplicates(arr) {
  const seen = [];
  const result = [];
  for (const item of arr) {
    if (!seen[item]) {  // Bug is here - seen should track differently
      seen[item] = true;
      result.push(item);
    }
  }
  return result;
}

function countWords(str) {
  if (str.length === 0) return 0;
  return str.split(' ').length;  // Bug: doesn't handle multiple spaces
}

module.exports = { calculateAverage, findIndex, removeDuplicates, countWords };
