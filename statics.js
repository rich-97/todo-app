const fs = require('fs')
const path = require('path')
const url = require('url')

module.exports = function(rootPath, server) {
  server.on('request', function(req, res) {
    const reqUrl = url.parse(req.url)
    const filePath = path.join(rootPath, req.url)

    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath)

      if (stat.isFile()) {
        const file = fs.readFileSync(filePath)

        res.write(file)
        res.end()
      }
    }
  })
}
