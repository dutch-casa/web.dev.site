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

let delayedValue, fetchSequential, fetchParallel, fetchFirst, timeout;
try {
  const solution = require('./src/index.js');
  delayedValue = solution.delayedValue;
  fetchSequential = solution.fetchSequential;
  fetchParallel = solution.fetchParallel;
  fetchFirst = solution.fetchFirst;
  timeout = solution.timeout;
} catch (e) {
  console.log('✗ Your code has an error:\n');
  console.log(e.message);
  process.exit(1);
}

async function runTests() {
  // delayedValue tests
  await testAsync('delayedValue resolves after delay', async () => {
    const start = Date.now();
    const result = await delayedValue('hello', 50);
    const elapsed = Date.now() - start;
    if (result !== 'hello') throw new Error(`Expected 'hello' but got '${result}'`);
    if (elapsed < 40) throw new Error('Resolved too quickly');
  });

  // fetchSequential tests
  await testAsync('fetchSequential fetches in order', async () => {
    const order = [];
    const mockFetch = (url) => {
      order.push(url);
      return Promise.resolve(`result-${url}`);
    };
    const results = await fetchSequential(['a', 'b', 'c'], mockFetch);
    if (JSON.stringify(results) !== JSON.stringify(['result-a', 'result-b', 'result-c'])) {
      throw new Error(`Unexpected results: ${JSON.stringify(results)}`);
    }
  });

  // fetchParallel tests
  await testAsync('fetchParallel fetches all at once', async () => {
    const mockFetch = (url) => Promise.resolve(`result-${url}`);
    const results = await fetchParallel(['a', 'b', 'c'], mockFetch);
    if (JSON.stringify(results) !== JSON.stringify(['result-a', 'result-b', 'result-c'])) {
      throw new Error(`Unexpected results: ${JSON.stringify(results)}`);
    }
  });

  // fetchFirst tests
  await testAsync('fetchFirst returns first result', async () => {
    const mockFetch = (url) => {
      const delay = url === 'fast' ? 10 : 100;
      return new Promise(resolve => setTimeout(() => resolve(`result-${url}`), delay));
    };
    const result = await fetchFirst(['slow', 'fast'], mockFetch);
    if (result !== 'result-fast') throw new Error(`Expected 'result-fast' but got '${result}'`);
  });

  // timeout tests
  await testAsync('timeout resolves if fast enough', async () => {
    const fast = Promise.resolve('done');
    const result = await timeout(fast, 100);
    if (result !== 'done') throw new Error(`Expected 'done' but got '${result}'`);
  });

  await testAsync('timeout rejects if too slow', async () => {
    const slow = new Promise(resolve => setTimeout(() => resolve('done'), 200));
    try {
      await timeout(slow, 50);
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
