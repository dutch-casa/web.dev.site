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

test('Card container has container-type', () => {
  if (!css.match(/\.card-container\s*{[^}]*container-type:\s*inline-size/s)) {
    throw new Error('Card container should have container-type: inline-size');
  }
});

test('Has @container query', () => {
  if (!css.match(/@container/)) {
    throw new Error('Should use @container query for responsive behavior');
  }
});

test('Container query checks max-width', () => {
  if (!css.match(/@container\s*\(max-width:\s*500px\)/)) {
    throw new Error('Container query should check max-width: 500px');
  }
});

test('Card padding changes in container query', () => {
  if (!css.match(/@container[^}]*{[^}]*\.card\s*{[^}]*padding:\s*1rem/s)) {
    throw new Error('Card should have padding: 1rem inside container query');
  }
});

test('Card background changes in container query', () => {
  if (!css.match(/@container[^}]*{[^}]*\.card\s*{[^}]*background:\s*#e8f4f8/s)) {
    throw new Error('Card should have background: #e8f4f8 inside container query');
  }
});

test('Card h2 font-size changes in container query', () => {
  if (!css.match(/@container[^}]*{[^}]*\.card\s+h2\s*{[^}]*font-size:\s*1\.2rem/s)) {
    throw new Error('Card h2 should have font-size: 1.2rem inside container query');
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed! You master container queries!');
}
