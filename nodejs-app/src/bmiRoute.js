const express = require('express')
const Route = express.Router()
const bmiController = require('./bmiController')
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
Route
  .get('/', (req, res, next) => {

    sleep(500)
    .then(()=>{
      next()
    })
  }, bmiController.calculateBmi)
  .get('/metrics', bmiController.metrics)

module.exports = Route