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

let Counter, BankAccount;
try {
  const solution = require('./src/index.js');
  Counter = solution.Counter;
  BankAccount = solution.BankAccount;
} catch (e) {
  console.log('✗ Your code has an error:\n');
  console.log(e.message);
  process.exit(1);
}

// Counter tests
test('Counter starts at 0 by default', () => {
  const c = new Counter();
  if (c.getCount() !== 0) throw new Error(`Expected 0 but got ${c.getCount()}`);
});

test('Counter starts at custom value', () => {
  const c = new Counter(10);
  if (c.getCount() !== 10) throw new Error(`Expected 10 but got ${c.getCount()}`);
});

test('Counter increment and decrement work', () => {
  const c = new Counter(5);
  c.increment();
  c.increment();
  if (c.getCount() !== 7) throw new Error(`Expected 7 after increment`);
  c.decrement();
  if (c.getCount() !== 6) throw new Error(`Expected 6 after decrement`);
});

test('Counter reset returns to initial', () => {
  const c = new Counter(5);
  c.increment();
  c.increment();
  c.reset();
  if (c.getCount() !== 5) throw new Error(`Expected 5 after reset`);
});

// BankAccount tests
test('BankAccount deposit works', () => {
  const account = new BankAccount("Alice", 100);
  const newBalance = account.deposit(50);
  if (newBalance !== 150) throw new Error(`Expected 150 but got ${newBalance}`);
});

test('BankAccount withdraw works', () => {
  const account = new BankAccount("Alice", 100);
  const newBalance = account.withdraw(30);
  if (newBalance !== 70) throw new Error(`Expected 70 but got ${newBalance}`);
});

test('BankAccount withdraw throws on insufficient funds', () => {
  const account = new BankAccount("Alice", 50);
  try {
    account.withdraw(100);
    throw new Error('Should have thrown');
  } catch (e) {
    if (e.message !== 'Insufficient funds') {
      throw new Error(`Expected "Insufficient funds" but got "${e.message}"`);
    }
  }
});

test('BankAccount.createJointAccount works', () => {
  const a1 = new BankAccount("Alice", 100);
  const a2 = new BankAccount("Bob", 200);
  const joint = BankAccount.createJointAccount(a1, a2);
  if (joint.getBalance() !== 300) throw new Error(`Expected 300 but got ${joint.getBalance()}`);
  if (joint.owner !== "Joint") throw new Error(`Expected owner "Joint"`);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed!');
}
