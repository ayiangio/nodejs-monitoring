const express = require('express')
const Route = express.Router()
const bmiController = require('./bmiController')

Route
  .get('/', bmiController.calculateBmi)

module.exports = Route