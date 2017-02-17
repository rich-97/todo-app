'use strict';

const allTodos = require('./all_todos');

module.exports = setTotal;

function setTotal () {
  const $panelTotal = document.querySelector('.panel-total');
  $panelTotal.textContent = `total: ${allTodos().length}`;
}
