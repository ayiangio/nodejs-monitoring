const Joi = require('joi');

function calculateBmi(req, res) {
    const height = req.query.height
    const weight = req.query.weight

    const schema = Joi.object({
        height: Joi.number(),
        weight: Joi.number()
    })

    const { error, value } = schema.validate({ height, weight });
    if (error) {
        res.status(400).json({ status: 400 })
        return
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
    res.json({
        "bmi": result,
        "label": label
    })
}

module.exports = {
    calculateBmi
}