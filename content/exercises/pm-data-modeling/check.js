const { execSync } = require('child_process');

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

let createTodo, TodoList;
try {
  const solution = require('./src/index.js');
  createTodo = solution.createTodo;
  TodoList = solution.TodoList;
} catch (e) {
  console.log('✗ Your code has an error:\n');
  console.log(e.message);
  process.exit(1);
}

// createTodo tests
test('createTodo returns correct structure', () => {
  const todo = createTodo("Test task");
  if (typeof todo.id !== 'number') throw new Error('id should be a number');
  if (todo.title !== "Test task") throw new Error('title should match');
  if (todo.completed !== false) throw new Error('completed should be false');
  if (!(todo.createdAt instanceof Date)) throw new Error('createdAt should be a Date');
});

test('createTodo generates unique ids', () => {
  const t1 = createTodo("Task 1");
  const t2 = createTodo("Task 2");
  if (t1.id === t2.id) throw new Error('ids should be unique');
});

// TodoList tests
test('TodoList add and getAll work', () => {
  const list = new TodoList();
  list.add("Task 1");
  list.add("Task 2");
  const all = list.getAll();
  if (all.length !== 2) throw new Error(`Expected 2 todos but got ${all.length}`);
});

test('TodoList remove works', () => {
  const list = new TodoList();
  const todo = list.add("Task");
  const removed = list.remove(todo.id);
  if (!removed) throw new Error('Should return true when removed');
  if (list.getAll().length !== 0) throw new Error('Todo should be removed');
});

test('TodoList remove returns false for missing id', () => {
  const list = new TodoList();
  if (list.remove(999)) throw new Error('Should return false for missing id');
});

test('TodoList toggle works', () => {
  const list = new TodoList();
  const todo = list.add("Task");
  list.toggle(todo.id);
  if (!list.getAll()[0].completed) throw new Error('Should be completed after toggle');
  list.toggle(todo.id);
  if (list.getAll()[0].completed) throw new Error('Should be uncompleted after second toggle');
});

test('TodoList getCompleted and getPending work', () => {
  const list = new TodoList();
  const t1 = list.add("Task 1");
  list.add("Task 2");
  list.toggle(t1.id);
  if (list.getCompleted().length !== 1) throw new Error('Should have 1 completed');
  if (list.getPending().length !== 1) throw new Error('Should have 1 pending');
});

test('TodoList clear removes completed', () => {
  const list = new TodoList();
  const t1 = list.add("Task 1");
  list.add("Task 2");
  list.toggle(t1.id);
  list.clear();
  if (list.getAll().length !== 1) throw new Error('Should have 1 remaining');
  if (list.getAll()[0].title !== "Task 2") throw new Error('Wrong todo remaining');
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('\n🎉 All tests passed!');
}
