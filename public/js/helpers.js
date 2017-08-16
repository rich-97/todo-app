module.exports = {
  allTodos () {
    return document.querySelectorAll('.todo');
  },
  listMessage () {
    return `
      <span class="list-message">None things for do here.</span>
    `;
  },
  setTotal () {
    const $panelTotal = document.querySelector('.panel-total');
    $panelTotal.textContent = `total: ${this.allTodos().length}`;
  },
  checkboxBehavior ($select, cb) {
    $select.onclick = function () {
      const $cbx = this.previousElementSibling;

      if ($cbx.checked) {
        $cbx.checked = false;
      } else {
        $cbx.checked = true;
      }

      typeof cb !== 'undefined' ? cb($cbx) : void 0;
    };
  },
  setEvents ($todos) {
    let total = $todos.length;

    for (let i = 0; i < $todos.length; i++) {
      const $todoCbx = $todos[i].children[0];
      const $select = $todoCbx.children[1];
      const $delete = $todos[i].parentElement.children[1];
      const id = $todos[i].id;

      // Double click for modify the TODO.
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

      this.checkboxBehavior($select);

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
          this.setTotal(--total);

          if (!this.allTodos().length) {
            const $list = document.querySelector('.list');
            $list.innerHTML = this.listMessage();
          }
        }).catch((error) => console.log(error));
      };
    }
  }
}

// Resolve the problem with the context (is by webpack).
Object.keys(module.exports).forEach(function (key) {
  if (typeof module.exports[key] === 'function') {
    module.exports[key] = module.exports[key].bind(module.exports);
  }
});
