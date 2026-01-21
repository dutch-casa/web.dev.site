const { execSync } = require('child_process');

console.log('Checking your solution...\n');

let passed = 0;
let failed = 0;

function testAsync(name, fn) {
  return fn().then(() => {
    console.log(`✓ ${name}`);
    passed++;
  }).catch(e => {
    console.log(`✗ ${name}`);
    console.log(`  ${e.message}\n`);
    failed++;
  });
}

let fetchData, fetchMultiple, processInOrder, retryAsync, withTimeout;
try {
  const solution = require('./src/index.js');
  fetchData = solution.fetchData;
  fetchMultiple = solution.fetchMultiple;
  processInOrder = solution.processInOrder;
  retryAsync = solution.retryAsync;
  withTimeout = solution.withTimeout;
} catch (e) {
  console.log('✗ Your code has an error:\n');
  console.log(e.message);
  process.exit(1);
}

async function runTests() {
  // fetchData tests
  await testAsync('fetchData returns result on success', async () => {
    const mockFetch = () => Promise.resolve('data');
    const result = await fetchData('url', mockFetch);
    if (result !== 'data') throw new Error(`Expected 'data' but got '${result}'`);
  });

  await testAsync('fetchData returns error object on failure', async () => {
    const mockFetch = () => Promise.reject(new Error('Network error'));
    const result = await fetchData('url', mockFetch);
    if (!result.error) throw new Error('Expected error property');
    if (result.error !== 'Network error') throw new Error(`Expected 'Network error'`);
  });

  // fetchMultiple tests
  await testAsync('fetchMultiple fetches all in parallel', async () => {
    const mockFetch = (url) => Promise.resolve(`result-${url}`);
    const results = await fetchMultiple(['a', 'b', 'c'], mockFetch);
    if (JSON.stringify(results) !== JSON.stringify(['result-a', 'result-b', 'result-c'])) {
      throw new Error(`Unexpected results`);
    }
  });

  // processInOrder tests
  await testAsync('processInOrder processes sequentially', async () => {
    const order = [];
    const processFn = async (item) => {
      order.push(item);
      return item * 2;
    };
    const results = await processInOrder([1, 2, 3], processFn);
    if (JSON.stringify(results) !== JSON.stringify([2, 4, 6])) {
      throw new Error(`Expected [2, 4, 6]`);
    }
  });

  // retryAsync tests
  await testAsync('retryAsync succeeds on first try', async () => {
    const fn = async () => 'success';
    const result = await retryAsync(fn, 3);
    if (result !== 'success') throw new Error(`Expected 'success'`);
  });

  await testAsync('retryAsync retries until success', async () => {
    let attempts = 0;
    const fn = async () => {
      attempts++;
      if (attempts < 3) throw new Error('fail');
      return 'success';
    };
    const result = await retryAsync(fn, 5);
    if (result !== 'success') throw new Error(`Expected 'success'`);
    if (attempts !== 3) throw new Error(`Expected 3 attempts`);
  });

  await testAsync('retryAsync throws after max attempts', async () => {
    const fn = async () => { throw new Error('always fails'); };
    try {
      await retryAsync(fn, 3);
      throw new Error('Should have thrown');
    } catch (e) {
      if (e.message !== 'always fails') throw new Error(`Unexpected error: ${e.message}`);
    }
  });

  // withTimeout tests
  await testAsync('withTimeout returns result if fast', async () => {
    const fn = async () => 'done';
    const result = await withTimeout(fn, 100);
    if (result !== 'done') throw new Error(`Expected 'done'`);
  });

  await testAsync('withTimeout throws if too slow', async () => {
    const fn = async () => {
      await new Promise(r => setTimeout(r, 200));
      return 'done';
    };
    try {
      await withTimeout(fn, 50);
      throw new Error('Should have thrown');
    } catch (e) {
      if (e.message !== 'Timeout') throw new Error(`Expected 'Timeout' but got '${e.message}'`);
    }
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed === 0) {
    console.log('\n🎉 All tests passed!');
  }
}

runTests();
