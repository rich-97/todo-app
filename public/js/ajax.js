'use strict';

module.exports = ajax;

function ajax (options) {
  const promise = new Promise(
    function (resolve, reject) {
      const req = new XMLHttpRequest();
      const url = options.url;
      const method = options.method;
      const data = options.data;

      req.open(method, url, true);

      if (method === 'POST') {
        req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      }

      req.send(data);

      req.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          resolve(this.responseText);
        } else if (this.status === 403) {
          reject(`The request to ${url} was refusing.`);
        } else if (this.status === 404) {
          reject(`Not found ${url}.`);
        }
      };
    }
  );

  return promise;
}
