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

test('Question 1: Correctly identifies red as the winning color', () => {
  if (!/Answer:\s*red.*Rule 3.*#welcome/i.test(html.replace(/<!--/g, '').replace(/-->/g, ''))) {
    throw new Error('Expected answer "red (from Rule 3: #welcome)" to be uncommented');
  }
});

test('Question 1: No other color answers are uncommented', () => {
  const withoutCorrect = html.replace(/<!--\s*<p>Answer:\s*red.*?<\/p>\s*-->/i, '');
  if (/<p>Answer:\s*(blue|green|purple)/i.test(withoutCorrect.replace(/<!--[\s\S]*?-->/g, ''))) {
    throw new Error('Only one answer should be uncommented for Question 1');
  }
});

test('Question 2: Correctly identifies 18px as the winning font-size', () => {
  if (!/Answer:\s*18px.*Rule 5.*body p/i.test(html.replace(/<!--/g, '').replace(/-->/g, ''))) {
    throw new Error('Expected answer "18px (from Rule 5: body p)" to be uncommented');
  }
});

test('Question 2: No other font-size answers are uncommented', () => {
  const withoutCorrect = html.replace(/<!--\s*<p>Answer:\s*18px.*?<\/p>\s*-->/i, '');
  if (/<p>Answer:\s*16px/i.test(withoutCorrect.replace(/<!--[\s\S]*?-->/g, ''))) {
    throw new Error('Only one answer should be uncommented for Question 2');
  }
});

test('Question 3: Correctly identifies that font-weight: bold is applied', () => {
  if (!/Answer:\s*Yes.*font-weight:\s*bold.*applied/i.test(html.replace(/<!--/g, '').replace(/-->/g, ''))) {
    throw new Error('Expected answer "Yes, font-weight: bold is applied" to be uncommented');
  }
});

test('Question 3: No other font-weight answers are uncommented', () => {
  const withoutCorrect = html.replace(/<!--\s*<p>Answer:\s*Yes.*?<\/p>\s*-->/i, '');
  if (/<p>Answer:\s*No/i.test(withoutCorrect.replace(/<!--[\s\S]*?-->/g, ''))) {
    throw new Error('Only one answer should be uncommented for Question 3');
  }
});

test('Includes explanation of reasoning', () => {
  const explanationSection = html.match(/<section[^>]*>[\s\S]*?<h2>Explanation<\/h2>[\s\S]*?<\/section>/i);
  if (!explanationSection) {
    throw new Error('Expected to find an Explanation section');
  }
  const hasContent = explanationSection[0].replace(/<em>.*?<\/em>/g, '').replace(/<!--[\s\S]*?-->/g, '');
  if (!/specificity|cascade|ID selector|wins/i.test(hasContent)) {
    throw new Error('Expected explanation to discuss specificity, cascade, or why ID selectors win');
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed!');
}
