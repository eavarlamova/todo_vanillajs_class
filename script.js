const buttonAddSelector = document.querySelector('.button-add');
const inputAddSelector = document.querySelector('.input-add');
const todosSelector = document.querySelector('.todos');
const checkAllSelector = document.querySelector('.check-all');
const couterTodosSelector = document.querySelector('.couter-todos');
const buttonDeleteCompletedSelector = document.querySelector('.button-delete-completed');
const tabsSelector = document.querySelector('.tabs');
const paginationSelector = document.querySelector('.pagination');

const ENTER = 'Enter';
const MAX_TODOS = 5;

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

const normalizeCurrentPage = (page, lastPage) => (page > lastPage ? lastPage : page) || 1;

const setCheckAllStatus = (status = false) => {
  checkAllSelector.checked = status;
};

const setCounter = (lengthCompletedTodos, lengthAllTodos) => {
  couterTodosSelector.innerHTML = `You done ${lengthCompletedTodos}/${lengthAllTodos} todos`;
};

const filterArray = (array, value = true, key = 'status') => (
  array.filter((item) => item[key] !== value)
);

const mapArray = (array, id, key, value) => (
  array.map((item) => (item.id === id ? { ...item, [key]: value } : item))
);

const setActiveElements = (tab = 'all-tab', page = 1, allPages) => {
  const renderTabs = ['all', 'active', 'completed'].reduce((str, item) => (
    `${str}<button class="tab btn ${`${item}-tab` === tab ? 'btn-info' : 'btn-light'} col" id="${item}-tab"> ${item} </button>`
  ), '');
  const renderPages = Array.from({ length: allPages }, (v, k) => k + 1).reduce((str, item) => (
    `${str}<li class="page-item ${item === page && 'active'}" id="${item}"><a class="page-link" href="#">${item}</a></li>`
  ), '');
  tabsSelector.innerHTML = renderTabs;
  paginationSelector.innerHTML = renderPages;
};

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

const showEditInput = ({ target }) => {
  const newEditElemnt = document.createElement('input');
  newEditElemnt.className = 'edit-todo';
  newEditElemnt.value = target.innerHTML.trim();
  target.parentElement.replaceChild(newEditElemnt, target);
  newEditElemnt.focus();
};

const getLastPage = (array) => Math.ceil(array.length / MAX_TODOS);

const getFilterTabTodos = (array, tab) => {
  let currentTodos = array;
  if (tab !== 'all-tab') {
    const filterFlag = tab === 'completed-tab';
    currentTodos = filterArray(array, !filterFlag);
  }
  return currentTodos;
};

const getFilterPageTodos = (array, page = 1) => {
  const start = (page - 1) * MAX_TODOS;
  const end = start + MAX_TODOS;
  return array.slice(start, end);
};

class Todo {
  constructor() {
    this.todos = [];
    this.currentTab = 'all-tab';
    this.currentPage = 1;

    this.addTodo = this.addTodo.bind(this);
    this.checkTodo = this.checkTodo.bind(this);
    this.checkAllTodos = this.checkAllTodos.bind(this);
    this.counterTodos = this.counterTodos.bind(this);
    this.manageFunction = this.manageFunction.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.deleteCompletedTodos = this.deleteCompletedTodos.bind(this);
    this.saveEditTodo = this.saveEditTodo.bind(this);
    this.setCurrentTab = this.setCurrentTab.bind(this);
    this.setCurrentPage = this.setCurrentPage.bind(this);
  }

  controllers() {
    buttonAddSelector.addEventListener('click', this.addTodo);
    inputAddSelector.addEventListener('keypress', (event) => event.key === ENTER && this.addTodo());
    todosSelector.addEventListener('change', (event) => event.target.closest('.check-todo') && this.checkTodo(event));
    checkAllSelector.addEventListener('change', this.checkAllTodos);
    todosSelector.addEventListener('click', (event) => event.target.closest('.delete-todo') && this.deleteTodo(event));
    buttonDeleteCompletedSelector.addEventListener('click', this.deleteCompletedTodos);
    todosSelector.addEventListener('dblclick', (event) => event.target.closest('.text-todo') && showEditInput(event));
    todosSelector.addEventListener('keypress', (event) => event.target.closest('.edit-todo') && event.key === ENTER && this.saveEditTodo(event));
    tabsSelector.addEventListener('click', this.setCurrentTab);
    paginationSelector.addEventListener('click', this.setCurrentPage);
  }

  manageFunction() {
    let currentTodos = getFilterTabTodos(this.todos, this.currentTab);
    const lastPage = getLastPage(currentTodos);
    this.currentPage = normalizeCurrentPage(this.currentPage, lastPage);
    currentTodos = getFilterPageTodos(currentTodos, this.currentPage);
    renderTodos(currentTodos);
    this.counterTodos();
    setActiveElements(this.currentTab, this.currentPage, lastPage);
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
      this.currentTab = 'all-tab';
      this.currentPage = getLastPage(this.todos);
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

  deleteCompletedTodos() {
    this.todos = filterArray(this.todos);
    this.manageFunction();
  }

  saveEditTodo({ target }) {
    const currentId = getCurrentParentId(target);
    const newText = target.value;
    this.todos = mapArray(this.todos, currentId, 'text', newText);
    this.manageFunction();
  }

  counterTodos() {
    const lengthCompletedTodos = filterArray(this.todos, false).length;
    const lengthAllTodos = this.todos.length;
    setCounter(lengthCompletedTodos, lengthAllTodos);
    setCheckAllStatus(lengthCompletedTodos === lengthAllTodos && lengthAllTodos);
  }

  setCurrentTab({ target }) {
    this.currentTab = target.getAttribute('id');
    this.currentPage = 1;
    this.manageFunction();
  }

  setCurrentPage({ target }) {
    this.currentPage = Number(target.innerHTML);
    this.manageFunction();
  }
}

const newTodo = new Todo();
newTodo.controllers();
