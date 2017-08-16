const fs = require('fs')
const path = require('path')
const http = require('http')
const url = require('url')
const qs = require('querystring')

const mongojs = require('mongojs')

const serveStatics = require('./modules/statics')
const logger = require('./modules/logger')

const server = http.createServer()
const port = process.env.PORT || 8080
const host = '127.0.0.1'

const view = path.join(__dirname, 'public/dist/index.html')

const db = mongojs('todo-app', ['todo'])

if (process.env.DEV) {
  logger(server)
}

/* Serve statics files */
serveStatics({
  server: server,
  rootPath: path.resolve(__dirname, 'public/dist/assets'),
  ignore: ['/', '/todos', '/delete', '/update']
})

server.on('request', onRequest)
server.listen(port, host, listen)
db.on('error', onErrorDB)
db.on('connect', onConnectDB)

// The big routing.
function onRequest (req, res) {
  const reqUrl = url.parse(req.url)

  if (reqUrl.pathname === '/') {
    let method = req.method.toLowerCase()

    if (method === 'get') {
      let html = fs.readFileSync(view)
      let htmlStr = html.toString()

      res.writeHead(200, { 'content-type': 'text/html' })
      res.write(htmlStr)
    }

    if (method === 'post') {
      req.on('data', function (chunk) {
        let str = chunk.toString()
        let obj = JSON.parse(str)

        db.todo.insert(obj)
        res.writeHead(201)
      })
    }

    res.end()
  } else if (reqUrl.pathname === '/todos') {
    db.todo.find(function (err, docs) {
      if (err) { throw err }

      res.writeHead(200, { 'content-type': 'application/json' })
      res.write(JSON.stringify(docs) + '\n')
      res.end()
    })
  } else if (reqUrl.pathname === '/delete' && /id=\d+/.test(reqUrl.query)) {
    const query = qs.parse(reqUrl.query)
    const id = parseInt(query.id)

    db.todo.remove({ id: id }, () => res.end())
  } else if (reqUrl.pathname === '/favicon.ico') {
    const ico = fs.readFileSync('./favicon.ico')

    res.writeHead(200)
    res.write(ico)
    res.end()
  } else if (reqUrl.pathname === '/update') {
    const query = qs.parse(reqUrl.query)
    const id = parseInt(query.id)

    if (/id=\d+&fact=[0-1]/.test(reqUrl.query)) {
      const fact = Boolean(parseInt(query.fact))

      db.todo.update(
        { id: id },
        {
          $set: { fact: fact }
        }, () => res.end()
      )
    } else if (/id=\d+&text=[a-z0-9]*/.test(reqUrl.query)) {
      const newText = query.text

      db.todo.update(
        { id: id },
        {
          $set: { text: newText }
        }, () => res.end()
      )
    }
  } else if (reqUrl.pathname === '/req-ajax/dist/ajax.min.js') {
    const file = fs.readFileSync('./node_modules/req-ajax/dist/ajax.min.js')

    res.write(file)
    res.end()
  }
}

function listen () {
  console.log(`The server is running on ${host}:${port}.`)
}

function onErrorDB () {
  console.log('Error to connect to the database.')
  process.exit(1)
}

function onConnectDB () {
  console.log('Database connected.')
}
