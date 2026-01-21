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

test('Defines a @keyframes animation', () => {
  if (!css.includes('@keyframes')) {
    throw new Error('Create a @keyframes animation for the spinner rotation');
  }
});

test('Uses transform: rotate in animation', () => {
  if (!css.match(/transform:\s*rotate/)) {
    throw new Error('Use transform: rotate() to create the spinning effect');
  }
});

test('Applies animation to .spinner', () => {
  if (!css.match(/\.spinner\s*{[^}]*animation:/s)) {
    throw new Error('Apply the animation to the .spinner element');
  }
});

test('Uses border-radius: 50% for circular shape', () => {
  if (!css.match(/border-radius:\s*50%/)) {
    throw new Error('Make the spinner circular with border-radius: 50%');
  }
});

test('Includes prefers-reduced-motion media query', () => {
  if (!css.includes('@media') || !css.includes('prefers-reduced-motion')) {
    throw new Error('Add @media (prefers-reduced-motion: reduce) for accessibility');
  }
});

test('Provides alternative animation for reduced motion', () => {
  const reducedMotionSection = css.match(/@media[^{]*prefers-reduced-motion[^{]*{[\s\S]*?}\s*}/);
  if (!reducedMotionSection || !reducedMotionSection[0].includes('animation')) {
    throw new Error('Provide an alternative animation (like pulse or fade) for users with reduced motion preferences');
  }
});

test('Sets infinite animation duration', () => {
  if (!css.includes('infinite')) {
    throw new Error('Make the spinner animation loop infinitely');
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed! Your spinner is animated and accessible.');
}
