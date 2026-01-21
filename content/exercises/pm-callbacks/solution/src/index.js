// Solution

function forEach(arr, callback) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i);
  }
}

function mapWithCallback(arr, callback) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(callback(arr[i], i));
  }
  return result;
}

function filterWithCallback(arr, callback) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (callback(arr[i], i)) {
      result.push(arr[i]);
    }
  }
  return result;
}

function delay(ms, callback) {
  setTimeout(callback, ms);
}

function retry(fn, maxAttempts, callback) {
  let attempts = 0;

  function attempt() {
    attempts++;
    fn((error, result) => {
      if (!error) {
        callback(null, result);
      } else if (attempts < maxAttempts) {
        attempt();
      } else {
        callback(error, null);
      }
    });
  }

  attempt();
}

module.exports = { forEach, mapWithCallback, filterWithCallback, delay, retry };
