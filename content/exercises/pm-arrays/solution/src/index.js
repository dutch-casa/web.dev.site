// Solution

function doubleAll(numbers) {
  return numbers.map(n => n * 2);
}

function filterEvens(numbers) {
  return numbers.filter(n => n % 2 === 0);
}

function sumArray(numbers) {
  return numbers.reduce((sum, n) => sum + n, 0);
}

function findMax(numbers) {
  return numbers.reduce((max, n) => n > max ? n : max, numbers[0]);
}

function pluck(objects, key) {
  return objects.map(obj => obj[key]);
}

module.exports = { doubleAll, filterEvens, sumArray, findMax, pluck };
