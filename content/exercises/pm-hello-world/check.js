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

let output = '';
try {
  output = execSync('node src/index.js', { encoding: 'utf8' }).trim();
} catch (e) {
  console.log('✗ Your code has an error:\n');
  console.log(e.stderr || e.message);
  process.exit(1);
}

test('Program prints "Hello, Programming!"', () => {
  if (output !== 'Hello, Programming!') {
    throw new Error(`Expected "Hello, Programming!" but got "${output}"`);
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed!');
}
