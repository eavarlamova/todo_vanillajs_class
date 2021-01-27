const buttonAddSelector = document.querySelector('.button-add');
const inputAddSelector = document.querySelector('.input-add');
const todosSelector = document.querySelector('.todos');
// const checkTodoSelector = document.querySelector('.check-todo');

const ENTER = 'Enter';

const normolizeText = (text) => (
  text
    .trim()
    .replace(/\u0026/gu, '&amp;')
    .replace(/\u003C/gu, '&lt;')
    .replace(/\u003E/gu, '&gt;')
    .replace(/\u0022/gu, '&quot;')
    .replace(/\u0027/gu, '&#x27;')
    .replace(/\u002F/gu, '&#x2F;')
);

const renderTodos = (array) => {
  todosSelector.innerHTML = array.reduce((str, { id, text, status }) => (
    `${str}
     <li class="todo list-group-item d-flex justify-content-between align-items-center" id="${id}">
                <input class="check-todo" type="checkbox" ${status && 'checked'}>
                <span class="text-todo"> ${text} </span>
                <button class="delete-todo btn-close" type="button" aria-label="Close"></button>
     </li>`
  ), '');
};
class Todo {
  constructor() {
    this.todos = [];
    this.currentTab = 'all';
    this.currentPage = 1;

    this.addTodo = this.addTodo.bind(this);
    this.checkTodo = this.checkTodo.bind(this);
  }

  controllers() {
    buttonAddSelector.addEventListener('click', this.addTodo);
    inputAddSelector.addEventListener('keypress', (event) => event.key === ENTER && this.addTodo());
    todosSelector.addEventListener('change', (event) => event.target.closest('.check-todo') && this.checkTodo(event));
  }

  addTodo() {
    const newText = normolizeText(inputAddSelector.value);
    if (newText) {
      const newTodo = {
        text: newText,
        status: false,
        id: Math.random(),
      };
      this.todos = [...this.todos, newTodo];
      renderTodos(this.todos);
      inputAddSelector.value = null;
    }
  }

  checkTodo({ target }) {
    const currentId = Number(target.parentElement.getAttribute('id'));
    const currentStatus = target.checked;
    this.todos = this.todos
      .map((item) => (item.id === currentId ? { ...item, status: currentStatus } : item));
    renderTodos(this.todos);
  }
}

const newTodo = new Todo();
newTodo.controllers();
