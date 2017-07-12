'use strict';

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

    $todos[i].ondblclick = function () {
      const newText = prompt('Modify the TODO:', $todos[i].children[1].textContent);

      if (newText) {
        ajax.query({
          url: '/update',
          method: 'PUT',
          params: {
            id: id,
            text: newText
          }
        }).then(function () {
          $todos[i].children[1].textContent = newText;
        }).catch(err => console.log(err));
      }
    };

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

      ajax.query({
        url: '/delete',
        method: 'DELETE',
        params: {
          id: id
        }
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
