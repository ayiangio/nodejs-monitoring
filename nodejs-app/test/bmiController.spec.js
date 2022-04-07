const app = require('../src/app')
const request = require('supertest')

describe('GET /', function () {
    let server
    beforeAll(() => {
        server = app.listen(3001, () => {
            console.log(`\n Server listening on port 3001 \n`)
        })
    })
    afterAll(() => {
        server.close()
    })
    it('response BMI normal', function (done) {
        request(app)
            .get('/?height=150&weight=53')
            .set('Accept', 'application/json')
            .expect(200)
            .then(response => {
                expect(response.body.label).toEqual('normal');
                expect(response.body.bmi).toBeCloseTo(23.555555555555557, 6)
                done();
            })
            .catch(err => done(err))
    });
    it('response error when input is not a number', function (done) {
        request(app)
            .get('/?height=test&weight=53')
            .set('Accept', 'application/json')
            .expect(400)
            .then(() => {
                done()
            })
            .catch(err => done(err))
    });
});