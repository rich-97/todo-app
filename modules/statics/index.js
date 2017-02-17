'use strict';

const fs = require('fs');
const path = require('path');

module.exports = function (config) {
  const rootPath = config.rootPath;
  const server = config.server;
  const ignore = config.ignore;

  server.on('request', (req, res) => {
    if (ignore.indexOf(req.url) === -1) {
      let filePath = path.join(rootPath, req.url);

      if (fs.existsSync(filePath)) {
        let stat = fs.statSync(filePath);

        if (stat.isFile()) {
          let file = fs.readFileSync(filePath);
          res.write(file);
          res.end();
        }
      }
    }
  });
};
