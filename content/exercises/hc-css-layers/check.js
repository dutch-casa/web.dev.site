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

test('Declares layer order at the top', () => {
  const layerDeclaration = css.match(/@layer\s+[\w\s,]+;/);
  if (!layerDeclaration) {
    throw new Error('Declare layer order at the top: @layer reset, base, components, utilities;');
  }
  const firstLayerIndex = css.indexOf('@layer');
  const firstBraceIndex = css.indexOf('{');
  if (firstLayerIndex > firstBraceIndex) {
    throw new Error('Layer declaration should come before any layer definitions');
  }
});

test('Creates reset layer', () => {
  if (!css.includes('@layer reset')) {
    throw new Error('Create a @layer reset for CSS reset styles');
  }
});

test('Creates base layer', () => {
  if (!css.includes('@layer base')) {
    throw new Error('Create a @layer base for base element styles');
  }
});

test('Creates components layer', () => {
  if (!css.includes('@layer components')) {
    throw new Error('Create a @layer components for component styles');
  }
});

test('Creates utilities layer', () => {
  if (!css.includes('@layer utilities')) {
    throw new Error('Create a @layer utilities for utility classes');
  }
});

test('Moves reset styles into reset layer', () => {
  const resetLayer = css.match(/@layer reset\s*{[^}]*\*\s*{[^}]*box-sizing/s);
  if (!resetLayer) {
    throw new Error('Move the * { box-sizing... } reset into @layer reset');
  }
});

test('Moves component styles into components layer', () => {
  const componentsLayer = css.match(/@layer components\s*{[\s\S]*?\.card[\s\S]*?}/);
  if (!componentsLayer) {
    throw new Error('Move component styles like .card, .button, .header into @layer components');
  }
});

test('Moves utilities into utilities layer', () => {
  const utilitiesLayer = css.match(/@layer utilities\s*{[\s\S]*?\.text-center[\s\S]*?}/);
  if (!utilitiesLayer) {
    throw new Error('Move utility classes like .text-center into @layer utilities');
  }
});

test('Removes !important from utilities (layers handle priority)', () => {
  const utilitiesSection = css.match(/@layer utilities\s*{[\s\S]*?}/);
  if (utilitiesSection && utilitiesSection[0].includes('!important')) {
    throw new Error('Remove !important from utilities - @layer handles priority now');
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed! Your CSS is now organized with layers.');
}
