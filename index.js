const express = require('express')
const path = require('path')
const compression = require('compression')
const app = express()
const cors = require('cors')

const handlers = require('./handlers')

app.use(cors())
app.use(compression())

app.post('/api', (req, res) => {
  const handler = handlers[req.body.action]

  if (handler) {
    handler(req, res)
  } else {
    console.error(`${req.body.action} doesn't have defined handler`)
    res.sendStatus(500)
  }
})

const PORT = process.env.API_PORT ? process.env.API_PORT : 3001
app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.log(err)
  }
  console.info(`==> listening on http://localhost:${PORT}.`)
})
