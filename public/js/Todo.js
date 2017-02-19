'use strict';

class Todo {
  constructor (id, text, fact) {
    this.id = id;
    this.text = text;
    this.fact = Boolean(fact);
  }

  toHtml () {
    const already = this.fact ? 'already' : '';

    return `
      <div id="${this.id}" class="todo">
        <div class="todo-checkbox">
          <input type="checkbox" name="select">
          <label for="select"></label>
        </div>
        <span class="todo-text ${already}">${this.text}</span>
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
