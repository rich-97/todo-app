const colors = require('colors')

function logger(server) {
  server.on('request', function(req, res) {
    const start = +new Date()
    const url = req.url.green
    const method = req.method.underline.red

    res.on('finish', function() {
      const statusCode = res.statusCode.toString().yellow
      const duration = +new Date() - start
      const message = `${url} ${method} ${duration}ms ${statusCode}`

      console.log(message)
    })
  })
}

module.exports = logger