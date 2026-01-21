// Async/Await Exercise
//
// Rewrite these functions using async/await:
//
// 1. fetchData(url, fetchFn) - Fetch data and return it
//    fetchFn returns a Promise
//    Handle errors by returning { error: message }
//
// 2. fetchMultiple(urls, fetchFn) - Fetch multiple URLs in parallel
//    Return array of results (use Promise.all with await)
//
// 3. processInOrder(items, processFn) - Process items one at a time
//    processFn is async and takes an item
//    Return array of results in order
//
// 4. retryAsync(fn, maxAttempts) - Retry an async function
//    fn is async and might throw
//    Return result on success
//    Throw last error if all attempts fail
//
// 5. withTimeout(asyncFn, ms) - Run async function with timeout
//    Return result if completes in time
//    Throw Error "Timeout" if takes too long

async function fetchData(url, fetchFn) {
  // Your code here
}

async function fetchMultiple(urls, fetchFn) {
  // Your code here
}

async function processInOrder(items, processFn) {
  // Your code here
}

async function retryAsync(fn, maxAttempts) {
  // Your code here
}

async function withTimeout(asyncFn, ms) {
  // Your code here
}

module.exports = { fetchData, fetchMultiple, processInOrder, retryAsync, withTimeout };
