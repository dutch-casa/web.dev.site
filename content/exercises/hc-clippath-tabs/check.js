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
const js = fs.readFileSync(path.join(__dirname, 'src/app.js'), 'utf8');

// CSS Tests
test('Adds transition for clip-path animation', () => {
  if (!css.match(/transition:[^;]*clip-path/)) {
    throw new Error('Add transition: clip-path to .tabs-overlay for smooth animation');
  }
});

test('Sets initial clip-path on .tabs-overlay', () => {
  if (!css.match(/\.tabs-overlay[^}]*clip-path:\s*inset/s)) {
    throw new Error('Set an initial clip-path: inset(...) on .tabs-overlay');
  }
});

// JavaScript Tests
test('Gets reference to the overlay element', () => {
  if (!js.match(/querySelector\s*\(\s*['"]\.tabs-overlay['"]\s*\)/)) {
    throw new Error('Use document.querySelector to get the .tabs-overlay element');
  }
});

test('Gets references to tab buttons', () => {
  if (!js.match(/querySelectorAll\s*\([^)]*tab-button/)) {
    throw new Error('Use document.querySelectorAll to get the tab buttons');
  }
});

test('Calculates clip-path left percentage', () => {
  if (!js.match(/offsetLeft\s*\/\s*\w+/) && !js.match(/offsetLeft[^;]*\*\s*100/)) {
    throw new Error('Calculate the left clip percentage using offsetLeft / containerWidth * 100');
  }
});

test('Calculates clip-path right percentage', () => {
  if (!js.match(/100\s*-/) || !js.match(/offsetWidth/)) {
    throw new Error('Calculate the right clip percentage using 100 - ((offsetLeft + offsetWidth) / containerWidth * 100)');
  }
});

test('Applies clip-path using inset with round', () => {
  if (!js.match(/clipPath\s*=\s*`inset[^`]*round/)) {
    throw new Error('Apply clip-path using template literal: `inset(0 ${right}% 0 ${left}% round 17px)`');
  }
});

test('Adds click event listeners to tabs', () => {
  if (!js.match(/addEventListener\s*\(\s*['"]click['"]/)) {
    throw new Error('Add click event listeners to the tab buttons');
  }
});

test('Updates aria-selected on click', () => {
  if (!js.match(/aria-selected/)) {
    throw new Error('Update aria-selected attributes when tabs are clicked');
  }
});

test('Sets initial clip-path on page load', () => {
  // Check if updateClipPath is called outside of event listener
  const lines = js.split('\n');
  let hasInitialCall = false;
  let inEventListener = false;

  for (const line of lines) {
    if (line.includes('addEventListener')) inEventListener = true;
    if (line.includes('});') && inEventListener) inEventListener = false;
    if (!inEventListener && line.match(/updateClipPath\s*\(/)) {
      hasInitialCall = true;
      break;
    }
  }

  if (!hasInitialCall) {
    throw new Error('Call updateClipPath with the initial tab when the page loads');
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed! Your clip-path tabs are working beautifully.');
}
