'use strict';

const setTotal = require('./set_total');
const setEvents = require('./set_events');
const allTodos = require('./all_todos');
const listMessage = require('./list_message');
const Todo = require('./Todo');

window.onload = function () {
  const $form = document.querySelector('form');
  const $list = document.querySelector('.list');
  const $input = document.querySelector('input[name="todo"]');
  const $already = document.querySelector('.panel-already');
  const $delete = document.querySelector('.panel-delete');

  let id = 0;

  ajax.get('/todos')
    .then(function (res) {
      res = JSON.parse(res);

      if (!res.length) {
        $list.innerHTML = listMessage();
      } else {
        for (let i = 0; i < res.length; i++) {
          const el = res[i];
          const newTodo = new Todo(el.id, el.text, el.fact);

          $list.innerHTML += `<li>${newTodo.toHtml()}</li>`;
          setTotal();
          setEvents(allTodos());
        }
      }
    }).catch((err) => console.log(err));

  $already.onclick = function () {
    const todos = allTodos();

    for (let i = 0; i < todos.length; i++) {
      const $todoCbx = todos[i].children[0];
      const $cbx = $todoCbx.children[0];
      const $todoText = todos[i].children[1];

      if ($cbx.checked) {
        const id = todos[i].id;
        let fact;

        if ($todoText.classList.contains('already')) {
          fact = 0;
        } else {
          fact = 1;
        }

        ajax.query({
          url: '/update',
          method: 'PUT',
          params: {
            id: id,
            fact: fact
          }
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
        arr.push(todos[i].id);
      }
    }

    for (let i = 0; i < arr.length; i++) {
      ajax.query({
        url: '/delete',
        method: 'DELETE',
        params: {
          id: arr[i]
        }
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
    const url = this.action;

    if (todoText !== '') {
      id = allTodos().length + 1;

      const newTodo = new Todo(id, todoText);

      ajax.post(url, newTodo.toJson())
        .then(function () {
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

    $input.value = '';

    e.preventDefault();
  };

  setTotal();
};
