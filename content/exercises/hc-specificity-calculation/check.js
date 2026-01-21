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

// Extract all specificity comments and their following rules
const specificityPattern = /\/\*\s*Specificity:\s*(\d+)-(\d+)-(\d+)\s*\*\/[\s\S]*?\/\*\s*Rule ([A-J])\s*\*\//gi;
const matches = [...css.matchAll(specificityPattern)];

test('All rules have specificity comments', () => {
  if (matches.length < 10) {
    throw new Error(`Expected 10 rules with specificity comments, found ${matches.length}`);
  }
});

test('Specificity comment format is correct (ID-CLASS-ELEMENT)', () => {
  matches.forEach((match, i) => {
    const comment = match[0];
    if (!/\/\*\s*Specificity:\s*\d+-\d+-\d+\s*\*\//.test(comment)) {
      throw new Error(`Rule at position ${i + 1} has incorrect specificity format. Use: /* Specificity: 0-0-1 */`);
    }
  });
});

// Specificity calculations for each rule
const expectedSpecificity = {
  'A': [1, 1, 0], // #featured .title
  'B': [0, 0, 2], // article h2
  'C': [0, 2, 0], // .post.highlight
  'D': [0, 0, 1], // h2
  'E': [0, 2, 4], // main article.post h2.title
  'F': [1, 0, 1], // #search input
  'G': [0, 2, 0], // .widget .search-input
  'H': [0, 0, 2], // footer p
  'I': [1, 1, 0], // #main-footer .copyright
  'J': [0, 0, 3], // body main article
};

test('Rule A specificity calculated correctly', () => {
  const ruleA = matches.find(m => m[4] === 'A');
  if (!ruleA) throw new Error('Rule A not found');
  const spec = [parseInt(ruleA[1]), parseInt(ruleA[2]), parseInt(ruleA[3])];
  if (spec[0] !== 1 || spec[1] !== 1 || spec[2] !== 0) {
    throw new Error(`Rule A (#featured .title) should be 1-1-0, got ${spec.join('-')}`);
  }
});

test('Rule B specificity calculated correctly', () => {
  const ruleB = matches.find(m => m[4] === 'B');
  if (!ruleB) throw new Error('Rule B not found');
  const spec = [parseInt(ruleB[1]), parseInt(ruleB[2]), parseInt(ruleB[3])];
  if (spec[0] !== 0 || spec[1] !== 0 || spec[2] !== 2) {
    throw new Error(`Rule B (article h2) should be 0-0-2, got ${spec.join('-')}`);
  }
});

test('Rule E specificity calculated correctly', () => {
  const ruleE = matches.find(m => m[4] === 'E');
  if (!ruleE) throw new Error('Rule E not found');
  const spec = [parseInt(ruleE[1]), parseInt(ruleE[2]), parseInt(ruleE[3])];
  if (spec[0] !== 0 || spec[1] !== 2 || spec[2] !== 4) {
    throw new Error(`Rule E (main article.post h2.title) should be 0-2-4, got ${spec.join('-')}`);
  }
});

test('All specificity calculations are correct', () => {
  matches.forEach((match) => {
    const rule = match[4];
    const calculated = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    const expected = expectedSpecificity[rule];

    if (calculated[0] !== expected[0] || calculated[1] !== expected[1] || calculated[2] !== expected[2]) {
      throw new Error(`Rule ${rule} should be ${expected.join('-')}, got ${calculated.join('-')}`);
    }
  });
});

test('Rules are ordered from lowest to highest specificity', () => {
  const specificityValues = matches.map(m => {
    return parseInt(m[1]) * 10000 + parseInt(m[2]) * 100 + parseInt(m[3]);
  });

  for (let i = 1; i < specificityValues.length; i++) {
    if (specificityValues[i] < specificityValues[i - 1]) {
      const prev = matches[i - 1];
      const curr = matches[i];
      throw new Error(
        `Rules are not in order: Rule ${prev[4]} (${prev[1]}-${prev[2]}-${prev[3]}) comes before Rule ${curr[4]} (${curr[1]}-${curr[2]}-${curr[3]}), but ${curr[4]} has lower specificity`
      );
    }
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed!');
}
