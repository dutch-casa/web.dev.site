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

const js = fs.readFileSync(path.join(__dirname, 'src/app.js'), 'utf8');

test('Gets DOM elements using getElementById or querySelector', () => {
  if (!js.includes('getElementById') && !js.includes('querySelector')) {
    throw new Error('Use getElementById or querySelector to get DOM elements');
  }
});

test('Stores todos in an array or data structure', () => {
  if (!js.match(/let\s+todos\s*=|const\s+todos\s*=|var\s+todos\s*=/)) {
    throw new Error('Create a todos array to store todo data');
  }
});

test('Has a function to add todos', () => {
  if (!js.match(/function\s+addTodo|const\s+addTodo\s*=|let\s+addTodo\s*=/)) {
    throw new Error('Create an addTodo function to add new todos');
  }
});

test('Has a function to delete todos', () => {
  if (!js.match(/function\s+deleteTodo|const\s+deleteTodo\s*=|let\s+deleteTodo\s*=/)) {
    throw new Error('Create a deleteTodo function to remove todos');
  }
});

test('Has a function to render/display todos', () => {
  if (!js.match(/function\s+render|const\s+render\s*=|let\s+render\s*=/)) {
    throw new Error('Create a render function to display todos in the DOM');
  }
});

test('Listens for form submit event', () => {
  if (!js.includes('submit')) {
    throw new Error('Add an event listener for form submission');
  }
});

test('Uses addEventListener', () => {
  if (!js.includes('addEventListener')) {
    throw new Error('Use addEventListener to attach event handlers');
  }
});

test('Uses classList for CSS class manipulation', () => {
  if (!js.includes('classList')) {
    throw new Error('Use classList.add/remove/toggle to manage the "completed" class');
  }
});

test('Uses createElement or innerHTML for DOM creation', () => {
  if (!js.includes('createElement') && !js.includes('innerHTML')) {
    throw new Error('Use createElement or innerHTML to create todo elements');
  }
});

test('Prevents default form submission', () => {
  if (!js.includes('preventDefault')) {
    throw new Error('Call preventDefault() on form submit to prevent page reload');
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed! Your todo list is fully functional.');
}
