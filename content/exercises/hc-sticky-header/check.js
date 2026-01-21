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

test('Header has position: sticky', () => {
  if (!css.match(/\.main-header\s*{[^}]*position:\s*sticky/s)) {
    throw new Error('Header should have position: sticky');
  }
});

test('Header has top: 0', () => {
  if (!css.match(/\.main-header\s*{[^}]*top:\s*0/s)) {
    throw new Error('Header should have top: 0 to stick to the top of the viewport');
  }
});

test('Header has z-index', () => {
  if (!css.match(/\.main-header\s*{[^}]*z-index:\s*\d+/s)) {
    throw new Error('Header should have a z-index to appear above content');
  }
});

test('Sections have scroll-margin-top', () => {
  if (!css.match(/section\s*{[^}]*scroll-margin-top:\s*\d+px/s)) {
    throw new Error('Sections should have scroll-margin-top to account for sticky header');
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed! Your sticky header works perfectly!');
}
