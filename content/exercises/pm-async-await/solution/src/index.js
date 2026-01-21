// Solution

async function fetchData(url, fetchFn) {
  try {
    const result = await fetchFn(url);
    return result;
  } catch (e) {
    return { error: e.message };
  }
}

async function fetchMultiple(urls, fetchFn) {
  const promises = urls.map(url => fetchFn(url));
  return await Promise.all(promises);
}

async function processInOrder(items, processFn) {
  const results = [];
  for (const item of items) {
    const result = await processFn(item);
    results.push(result);
  }
  return results;
}

async function retryAsync(fn, maxAttempts) {
  let lastError;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}

async function withTimeout(asyncFn, ms) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Timeout")), ms);
  });
  return await Promise.race([asyncFn(), timeoutPromise]);
}

module.exports = { fetchData, fetchMultiple, processInOrder, retryAsync, withTimeout };
