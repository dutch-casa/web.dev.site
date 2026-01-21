const fs = require('fs');
const path = require('path');

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

const css = fs.readFileSync(path.join(__dirname, 'src/styles.css'), 'utf8');

test('Main nav uses flexbox', () => {
  if (!css.match(/\.main-nav\s*{[^}]*display:\s*flex/s)) {
    throw new Error('Main nav should use display: flex');
  }
});

test('Main nav has flex-wrap', () => {
  if (!css.match(/\.main-nav\s*{[^}]*flex-wrap:\s*wrap/s)) {
    throw new Error('Main nav should have flex-wrap: wrap for responsive behavior');
  }
});

test('Main nav uses gap property', () => {
  if (!css.match(/\.main-nav\s*{[^}]*gap:\s*[\d.]+(?:rem|px)/s)) {
    throw new Error('Main nav should use gap property for spacing');
  }
});

test('Nav links use flexbox', () => {
  if (!css.match(/\.nav-links\s*{[^}]*display:\s*flex/s)) {
    throw new Error('Nav links should use display: flex');
  }
});

test('Nav links have flex-wrap', () => {
  if (!css.match(/\.nav-links\s*{[^}]*flex-wrap:\s*wrap/s)) {
    throw new Error('Nav links should have flex-wrap: wrap');
  }
});

test('Nav links use gap property', () => {
  if (!css.match(/\.nav-links\s*{[^}]*gap:\s*[\d.]+(?:rem|px)/s)) {
    throw new Error('Nav links should use gap property for spacing');
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed! Your flexbox navigation is perfect!');
}
