const express = require('express')
var cors = require('cors')
const app = express()
const compression = require('compression')
const debug = require('debug')('back:server')

app.use(compression())
app.use(cors())
app.use(express.json())

app.use('/v1', require('./middleware/validationMiddleware'))
app.use(require('./controller/index'))

app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use((err, req, res, next) => {
  err.status = err.status || 500
  const debugSelected = err.debug ? err.debug : debug
  delete err.debug
  if (err.status < 500) delete err.stack
  debugSelected(err)
  const jsonToSend = { error: err.message }
  if (err.errors) jsonToSend.errors = err.errors.map(er => er.message || er)
  res.status(err.status)
  res.json(jsonToSend)
})

module.exports = app
