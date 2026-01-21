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

test('Uses backdrop-filter with blur', () => {
  if (!css.includes('backdrop-filter:') || !css.includes('blur(')) {
    throw new Error('Apply backdrop-filter: blur() to create the frosted glass effect');
  }
});

test('Uses semi-transparent background', () => {
  if (!css.match(/background:\s*rgba\([^)]*,\s*0\.[0-3]\)/)) {
    throw new Error('Use a semi-transparent background with rgba (alpha < 0.3)');
  }
});

test('Applies glassmorphism to .glass-card', () => {
  const cardSection = css.match(/\.glass-card\s*{[^}]*}/s);
  if (!cardSection || !cardSection[0].includes('backdrop-filter')) {
    throw new Error('Apply glassmorphism effect to .glass-card element');
  }
});

test('Includes box-shadow for depth', () => {
  if (!css.match(/\.glass-card[^}]*box-shadow:/s)) {
    throw new Error('Add box-shadow to .glass-card for depth');
  }
});

test('Creates gradient border effect', () => {
  const hasGradientBorder = css.includes('border-image') && css.includes('gradient');
  const hasPseudoBorder = (css.includes('::before') || css.includes('::after')) && css.includes('gradient');
  if (!hasGradientBorder && !hasPseudoBorder) {
    throw new Error('Create a gradient border using border-image or pseudo-element with gradient');
  }
});

test('Styles the button with glass effect', () => {
  const buttonSection = css.match(/\.glass-button\s*{[^}]*}/s);
  if (!buttonSection || (!buttonSection[0].includes('backdrop-filter') && !buttonSection[0].includes('rgba'))) {
    throw new Error('Apply glass effect to .glass-button');
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed! Your glassmorphism card looks stunning.');
}
