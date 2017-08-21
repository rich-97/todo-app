exports.html = 'text/html'
exports.css = 'text/css'
exports.js = 'text/javascript'
exports.json = 'application/json'

exports.getContentType = function(type) {
  return { 'Content-Type': this[type] }
}