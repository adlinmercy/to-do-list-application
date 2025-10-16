// Simple To-Do app with localStorage persistence

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const counter = document.getElementById('counter');
const clearCompletedBtn = document.getElementById('clear-completed');

const STORAGE_KEY = 'todos:v1';

let todos = [];

/* Utility */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,8);
}

/* Save & Load */
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/* Render */
function render() {
  list.innerHTML = '';
  todos.forEach(task => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (task.completed ? ' completed' : '');
    li.dataset.id = task.id;

    const labelWrap = document.createElement('div');
    labelWrap.className = 'label';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!task.completed;
    checkbox.setAttribute('aria-label', 'Mark task completed');

    const span = document.createElement('div');
    span.className = 'task-text';
    span.textContent = task.text;

    labelWrap.appendChild(checkbox);
    labelWrap.appendChild(span);

    const del = document.createElement('button');
    del.className = 'delete-btn';
    del.setAttribute('aria-label', 'Delete task');
    del.textContent = '✕';

    li.appendChild(labelWrap);
    li.appendChild(del);
    list.appendChild(li);
  });

  updateCounter();
}

/* Counter */
function updateCounter(){
  const total = todos.length;
  const remaining = todos.filter(t => !t.completed).length;
  counter.textContent = remaining === 1 ? '1 task left' : `${remaining} tasks`;
}

/* Actions */
function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  todos.unshift({
    id: uid(),
    text: trimmed,
    completed: false,
    createdAt: Date.now()
  });
  save();
  render();
}

function toggleTask(id) {
  const t = todos.find(x => x.id === id);
  if (!t) return;
  t.completed = !t.completed;
  save();
  render();
}

function deleteTask(id) {
  todos = todos.filter(x => x.id !== id);
  save();
  render();
}

function clearCompleted() {
  todos = todos.filter(t => !t.completed);
  save();
  render();
}

/* Events */
form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask(input.value);
  input.value = '';
  input.focus();
});

input.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') input.value = '';
});

list.addEventListener('click', (e) => {
  const li = e.target.closest('li.todo-item');
  if (!li) return;
  const id = li.dataset.id;

  if (e.target.matches('.delete-btn')) {
    deleteTask(id);
    return;
  }

  if (e.target.matches('input[type="checkbox"]')) {
    toggleTask(id);
    return;
  }

  // clicking the label toggles checkbox
  if (e.target.closest('.label')) {
    const cb = li.querySelector('input[type="checkbox"]');
    if (cb) {
      cb.checked = !cb.checked;
      toggleTask(id);
    }
  }
});

clearCompletedBtn.addEventListener('click', () => {
  clearCompleted();
});

/* Initialize */
document.addEventListener('DOMContentLoaded', () => {
  todos = load();
  render();
});