const {expect} = require('chai');
const supertest = require('supertest');
const app = require('../frequency')

describe('GET /frequency endpoint', ()=> {
    it('should return with status code 200', () => {
        return supertest(app)
            .get('/frequency')
            .query({s: 'aaBBAAbbbbaa'})
            .expect(200)   
    })
})