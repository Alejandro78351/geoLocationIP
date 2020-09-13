const express = require('express')
var cors = require('cors')
const app = express()
const compression = require('compression')

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
  if (res.headersSent) {
    return next(err)
  }
  res.status(err.status || 500)
  res.send({ error: err.message })
})

module.exports = app
