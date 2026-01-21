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

test('Sets color-scheme property', () => {
  if (!css.includes('color-scheme:')) {
    throw new Error('Add color-scheme: light dark; to enable automatic theme switching');
  }
});

test('Uses CSS custom properties for colors', () => {
  if (!css.match(/--color-\w+:/)) {
    throw new Error('Define color custom properties using --color-* naming');
  }
});

test('Defines at least 4 color variables', () => {
  const matches = css.match(/--color-\w+:/g);
  if (!matches || matches.length < 4) {
    throw new Error('Create at least 4 color variables (background, text, accent, etc.)');
  }
});

test('Uses light-dark() function OR prefers-color-scheme media query', () => {
  const hasLightDark = css.includes('light-dark(');
  const hasMediaQuery = css.includes('@media') && css.includes('prefers-color-scheme');
  if (!hasLightDark && !hasMediaQuery) {
    throw new Error('Use light-dark() function or @media (prefers-color-scheme: dark) for theme switching');
  }
});

test('Applies background color from theme', () => {
  if (!css.match(/background-color:\s*var\(--color-/)) {
    throw new Error('Apply background color using custom property');
  }
});

test('Applies text color from theme', () => {
  if (!css.match(/color:\s*var\(--color-/)) {
    throw new Error('Apply text color using custom property');
  }
});

test('Uses modern color syntax (oklch recommended)', () => {
  const hasModernColor = css.includes('oklch(') || css.includes('oklab(') || css.includes('lch(') || css.includes('lab(');
  if (!hasModernColor) {
    console.log('  ℹ Consider using oklch() for more perceptually uniform colors');
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed! Your theme system adapts to user preferences.');
}
