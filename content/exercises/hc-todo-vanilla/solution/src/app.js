// Get DOM elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const todoCount = document.getElementById('todo-count');

// Todo data array
let todos = [];
let nextId = 1;

// Function to render all todos
function renderTodos() {
  todoList.innerHTML = '';

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = `todo-item${todo.completed ? ' completed' : ''}`;
    li.dataset.id = todo.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.completed;

    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todo.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-button';
    deleteBtn.textContent = 'Delete';

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    todoList.appendChild(li);
  });

  updateCount();
}

// Function to update the count display
function updateCount() {
  const count = todos.length;
  const completedCount = todos.filter(todo => todo.completed).length;
  todoCount.textContent = `${count} task${count !== 1 ? 's' : ''} (${completedCount} completed)`;
}

// Function to add a new todo
function addTodo(text) {
  const todo = {
    id: nextId++,
    text: text,
    completed: false
  };

  todos.push(todo);
  renderTodos();
}

// Function to delete a todo
function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  renderTodos();
}

// Function to toggle todo completion
function toggleTodo(id) {
  const todo = todos.find(todo => todo.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    renderTodos();
  }
}

// Event listener for form submission
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const text = todoInput.value.trim();
  if (text) {
    addTodo(text);
    todoInput.value = '';
    todoInput.focus();
  }
});

// Event listener for list clicks (event delegation for delete/checkbox)
todoList.addEventListener('click', (e) => {
  const todoItem = e.target.closest('.todo-item');
  if (!todoItem) return;

  const id = parseInt(todoItem.dataset.id);

  if (e.target.classList.contains('delete-button')) {
    deleteTodo(id);
  } else if (e.target.classList.contains('todo-checkbox')) {
    toggleTodo(id);
  }
});

// Initial render
renderTodos();
