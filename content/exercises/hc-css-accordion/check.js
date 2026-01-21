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

test('Accordion item has border', () => {
  if (!css.match(/\.accordion-item\s*{[^}]*border:\s*2px\s+solid/s)) {
    throw new Error('Accordion item should have a 2px solid border');
  }
});

test('Accordion item has transition', () => {
  if (!css.match(/\.accordion-item\s*{[^}]*transition:/s)) {
    throw new Error('Accordion item should have a transition for smooth effects');
  }
});

test('Open state styling using [open]', () => {
  if (!css.match(/\.accordion-item\[open\]|details\[open\]/)) {
    throw new Error('Should use [open] attribute selector to style open state');
  }
});

test('Summary has list-style: none', () => {
  if (!css.match(/summary\s*{[^}]*list-style:\s*none/s)) {
    throw new Error('Summary should have list-style: none to remove default marker');
  }
});

test('Summary ::-webkit-details-marker is hidden', () => {
  if (!css.match(/summary::-webkit-details-marker\s*{[^}]*display:\s*none/s)) {
    throw new Error('Should hide the webkit details marker with display: none');
  }
});

test('Summary has custom arrow using ::after', () => {
  if (!css.match(/summary::after/)) {
    throw new Error('Should add custom arrow indicator using summary::after');
  }
});

test('Arrow rotates when open', () => {
  if (!css.match(/details\[open\]\s+summary::after\s*{[^}]*transform:\s*rotate/s)) {
    throw new Error('Arrow should rotate when details is open using transform: rotate');
  }
});

test('Open state changes summary background', () => {
  if (!css.match(/details\[open\]\s+summary\s*{[^}]*background:/s)) {
    throw new Error('Open state should change summary background color');
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed! Your CSS accordion is perfect!');
}
