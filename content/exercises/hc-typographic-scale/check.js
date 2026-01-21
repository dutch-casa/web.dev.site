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

test('Uses CSS custom properties for font sizes', () => {
  if (!css.includes('--font-size-')) {
    throw new Error('Define font size custom properties using --font-size-* naming');
  }
});

test('Defines at least 5 font size variables', () => {
  const matches = css.match(/--font-size-\w+:/g);
  if (!matches || matches.length < 5) {
    throw new Error('Create at least 5 font size variables for your scale');
  }
});

test('Uses rem units for font sizes', () => {
  if (!css.match(/--font-size-\w+:\s*[\d.]+rem/)) {
    throw new Error('Use rem units for font sizes to support accessibility');
  }
});

test('Applies custom properties to h1', () => {
  if (!css.match(/h1\s*{[^}]*font-size:\s*var\(--font-size-/s)) {
    throw new Error('Apply a font size custom property to h1');
  }
});

test('Applies custom properties to h2', () => {
  if (!css.match(/h2\s*{[^}]*font-size:\s*var\(--font-size-/s)) {
    throw new Error('Apply a font size custom property to h2');
  }
});

test('Applies custom properties to h3', () => {
  if (!css.match(/h3\s*{[^}]*font-size:\s*var\(--font-size-/s)) {
    throw new Error('Apply a font size custom property to h3');
  }
});

test('Includes line-height for headings', () => {
  if (!css.match(/h[1-6]\s*{[^}]*line-height:/s)) {
    throw new Error('Add line-height values for headings (larger text needs tighter line-height)');
  }
});

test('Styles the .lead class', () => {
  if (!css.match(/\.lead\s*{[^}]*font-size:/s)) {
    throw new Error('Style the .lead class with a larger font size');
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed! Your typographic scale creates a clear visual hierarchy.');
}
