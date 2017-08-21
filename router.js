const url = require('url')

function router (server) {
  return function (routeUrl, cb) {
    server.on('request', function (req, res) {
      const urlObj = url.parse(req.url)

      if (urlObj.pathname === routeUrl) {
        req.urlObj = urlObj
        
        cb(req, res)
      }
    })
  }
}

module.exports = router