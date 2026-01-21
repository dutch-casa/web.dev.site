const { execSync } = require('child_process');

console.log('Checking your solution...\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (e) {
    console.log(`✗ ${name}`);
    console.log(`  ${e.message}\n`);
    failed++;
  }
}

function testAsync(name, fn) {
  return new Promise((resolve) => {
    fn().then(() => {
      console.log(`✓ ${name}`);
      passed++;
      resolve();
    }).catch(e => {
      console.log(`✗ ${name}`);
      console.log(`  ${e.message}\n`);
      failed++;
      resolve();
    });
  });
}

let forEach, mapWithCallback, filterWithCallback, delay, retry;
try {
  const solution = require('./src/index.js');
  forEach = solution.forEach;
  mapWithCallback = solution.mapWithCallback;
  filterWithCallback = solution.filterWithCallback;
  delay = solution.delay;
  retry = solution.retry;
} catch (e) {
  console.log('✗ Your code has an error:\n');
  console.log(e.message);
  process.exit(1);
}

// forEach tests
test('forEach calls callback for each element', () => {
  const results = [];
  forEach([1, 2, 3], (el, i) => results.push([el, i]));
  if (JSON.stringify(results) !== JSON.stringify([[1,0], [2,1], [3,2]])) {
    throw new Error(`Unexpected results: ${JSON.stringify(results)}`);
  }
});

// mapWithCallback tests
test('mapWithCallback transforms elements', () => {
  const result = mapWithCallback([1, 2, 3], x => x * 2);
  if (JSON.stringify(result) !== JSON.stringify([2, 4, 6])) {
    throw new Error(`Expected [2, 4, 6] but got ${JSON.stringify(result)}`);
  }
});

// filterWithCallback tests
test('filterWithCallback filters elements', () => {
  const result = filterWithCallback([1, 2, 3, 4, 5], x => x % 2 === 0);
  if (JSON.stringify(result) !== JSON.stringify([2, 4])) {
    throw new Error(`Expected [2, 4] but got ${JSON.stringify(result)}`);
  }
});

// Run async tests
async function runAsyncTests() {
  // delay tests
  await testAsync('delay calls callback after specified time', () => {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      delay(50, () => {
        const elapsed = Date.now() - start;
        if (elapsed < 40) reject(new Error('Called too soon'));
        else resolve();
      });
    });
  });

  // retry tests
  await testAsync('retry succeeds on first try', () => {
    return new Promise((resolve, reject) => {
      const fn = (cb) => cb(null, 'success');
      retry(fn, 3, (err, result) => {
        if (result === 'success') resolve();
        else reject(new Error(`Expected "success" but got ${result}`));
      });
    });
  });

  await testAsync('retry retries on failure', () => {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const fn = (cb) => {
        attempts++;
        if (attempts < 3) cb(new Error('fail'), null);
        else cb(null, 'success');
      };
      retry(fn, 5, (err, result) => {
        if (result === 'success' && attempts === 3) resolve();
        else reject(new Error(`Expected success on attempt 3, got ${result} on attempt ${attempts}`));
      });
    });
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed === 0) {
    console.log('\n🎉 All tests passed!');
  }
}

runAsyncTests();
