const express = require('express')
const route = require('./bmiRoute')
const app = express()

app.use(express.json())
app.use(route)

module.exports = app