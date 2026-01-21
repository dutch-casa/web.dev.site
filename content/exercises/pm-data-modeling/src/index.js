// Data Modeling Exercise
//
// Design and implement a simple Todo List data model:
//
// 1. createTodo(title) - Create a new todo item
//    Returns: { id: unique_number, title: string, completed: false, createdAt: Date }
//
// 2. TodoList class:
//    - add(title) - Add a new todo, return the todo
//    - remove(id) - Remove todo by id, return true if removed, false if not found
//    - toggle(id) - Toggle completed status, return the todo or null if not found
//    - getAll() - Return array of all todos
//    - getCompleted() - Return array of completed todos
//    - getPending() - Return array of pending (not completed) todos
//    - clear() - Remove all completed todos

let nextId = 1;

function createTodo(title) {
  // Your code here
}

class TodoList {
  constructor() {
    this.todos = [];
  }

  add(title) {
    // Your code here
  }

  remove(id) {
    // Your code here
  }

  toggle(id) {
    // Your code here
  }

  getAll() {
    // Your code here
  }

  getCompleted() {
    // Your code here
  }

  getPending() {
    // Your code here
  }

  clear() {
    // Your code here
  }
}

module.exports = { createTodo, TodoList };
