'use strict';

class Todo {
  constructor (id, text) {
    this.id = id;
    this.text = text;
  }

  toHtml () {
    return `
      <div id="${this.id}" class="todo">
        <div class="todo-checkbox">
          <input type="checkbox" name="select">
          <label for="select"></label>
        </div>
        <span class="todo-text">${this.text}</span>
      </div>
      <div class=todo-delete>
        <img src="svg/x.svg" alt="x">
      </div>
    `;
  }

  toJson () {
    return JSON.stringify(this);
  }
}

module.exports = Todo;
