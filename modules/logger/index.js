'use strict';

const colors = require('colors');

const util = require('util');

module.exports = logger;

function logger (server) {
  server.on('request', (req, res) => {
    const start = +new Date();
    const url = req.url.green;
    const method = req.method.underline.red;
    const incomingReq = `Request ${url} Method ${method} ... `;
    util.print(incomingReq);

    res.on('finish', function () {
      const duration = +new Date() - start;
      const message = `took ${duration}ms\n`;
      util.print(message);
    });
  });
}
