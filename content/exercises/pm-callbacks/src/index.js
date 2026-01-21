// Callbacks Exercise
//
// Complete these functions that work with callbacks:
//
// 1. forEach(arr, callback) - Call callback(element, index) for each element
//
// 2. mapWithCallback(arr, callback) - Like Array.map but using callbacks
//    callback(element, index) should return transformed value
//    Return new array of transformed values
//
// 3. filterWithCallback(arr, callback) - Like Array.filter but using callbacks
//    callback(element, index) should return true/false
//    Return new array with elements where callback returned true
//
// 4. delay(ms, callback) - Call callback after ms milliseconds
//    (Use setTimeout)
//
// 5. retry(fn, maxAttempts, callback) - Retry a function until it succeeds
//    fn is a function that takes a callback(error, result)
//    Keep trying until fn succeeds or maxAttempts reached
//    Call callback(error, result) with final result

function forEach(arr, callback) {
  // Your code here
}

function mapWithCallback(arr, callback) {
  // Your code here
}

function filterWithCallback(arr, callback) {
  // Your code here
}

function delay(ms, callback) {
  // Your code here
}

function retry(fn, maxAttempts, callback) {
  // Your code here
}

module.exports = { forEach, mapWithCallback, filterWithCallback, delay, retry };
