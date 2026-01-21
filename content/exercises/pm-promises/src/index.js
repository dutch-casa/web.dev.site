// Promises Exercise
//
// Complete these functions that work with Promises:
//
// 1. delayedValue(value, ms) - Return a promise that resolves to value after ms milliseconds
//
// 2. fetchSequential(urls, fetchFn) - Fetch URLs one after another
//    fetchFn(url) returns a Promise with the result
//    Return array of all results in order
//
// 3. fetchParallel(urls, fetchFn) - Fetch all URLs at once
//    Return array of all results (use Promise.all)
//
// 4. fetchFirst(urls, fetchFn) - Return the first successful result
//    (use Promise.race)
//
// 5. timeout(promise, ms) - Add timeout to a promise
//    If promise doesn't resolve within ms, reject with Error "Timeout"

function delayedValue(value, ms) {
  // Your code here
}

function fetchSequential(urls, fetchFn) {
  // Your code here
}

function fetchParallel(urls, fetchFn) {
  // Your code here
}

function fetchFirst(urls, fetchFn) {
  // Your code here
}

function timeout(promise, ms) {
  // Your code here
}

module.exports = { delayedValue, fetchSequential, fetchParallel, fetchFirst, timeout };
