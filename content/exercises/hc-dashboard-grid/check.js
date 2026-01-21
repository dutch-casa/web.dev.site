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

test('Dashboard uses CSS Grid', () => {
  if (!css.match(/\.dashboard\s*{[^}]*display:\s*grid/s)) {
    throw new Error('Dashboard should use display: grid');
  }
});

test('Dashboard has grid-template-areas', () => {
  if (!css.match(/\.dashboard\s*{[^}]*grid-template-areas:/s)) {
    throw new Error('Dashboard should use grid-template-areas for layout');
  }
});

test('Header has grid-area assigned', () => {
  if (!css.match(/\.header\s*{[^}]*grid-area:\s*header/s)) {
    throw new Error('Header should have grid-area: header');
  }
});

test('Sidebar has grid-area assigned', () => {
  if (!css.match(/\.sidebar\s*{[^}]*grid-area:\s*sidebar/s)) {
    throw new Error('Sidebar should have grid-area: sidebar');
  }
});

test('Main content has grid-area assigned', () => {
  if (!css.match(/\.main-content\s*{[^}]*grid-area:\s*main/s)) {
    throw new Error('Main content should have grid-area: main');
  }
});

test('Widget-1 has grid-area assigned', () => {
  if (!css.match(/\.widget-1\s*{[^}]*grid-area:\s*widget1/s)) {
    throw new Error('Widget-1 should have grid-area: widget1');
  }
});

test('Widget-2 has grid-area assigned', () => {
  if (!css.match(/\.widget-2\s*{[^}]*grid-area:\s*widget2/s)) {
    throw new Error('Widget-2 should have grid-area: widget2');
  }
});

test('Widget-3 has grid-area assigned', () => {
  if (!css.match(/\.widget-3\s*{[^}]*grid-area:\s*widget3/s)) {
    throw new Error('Widget-3 should have grid-area: widget3');
  }
});

test('Has responsive media query', () => {
  if (!css.match(/@media[^{]*\(max-width:\s*768px\)/)) {
    throw new Error('Should have a media query for mobile layout');
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed! Your dashboard grid is awesome!');
}
