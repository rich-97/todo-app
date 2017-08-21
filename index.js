const fs = require('fs')
const path = require('path')
const http = require('http')
const url = require('url')
const qs = require('querystring')

const mongojs = require('mongojs')

const server = http.createServer()
const port = process.env.PORT || 8080
const view = path.join(__dirname, 'public/dist/index.html')
const db = mongojs('todo-app', ['todo'])

const serveStatics = require('./statics')
const logger = require('./logger')
const mime = require('./mime')
const route = require('./router')(server)

serveStatics(path.resolve(__dirname, 'public/dist/assets'), server)
process.env.DEV ? logger(server) : void 0

server.listen(port, onListen)
db.on('error', onErrorDB)
db.on('connect', onConnectDB)

route('/', function(req, res) {
  if (req.method === 'GET') {
    let html = fs.readFileSync(view)
    let htmlStr = html.toString()

    res.writeHead(200, mime.getContentType('html'))
    res.write(htmlStr)
    res.end()
  }

  if (req.method === 'POST') {
    req.on('data', function(chunk) {
      let str = chunk.toString()
      let obj = JSON.parse(str)

      db.todo.insert(obj)
      res.writeHead(201)
      res.end()
    })
  }
})

route('/todos', function(req, res) {
  db.todo.find(function(err, todos) {
    if (err) { throw err }

    res.writeHead(200, mime.getContentType('json'))
    res.write(JSON.stringify(todos))
    res.end()
  })
})

route('/delete', function(req, res) {
  if (/id=\d+/.test(req.urlObj.query)) {
    const query = qs.parse(req.urlObj.query)
    const id = parseInt(query.id)

    db.todo.remove({ id: id }, function() {
      res.writeHead(200)
      res.end()
    })
  }
})

route('/favicon.ico', function(req, res) {
  fs.readFile('./favicon.ico', function (err, ico) {
    if (err) { throw err }

    res.writeHead(200)
    res.end(ico)
  })
})

route('/update', function(req, res) {
  const query = qs.parse(req.urlObj.query)
  const id = parseInt(query.id)

  if (/id=\d+&fact=[0-1]/.test(req.urlObj.query)) {
    const fact = Boolean(parseInt(query.fact))

    db.todo.update({ id }, { $set: { fact } }, function() {
      res.writeHead(200)
      res.end()
    })
  }

  if (/id=\d+&text=[a-z0-9]*/.test(req.urlObj.query)) {
    const newText = query.text

    db.todo.update({ id }, { $set: { text: newText } }, function() {
      res.writeHead(200)
      res.end()
    })
  }
})

route('/req-ajax/dist/ajax.min.js', function(req, res) {
  const file = fs.readFile('./node_modules/req-ajax/dist/ajax.min.js', function(err, file) {
    res.writeHead(200)
    res.end(file)
  })
})

function onListen () {
  console.log(`The server is running on *:${port}.`)
}

function onErrorDB () {
  console.log('Error to connect to the database.')
  process.exit(1)
}

function onConnectDB () {
  console.log('Database connected.')
}
