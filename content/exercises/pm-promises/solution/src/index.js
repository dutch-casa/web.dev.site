// Solution

function delayedValue(value, ms) {
  return new Promise(resolve => {
    setTimeout(() => resolve(value), ms);
  });
}

function fetchSequential(urls, fetchFn) {
  return urls.reduce((chain, url) => {
    return chain.then(results => {
      return fetchFn(url).then(result => [...results, result]);
    });
  }, Promise.resolve([]));
}

function fetchParallel(urls, fetchFn) {
  return Promise.all(urls.map(url => fetchFn(url)));
}

function fetchFirst(urls, fetchFn) {
  return Promise.race(urls.map(url => fetchFn(url)));
}

function timeout(promise, ms) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Timeout")), ms);
  });
  return Promise.race([promise, timeoutPromise]);
}

module.exports = { delayedValue, fetchSequential, fetchParallel, fetchFirst, timeout };
