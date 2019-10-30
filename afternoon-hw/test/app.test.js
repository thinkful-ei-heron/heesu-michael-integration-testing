const {expect} = require('chai');
const app = require('../app');
const data = require('../playstore');
const supertest = require('supertest');

describe('GET /playstore', () => {
    it('should return with 200', () => {
        return supertest(app)
            .get('/apps')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.deep.equal(data);
            });
    });

    it('should return by rating', () => {
        return supertest(app)
            .get('/apps')
            .query({sort: 'rating'})
            .then(res => {
                expect(res.body)
            })
    })

    it('should return with 400 error', () => {
        return supertest(app)
            .get('/apps')
            .query({sort: 'INVALID'})
            .expect(400, 'must one of genre and rating ')
    })
});