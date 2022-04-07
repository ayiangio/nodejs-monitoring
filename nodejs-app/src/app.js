const express = require('express')
const route = require('./bmiRoute')
const app = express()
const prome = require('prom-client')

const httpRequestDurationMicroseconds = new prome.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in microseconds',
    labelNames: ['method', 'route', 'code','app']
})

app.use(express.json())
app.use((req, res, next) => {
    res.locals.startEpoch = Date.now()
    console.log("starting time ", res.locals.startEpoch);
    next()
})

app.use(route)

app.use((req, res, next) => {
    const responseTimeInMs = Date.now() - res.locals.startEpoch
    console.log("end time ", responseTimeInMs);
    httpRequestDurationMicroseconds
        .labels(req.method, req.url, res.statusCode,'Bmi-api')
        .observe(responseTimeInMs)

    next()
})
module.exports = app