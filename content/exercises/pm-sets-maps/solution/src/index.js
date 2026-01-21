// Solution

function uniqueValues(arr) {
  return Array.from(new Set(arr));
}

function wordFrequency(str) {
  const words = str.split(/\s+/).filter(w => w.length > 0);
  const frequency = new Map();

  for (const word of words) {
    frequency.set(word, (frequency.get(word) || 0) + 1);
  }

  return frequency;
}

function intersection(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  const result = [];

  for (const item of set1) {
    if (set2.has(item)) {
      result.push(item);
    }
  }

  return result;
}

function groupBy(arr, keyFn) {
  const groups = new Map();

  for (const item of arr) {
    const key = keyFn(item);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(item);
  }

  return groups;
}

module.exports = { uniqueValues, wordFrequency, intersection, groupBy };
