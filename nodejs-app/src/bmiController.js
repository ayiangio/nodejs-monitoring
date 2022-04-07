const Joi = require('joi');
const prome = require('prom-client')

let metricsGetsCounter = new prome.Counter({
    name: 'metrics_endpoint_get_requests',
    help: 'number of metrics GET requests',
    labelNames: ['method', 'route', 'code'],
});

let calculationBmiGetsCounter = new prome.Counter({
    name: 'calculationBmi_endpoint_get_requests',
    help: 'number of example GET requests',
    labelNames: ['method', 'route', 'code'],

});


prome.collectDefaultMetrics()

async function metrics(req, res) {
    metricsGetsCounter.labels(req.method, req.url, req.statusCode).inc()

    res.set('Content-Type', prome.register.contentType);
    res.end(await prome.register.metrics());
}

function calculateBmi(req, res, next) {
    const height = req.query.height
    const weight = req.query.weight

    const schema = Joi.object({
        height: Joi.number(),
        weight: Joi.number()
    })


    const { error, value } = schema.validate({ height, weight });
    if (error) {
        res.status(400).json({ status: 400 })
        calculationBmiGetsCounter.labels(req.method, req.url, res.statusCode).inc()
        next()
    }

    const heightToMeter = value.height / 100
    const meterSquared = Math.pow(heightToMeter, 2)
    const result = value.weight / meterSquared
    let label
    if (result > 25.0) {
        label = "Overweight"
    }
    else if (result < 18.5) {
        label = "underweight"
    }
    else {
        label = "normal"
    }

    calculationBmiGetsCounter.labels(req.method, req.url, 200).inc()
    res.status(200).json({
        "bmi": result,
        "label": label
    })
    next()
}
module.exports = {
    calculateBmi, metrics
}