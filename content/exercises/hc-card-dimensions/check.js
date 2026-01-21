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

const html = fs.readFileSync(path.join(__dirname, 'src/index.html'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, 'src/styles.css'), 'utf8');

test('Card has width of 300px', () => {
  if (!css.match(/\.card\s*{[^}]*width:\s*300px/s)) {
    throw new Error('Card should have width: 300px');
  }
});

test('Card has 20px padding', () => {
  if (!css.match(/\.card\s*{[^}]*padding:\s*20px/s)) {
    throw new Error('Card should have padding: 20px');
  }
});

test('Card has 2px solid border', () => {
  if (!css.match(/\.card\s*{[^}]*border:\s*2px\s+solid/s)) {
    throw new Error('Card should have border: 2px solid');
  }
});

test('Card has 16px margin', () => {
  if (!css.match(/\.card\s*{[^}]*margin:\s*16px/s)) {
    throw new Error('Card should have margin: 16px');
  }
});

test('Total width calculation is correct (376px)', () => {
  if (!html.includes('376')) {
    throw new Error('Total width should be 376px (300 + 40 padding + 4 border + 32 margin)');
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed! You understand the box model!');
}
