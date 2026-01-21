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

test('Uses <header> element instead of div with class="header"', () => {
  if (/<div[^>]*class=["']header["']/.test(html)) {
    throw new Error('Found <div class="header"> - should use <header> element instead');
  }
  if (!/<header[\s>]/.test(html)) {
    throw new Error('Expected to find a <header> element');
  }
});

test('Uses <nav> element for navigation', () => {
  if (!/<nav[\s>]/.test(html)) {
    throw new Error('Expected to find a <nav> element');
  }
});

test('Uses <ul> and <li> for navigation list', () => {
  if (!/<ul[\s>]/.test(html)) {
    throw new Error('Expected to find a <ul> element for navigation');
  }
  const navSection = html.match(/<nav[\s>][\s\S]*?<\/nav>/i);
  if (navSection && !/<li[\s>]/.test(navSection[0])) {
    throw new Error('Expected to find <li> elements inside navigation');
  }
});

test('Uses <main> element for main content area', () => {
  if (!/<main[\s>]/.test(html)) {
    throw new Error('Expected to find a <main> element');
  }
});

test('Uses <article> element for blog post', () => {
  if (!/<article[\s>]/.test(html)) {
    throw new Error('Expected to find an <article> element');
  }
});

test('Uses <h1> for article title', () => {
  if (!/<h1[\s>]/.test(html)) {
    throw new Error('Expected to find an <h1> element for the article title');
  }
});

test('Uses <p> elements for paragraphs', () => {
  const pCount = (html.match(/<p[\s>]/g) || []).length;
  if (pCount < 3) {
    throw new Error(`Expected at least 3 <p> elements, found ${pCount}`);
  }
});

test('Uses <aside> element for sidebar', () => {
  if (!/<aside[\s>]/.test(html)) {
    throw new Error('Expected to find an <aside> element');
  }
});

test('Uses <section> element within sidebar', () => {
  const asideSection = html.match(/<aside[\s>][\s\S]*?<\/aside>/i);
  if (asideSection && !/<section[\s>]/.test(asideSection[0])) {
    throw new Error('Expected to find a <section> element inside the aside');
  }
});

test('Uses <h2> for sidebar heading', () => {
  if (!/<h2[\s>]/.test(html)) {
    throw new Error('Expected to find an <h2> element for sidebar heading');
  }
});

test('Uses <footer> element instead of div with class="footer"', () => {
  if (/<div[^>]*class=["']footer["']/.test(html)) {
    throw new Error('Found <div class="footer"> - should use <footer> element instead');
  }
  if (!/<footer[\s>]/.test(html)) {
    throw new Error('Expected to find a <footer> element');
  }
});

test('Removes unnecessary wrapper divs', () => {
  if (/<div[^>]*class=["']page["']/.test(html)) {
    throw new Error('Unnecessary wrapper <div class="page"> should be removed');
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed!');
}
