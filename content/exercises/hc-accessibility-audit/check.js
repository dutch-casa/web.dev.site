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

test('Has a skip link that targets main content', () => {
  if (!/<a[^>]*href=["']#content["'][^>]*>.*skip.*content/i.test(html)) {
    throw new Error('Expected to find a skip link with href="#content" containing text like "skip to main content"');
  }
});

test('Skip link has proper styling for keyboard focus', () => {
  if (!/\.skip-link:focus/.test(html)) {
    throw new Error('Skip link should have :focus styles to make it visible when focused');
  }
});

test('All icon buttons have aria-label attributes', () => {
  const buttons = html.match(/<button[^>]*>[\s]*[⏮▶⏭🔀][\s]*<\/button>/g) || [];
  if (buttons.length < 4) {
    throw new Error('Expected to find 4 icon buttons');
  }
  buttons.forEach((button) => {
    if (!/aria-label=["'][^"']+["']/.test(button)) {
      throw new Error(`Button ${button.substring(0, 50)}... is missing aria-label attribute`);
    }
  });
});

test('Previous button has descriptive aria-label', () => {
  const prevButton = html.match(/<button[^>]*>[\s]*⏮[\s]*<\/button>/);
  if (prevButton && !/aria-label=["'][^"']*previous[^"']*["']/i.test(prevButton[0])) {
    throw new Error('Previous button should have aria-label describing its action (e.g., "Previous track")');
  }
});

test('Play button has descriptive aria-label', () => {
  const playButton = html.match(/<button[^>]*>[\s]*▶[\s]*<\/button>/);
  if (playButton && !/aria-label=["'][^"']*play[^"']*["']/i.test(playButton[0])) {
    throw new Error('Play button should have aria-label="Play" or similar');
  }
});

test('Next button has descriptive aria-label', () => {
  const nextButton = html.match(/<button[^>]*>[\s]*⏭[\s]*<\/button>/);
  if (nextButton && !/aria-label=["'][^"']*next[^"']*["']/i.test(nextButton[0])) {
    throw new Error('Next button should have aria-label describing its action (e.g., "Next track")');
  }
});

test('Shuffle button has descriptive aria-label', () => {
  const shuffleButton = html.match(/<button[^>]*>[\s]*🔀[\s]*<\/button>/);
  if (shuffleButton && !/aria-label=["'][^"']*shuffle[^"']*["']/i.test(shuffleButton[0])) {
    throw new Error('Shuffle button should have aria-label="Shuffle" or similar');
  }
});

test('Uses proper heading hierarchy (h1, h2)', () => {
  if (!/<h1[\s>]/i.test(html)) {
    throw new Error('Expected to find an <h1> element for "Now Playing"');
  }
  const h2Count = (html.match(/<h2[\s>]/gi) || []).length;
  if (h2Count < 2) {
    throw new Error('Expected to find at least 2 <h2> elements for section headings');
  }
});

test('Main content is wrapped in <main> element', () => {
  if (!/<main[\s>]/i.test(html)) {
    throw new Error('Expected to find a <main> element for the main content area');
  }
});

test('Sidebar uses <aside> element', () => {
  if (!/<aside[\s>]/i.test(html)) {
    throw new Error('Expected sidebar to use <aside> element');
  }
});

test('Content order: main content before sidebar in DOM', () => {
  const mainIndex = html.indexOf('<main');
  const asideIndex = html.indexOf('<aside');
  if (mainIndex === -1 || asideIndex === -1) {
    throw new Error('Expected to find both <main> and <aside> elements');
  }
  if (mainIndex > asideIndex) {
    throw new Error('Main content should appear before sidebar in the DOM for proper tab order');
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed!');
}
