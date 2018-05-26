require('babel-polyfill')
require('dotenv').config({ path: '../.env' })
const assert = require('assert')
const express = require('express')
const path = require('path')
const compression = require('compression')
const cors = require('cors')
const web3utils = require('web3-utils')
const winston = require('winston')
const expressWinston = require('express-winston')
const handlers = require('./handlers')
const bodyParser = require('body-parser')
const apiKey = require('./utils/key')
const cache = require('memory-cache')

const app = express()
assert.strictEqual(web3utils.isAddress(process.env.OWNER), true, 'We need and owner!')

app.use(cors())
app.use(bodyParser.json({ limit: '10mb' }))
app.use(compression())

app.use(expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: 'error.log',
      level: 'error'
    }),
    new winston.transports.Console({
      json: true,
      silent: process.env.NODE_ENV === 'testing',
      colorize: true
    })
  ],
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}} Time: {{res.responseTime}}ms',
  expressFormat: false,
  colorize: false
}))

app.post('/', async (req, res) => {
  if (req.body.apiKey === apiKey) {
    const handler = handlers[req.body.action]

    if (handler) {
      await handler(req, res)
    } else {
      // console.error(`${req.body.action} doesn't have defined handler`)
      res.sendStatus(500)
    }
  } else {
    res.sendStatus(500)
  }
})

const PORT = process.env.API_PORT ? process.env.API_PORT : 3001
const server = app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.log(err)
  }
  console.info(`==> listening on http://localhost:${PORT}.`)
})

function stop() {
  server.close()
}

module.exports = app
module.exports.stop = stop
