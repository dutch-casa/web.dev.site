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

test('Has a form element', () => {
  if (!/<form[\s>]/.test(html)) {
    throw new Error('Expected to find a <form> element');
  }
});

test('Name field: text input with label and required attribute', () => {
  if (!/<input[^>]*type=["']text["'][^>]*>/i.test(html) && !/<input[^>]*name=["']name["'][^>]*type=["']text["']/i.test(html)) {
    throw new Error('Expected to find a text input for name');
  }
  const nameInput = html.match(/<input[^>]*(?:id=["']name["']|name=["']name["'])[^>]*>/i);
  if (nameInput && !/required/i.test(nameInput[0])) {
    throw new Error('Name input should have required attribute');
  }
  if (!/<label[^>]*for=["']name["']/i.test(html)) {
    throw new Error('Name input should have a label with for="name"');
  }
});

test('Email field: email input with label and required attribute', () => {
  if (!/<input[^>]*type=["']email["']/i.test(html)) {
    throw new Error('Expected to find an email input (type="email")');
  }
  const emailInput = html.match(/<input[^>]*type=["']email["'][^>]*>/i);
  if (emailInput && !/required/i.test(emailInput[0])) {
    throw new Error('Email input should have required attribute');
  }
  if (!/<label[^>]*for=["']email["']/i.test(html)) {
    throw new Error('Email input should have a label');
  }
});

test('Phone field: tel input with label (optional)', () => {
  if (!/<input[^>]*type=["']tel["']/i.test(html)) {
    throw new Error('Expected to find a tel input (type="tel") for phone');
  }
  if (!/<label[^>]*for=["']phone["']/i.test(html)) {
    throw new Error('Phone input should have a label');
  }
});

test('Topic field: select dropdown with label and options', () => {
  if (!/<select[\s>]/i.test(html)) {
    throw new Error('Expected to find a <select> element');
  }
  const optionCount = (html.match(/<option[^>]*>/gi) || []).length;
  if (optionCount < 3) {
    throw new Error(`Expected at least 3 options in select, found ${optionCount}`);
  }
  if (!/<label[^>]*for=["']topic["']/i.test(html)) {
    throw new Error('Select should have a label');
  }
});

test('Message field: textarea with label, required, and minlength', () => {
  if (!/<textarea[\s>]/i.test(html)) {
    throw new Error('Expected to find a <textarea> element');
  }
  const textarea = html.match(/<textarea[^>]*>/i);
  if (textarea && !/required/i.test(textarea[0])) {
    throw new Error('Textarea should have required attribute');
  }
  if (textarea && !/minlength=["']10["']/i.test(textarea[0])) {
    throw new Error('Textarea should have minlength="10" attribute');
  }
  if (!/<label[^>]*for=["']message["']/i.test(html)) {
    throw new Error('Textarea should have a label');
  }
});

test('Privacy checkbox: wrapped in fieldset with legend', () => {
  if (!/<fieldset[\s>]/i.test(html)) {
    throw new Error('Expected to find a <fieldset> element for the privacy checkbox');
  }
  if (!/<legend[\s>]/i.test(html)) {
    throw new Error('Expected to find a <legend> element inside the fieldset');
  }
  const fieldset = html.match(/<fieldset[\s>][\s\S]*?<\/fieldset>/i);
  if (fieldset && !/<input[^>]*type=["']checkbox["']/i.test(fieldset[0])) {
    throw new Error('Expected to find a checkbox input inside the fieldset');
  }
});

test('Privacy checkbox: has required attribute and label', () => {
  const checkbox = html.match(/<input[^>]*type=["']checkbox["'][^>]*>/i);
  if (checkbox && !/required/i.test(checkbox[0])) {
    throw new Error('Privacy checkbox should have required attribute');
  }
  if (!/<label[^>]*for=["']privacy["']/i.test(html)) {
    throw new Error('Privacy checkbox should have a label');
  }
});

test('Has a submit button', () => {
  if (!/<button[^>]*type=["']submit["']/i.test(html) && !/<input[^>]*type=["']submit["']/i.test(html)) {
    throw new Error('Expected to find a submit button');
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed!');
}
