'use strict';

const ajax = require('./ajax');
const setTotal = require('./set_total');
const setEvents = require('./set_events');
const allTodos = require('./all_todos');
const listMessage = require('./list_message');
const Todo = require('./Todo');

// TODO: Improve to be able to update a todo.

window.onload = function () {
  const $form = document.querySelector('form');
  const $list = document.querySelector('.list');
  const $input = document.querySelector('input[name="todo"]');
  const $already = document.querySelector('.panel-already');
  const $delete = document.querySelector('.panel-delete');

  const urlTodos = '/todos';
  const method = 'GET';

  let arrIds = [];

  ajax({
    url: urlTodos,
    method: method
  }).then(function (res) {
    res = JSON.parse(res);

    if (!res.length) {
      $list.innerHTML = listMessage();
    }

    for (let i = 0; i < res.length; i++) {
      const el = res[i];
      const newTodo = new Todo(el.id, el.text, el.fact);
      arrIds.push(newTodo.id);

      $list.innerHTML += `<li>${newTodo.toHtml()}</li>`;
      setTotal();
      setEvents(allTodos());
    }
  }).catch((err) => console.log(err));

  let id;

  if (arrIds.length > 0) {
    id = Math.max.apply(null, arrIds);
  } else {
    id = 0;
  }

  $already.onclick = function () {
    const todos = allTodos();

    for (let i = 0; i < todos.length; i++) {
      const $todoCbx = todos[i].children[0];
      const $cbx = $todoCbx.children[0];
      const $todoText = todos[i].children[1];

      if ($cbx.checked) {
        const id = todos[i].id;
        const method = 'PUT';
        let uri = `/update?id=${id}`;
        let fact;

        if ($todoText.classList.contains('already')) {
          fact = 'fact=0';
        } else {
          fact = 'fact=1';
        }

        uri = `${uri}&${fact}`;

        ajax({
          url: uri,
          method: method
        }).then(function () {
          $todoText.classList.toggle('already');
          $cbx.checked = false;
        }).catch((err) => console.log(err));
      }
    }
  };

  $delete.onclick = function () {
    const todos = allTodos();
    const arr = [];

    for (let i = 0; i < todos.length; i++) {
      const $todoCbx = todos[i].children[0];
      const $cbx = $todoCbx.children[0];

      if ($cbx.checked) {
        const id = todos[i].id;
        arr.push(id);
      }
    }

    for (let i = 0; i < arr.length; i++) {
      const uri = `/delete?id=${arr[i]}`;
      const method = 'DELETE';

      ajax({
        url: uri,
        method: method
      }).then(function () {
        const $el = document.getElementById(arr[i]);
        const $parent = $el.parentNode;
        $list.removeChild($parent);
        setTotal();

        if (!allTodos().length) {
          $list.innerHTML = listMessage();
        }
      }).catch((err) => console.log(err));
    }
  };

  $form.onsubmit = function (e) {
    const todoText = $input.value;
    const method = this.method;
    const url = this.action;

    if (todoText !== '') {
      id++;

      const newTodo = new Todo(id, todoText);

      ajax({
        url: url,
        method: method,
        data: newTodo.toJson()
      }).then(function () {
        const $firstChild = $list.firstElementChild;

        if ($firstChild.tagName === 'SPAN') {
          $list.removeChild($firstChild);
        }

        $list.innerHTML += `<li>${newTodo.toHtml()}</li>`;

        setTotal();
        setEvents(allTodos());
      }).catch((err) => { console.log(err); });
    } else {
      window.alert('The input is empty.');
    }

    e.preventDefault();
  };

  setTotal();
};
