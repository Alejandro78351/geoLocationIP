const express = require('express')

const app = express()

app.use(require('./v1/IPLocationController'))

module.exports = app
