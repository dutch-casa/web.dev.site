const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Checking your solution...\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  return fn().then(() => {
    console.log(`✓ ${name}`);
    passed++;
  }).catch(e => {
    console.log(`✗ ${name}`);
    console.log(`  ${e.message}\n`);
    failed++;
  });
}

const testDir = path.join(__dirname, 'test_files');

async function setup() {
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir);
  }
  fs.writeFileSync(path.join(testDir, 'test.json'), '{"name":"test","value":42}');
}

async function cleanup() {
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true });
  }
}

async function runTests() {
  let readJSON, writeJSON, appendLine, copyFile;
  try {
    const solution = require('./src/index.js');
    readJSON = solution.readJSON;
    writeJSON = solution.writeJSON;
    appendLine = solution.appendLine;
    copyFile = solution.copyFile;
  } catch (e) {
    console.log('✗ Your code has an error:\n');
    console.log(e.message);
    process.exit(1);
  }

  await setup();

  // readJSON tests
  await test('readJSON reads and parses JSON', async () => {
    const result = await readJSON(path.join(testDir, 'test.json'));
    if (!result || result.name !== 'test' || result.value !== 42) {
      throw new Error(`Expected {name: "test", value: 42}`);
    }
  });

  await test('readJSON returns null for missing file', async () => {
    const result = await readJSON(path.join(testDir, 'nonexistent.json'));
    if (result !== null) throw new Error('Should return null');
  });

  // writeJSON tests
  await test('writeJSON writes formatted JSON', async () => {
    const data = { hello: "world" };
    const filepath = path.join(testDir, 'output.json');
    const success = await writeJSON(filepath, data);
    if (!success) throw new Error('Should return true');
    const content = fs.readFileSync(filepath, 'utf8');
    if (!content.includes('  "hello"')) throw new Error('Should be formatted with 2 spaces');
  });

  // appendLine tests
  await test('appendLine appends to file', async () => {
    const filepath = path.join(testDir, 'log.txt');
    await appendLine(filepath, 'line 1');
    await appendLine(filepath, 'line 2');
    const content = fs.readFileSync(filepath, 'utf8');
    if (content !== 'line 1\nline 2\n') {
      throw new Error(`Expected "line 1\\nline 2\\n" but got "${content}"`);
    }
  });

  // copyFile tests
  await test('copyFile copies file', async () => {
    const src = path.join(testDir, 'test.json');
    const dest = path.join(testDir, 'copy.json');
    const success = await copyFile(src, dest);
    if (!success) throw new Error('Should return true');
    const original = fs.readFileSync(src, 'utf8');
    const copied = fs.readFileSync(dest, 'utf8');
    if (original !== copied) throw new Error('Files should match');
  });

  await test('copyFile returns false for missing source', async () => {
    const result = await copyFile(path.join(testDir, 'nope.txt'), path.join(testDir, 'dest.txt'));
    if (result !== false) throw new Error('Should return false');
  });

  await cleanup();

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed === 0) {
    console.log('\n🎉 All tests passed!');
  }
}

runTests();
