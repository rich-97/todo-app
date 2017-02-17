'use strict';

const ajax = require('./ajax');
const setTotal = require('./set_total');
const allTodos = require('./all_todos');
const listMessage = require('./list_message');

module.exports = setEvents;

function setEvents ($todos) {
  let total = $todos.length;

  for (let i = 0; i < $todos.length; i++) {
    const $todoCbx = $todos[i].children[0];
    const $select = $todoCbx.children[1];
    const $delete = $todos[i].parentElement.children[1];
    const id = $todos[i].id;

    $select.onclick = function () {
      const $cbx = this.previousElementSibling;

      if ($cbx.checked) {
        $cbx.checked = false;
      } else {
        $cbx.checked = true;
      }
    };

    $delete.onclick = function () {
      const $parent = this.parentElement;
      const uri = `/delete?id=${id}`;
      const method = 'DELETE';

      ajax({
        url: uri,
        method: method
      }).then(function () {
        $parent.parentElement.removeChild($parent);
        setTotal(--total);

        if (!allTodos().length) {
          const $list = document.querySelector('.list');
          $list.innerHTML = listMessage();
        }
      }).catch((error) => console.log(error));
    };
  }
}
