const helpers = require('./helpers');
const Todo = require('./Todo');

window.onload = function () {
  const $form = document.querySelector('form');
  const $list = document.querySelector('.list');
  const $input = document.querySelector('input[name=todo]');
  const $already = document.querySelector('.panel-already');
  const $delete = document.querySelector('.panel-delete');
  const $showCompletesCbx = document.querySelector('.form-checkbox');
  const $themes = document.getElementById('themes').children;

  for (let i = 0; i < $themes.length; i++) {
    const $theme = $themes[i];
    const $html = document.getElementsByTagName('html')[0];

    $theme.onclick = function (event) {
      $html.className = event.target.textContent;
    };
  }

  helpers.checkboxBehavior($showCompletesCbx.children[1], function ($cbx) {
    const ready = document.querySelectorAll('.already')

    for (let i = 0; i < ready.length; i++) {
      const $li = ready[i];

      if ($cbx.checked) {
        $li.style.display = 'block';
      } else {
        $li.style.display = 'none';
      }
    }
  });

  let id = 0;

  ajax.get('/todos')
    .then(function (res) {
      res = JSON.parse(res);

      if (!res.length) {
        $list.innerHTML = helpers.listMessage();
      } else {
        for (let i = 0; i < res.length; i++) {
          const el = res[i];
          const newTodo = new Todo(el.id, el.text, el.fact);

          $list.innerHTML += `<li>${newTodo.toHtml()}</li>`;

          helpers.setTotal();
          helpers.setEvents(helpers.allTodos());
        }
      }
    }).catch((err) => console.log(err));

  $already.onclick = function () {
    const todos = helpers.allTodos();

    for (let i = 0; i < todos.length; i++) {
      const todo = todos[i];
      const $todoCbx = todo.children[0];
      const $cbx = $todoCbx.children[0];
      const $li = todo.parentElement;

      if ($cbx.checked) {
        const id = todo.id;
        let fact;

        if ($li.classList.contains('already')) {
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
          $li.classList.toggle('already');

          $cbx.checked = false;
        }).catch((err) => console.log(err));
      }
    }
  };

  $delete.onclick = function () {
    const todos = helpers.allTodos();
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
        helpers.setTotal();

        if (!helpers.allTodos().length) {
          $list.innerHTML = helpers.listMessage();
        }
      }).catch((err) => console.log(err));
    }
  };

  $form.onsubmit = function (event) {
    const todoText = $input.value;
    const url = this.action;

    if (todoText !== '') {
      if (helpers.allTodos().length > 0) {
        id = parseInt(helpers.allTodos()[helpers.allTodos().length - 1].id) + 1;
      } else {
        id = 1;
      }

      const newTodo = new Todo(id, todoText);

      ajax.post(url, newTodo.toJson())
        .then(function () {
          const $firstChild = $list.firstElementChild;

          if ($firstChild.tagName === 'SPAN') {
            $list.removeChild($firstChild);
          }

          $list.innerHTML += newTodo.toHtml();

          helpers.setTotal();
          helpers.setEvents(helpers.allTodos());

          console.log(newTodo);
        }).catch((err) => { console.log(err); });
    } else {
      window.alert('The input is empty.');
    }

    $input.value = '';

    event.preventDefault();
  };

  helpers.setTotal();
};
