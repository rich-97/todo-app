class Todo {
  constructor (id, text, fact) {
    this.id = parseInt(id);
    this.text = text;
    this.fact = Boolean(fact);
  }

  toHtml () {
    const already = this.fact ? 'already' : '';

    return `
      <li class="${already}">
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
      </li>
    `;
  }

  toJson () {
    return JSON.stringify(this);
  }
}

module.exports = Todo;
