const { execFileSync } = require('child_process');
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

// Read the TypeScript file
const tsContent = fs.readFileSync(path.join(__dirname, 'src/index.ts'), 'utf8');

// Check for type definitions
test('Status union type is defined', () => {
  if (!tsContent.match(/type\s+Status\s*=.*"pending".*"success".*"error"/s)) {
    throw new Error('Status should be a union of "pending" | "success" | "error"');
  }
});

test('Result type is defined with generics', () => {
  if (!tsContent.match(/type\s+Result\s*<\s*T\s*>/)) {
    throw new Error('Result should be a generic type Result<T>');
  }
});

test('Result type has success and error variants', () => {
  if (!tsContent.includes('success: true') || !tsContent.includes('success: false')) {
    throw new Error('Result should have success: true and success: false variants');
  }
});

test('User interface is defined', () => {
  if (!tsContent.match(/interface\s+User/)) {
    throw new Error('User interface should be defined');
  }
});

test('ReadonlyUser uses Readonly utility type', () => {
  if (!tsContent.match(/type\s+ReadonlyUser\s*=\s*Readonly\s*<\s*User\s*>/)) {
    throw new Error('ReadonlyUser should use Readonly<User>');
  }
});

test('PartialUser uses Partial utility type', () => {
  if (!tsContent.match(/type\s+PartialUser\s*=\s*Partial\s*<\s*User\s*>/)) {
    throw new Error('PartialUser should use Partial<User>');
  }
});

test('unwrapResult has proper type annotations', () => {
  if (!tsContent.match(/function\s+unwrapResult\s*<\s*T\s*>/)) {
    throw new Error('unwrapResult should be generic with <T>');
  }
});

test('createSuccess has proper type annotations', () => {
  if (!tsContent.match(/function\s+createSuccess\s*<\s*T\s*>/)) {
    throw new Error('createSuccess should be generic with <T>');
  }
});

test('createError has proper type annotations', () => {
  if (!tsContent.match(/function\s+createError\s*<\s*T\s*>/)) {
    throw new Error('createError should be generic with <T>');
  }
});

// Try to compile with TypeScript
test('TypeScript compiles without errors', () => {
  try {
    execFileSync('npx', ['tsc', '--noEmit', '--strict', 'src/index.ts'], {
      cwd: __dirname,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
  } catch (e) {
    throw new Error(`TypeScript compilation failed:\n${e.stderr || e.message}`);
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed!');
}
