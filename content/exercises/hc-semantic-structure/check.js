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

test('Uses <article> element for blog post container', () => {
  if (!/<article[\s>]/.test(html)) {
    throw new Error('Expected to find an <article> element');
  }
});

test('Uses <header> element for post header', () => {
  if (!/<header[\s>]/.test(html)) {
    throw new Error('Expected to find a <header> element');
  }
});

test('Uses <h1> for main title', () => {
  if (!/<h1[\s>]/.test(html)) {
    throw new Error('Expected to find an <h1> element');
  }
});

test('Uses <time> element for publication date', () => {
  if (!/<time[\s>]/.test(html)) {
    throw new Error('Expected to find a <time> element');
  }
  if (!/datetime=["']2025-03-15["']/.test(html)) {
    throw new Error('Expected <time> element to have datetime="2025-03-15" attribute');
  }
});

test('Uses <main> element for main content', () => {
  if (!/<main[\s>]/.test(html)) {
    throw new Error('Expected to find a <main> element');
  }
});

test('Uses <p> elements for paragraphs', () => {
  const pCount = (html.match(/<p[\s>]/g) || []).length;
  if (pCount < 4) {
    throw new Error(`Expected at least 4 <p> elements, found ${pCount}`);
  }
});

test('Uses <footer> element for author section', () => {
  if (!/<footer[\s>]/.test(html)) {
    throw new Error('Expected to find a <footer> element');
  }
});

test('Uses <h2> for "About the Author" heading', () => {
  if (!/<h2[\s>]/.test(html)) {
    throw new Error('Expected to find an <h2> element for the author section heading');
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed!');
}
