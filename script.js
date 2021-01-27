const buttonAddSelector = document.querySelector('.button-add');
const inputAddSelector = document.querySelector('.input-add');
const todosSelector = document.querySelector('.todos');
const checkAllSelector = document.querySelector('.check-all');
const couterTodosSelector = document.querySelector('.couter-todos');
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
const setCheckAllStatus = (status = false) => {
  checkAllSelector.checked = status;
};

const setCounter = (lengthCompletedTodos, lengthAllTodos) => {
  couterTodosSelector.innerHTML = `You done ${lengthCompletedTodos}/${lengthAllTodos} todos`;
};

const filterArray = (array, value = true, key = 'status') => (
  array.filter((item) => item[key] !== value)
);

const getCurrentParentId = (target) => Number(target.parentElement.getAttribute('id'));

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
    this.checkAllTodos = this.checkAllTodos.bind(this);
    this.counterTodos = this.counterTodos.bind(this);
    this.manageFunction = this.manageFunction.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
  }

  controllers() {
    buttonAddSelector.addEventListener('click', this.addTodo);
    inputAddSelector.addEventListener('keypress', (event) => event.key === ENTER && this.addTodo());
    todosSelector.addEventListener('change', (event) => event.target.closest('.check-todo') && this.checkTodo(event));
    checkAllSelector.addEventListener('change', this.checkAllTodos);
    todosSelector.addEventListener('click', (event) => event.target.closest('.delete-todo') && this.deleteTodo(event));
  }

  manageFunction() {
    renderTodos(this.todos);

    this.counterTodos();
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
      inputAddSelector.value = null;
      this.manageFunction();
    }
  }

  checkTodo({ target }) {
    const currentId = getCurrentParentId(target);
    const currentStatus = target.checked;
    this.todos = this.todos
      .map((item) => (item.id === currentId ? { ...item, status: currentStatus } : item));
    this.manageFunction();
  }

  checkAllTodos({ target: { checked: currentStatus } }) {
    this.todos = this.todos.map((item) => ({ ...item, status: currentStatus }));
    this.manageFunction();
  }

  deleteTodo({ target }) {
    const currentId = getCurrentParentId(target);
    this.todos = filterArray(this.todos, currentId, 'id');
    this.manageFunction();
  }

  counterTodos() {
    const lengthCompletedTodos = filterArray(this.todos, false).length;
    const lengthAllTodos = this.todos.length;
    setCounter(lengthCompletedTodos, lengthAllTodos);
    setCheckAllStatus(lengthCompletedTodos === lengthAllTodos);
  }


}

const newTodo = new Todo();
newTodo.controllers();
