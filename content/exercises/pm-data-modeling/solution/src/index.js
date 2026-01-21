// Solution

let nextId = 1;

function createTodo(title) {
  return {
    id: nextId++,
    title,
    completed: false,
    createdAt: new Date()
  };
}

class TodoList {
  constructor() {
    this.todos = [];
  }

  add(title) {
    const todo = createTodo(title);
    this.todos.push(todo);
    return todo;
  }

  remove(id) {
    const index = this.todos.findIndex(t => t.id === id);
    if (index === -1) return false;
    this.todos.splice(index, 1);
    return true;
  }

  toggle(id) {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) return null;
    todo.completed = !todo.completed;
    return todo;
  }

  getAll() {
    return [...this.todos];
  }

  getCompleted() {
    return this.todos.filter(t => t.completed);
  }

  getPending() {
    return this.todos.filter(t => !t.completed);
  }

  clear() {
    this.todos = this.todos.filter(t => !t.completed);
  }
}

module.exports = { createTodo, TodoList };
