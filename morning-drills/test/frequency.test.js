const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../frequency');

describe('GET /frequency endpoint', () => {
  it('should return with status code 200 if a valid string is supplied', () => {
    return supertest(app)
      .get('/frequency')
      .query({ s: 'aaBBAAbbbbaa' })
      .expect(200);
  });
  it('should error if no string is supplied', () => {
    return supertest(app)
      .get('/frequency')
      .expect(400);
  });
  it('should work with text strings', () => {
    let s = 'aaBBAAbbaa';
    let expected = {
      count: 2,
      average: 5,
      highest: 'a',
      a: 6,
      b: 4
    };
    return supertest(app)
      .get('/frequency')
      .query({ s })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.include.all.keys('count', 'average', 'highest');
        expect(res.body).eql(expected);
      });
  });
  it('should work with alphanumeric strings', () => {
    let s = 'aaBBAAbbaa123';
    let expected = {
      count: 5,
      average: s.length / 5,
      highest: 'a',
      a: 6,
      b: 4,
      1: 1,
      2: 1,
      3: 1
    };
    return supertest(app)
      .get('/frequency')
      .query({ s })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.include.all.keys('count', 'average', 'highest');
        expect(res.body).eql(expected);
      });
  });
  it('should error with an empty string', () => {
    let s = '';
    return supertest(app)
      .get('/frequency')
      .query({ s })
      .expect(400);
  });
  it('should use the character first in lexical order if there is a tie for most frequent', () => {
    let s = 'abcabc';
    let expected = {
      count: 3,
      average: 2,
      highest: 'a',
      a: 2,
      b: 2,
      c: 2
    };
    return supertest(app)
      .get('/frequency')
      .query({ s })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.include.all.keys('count', 'average', 'highest');
        expect(res.body).eql(expected);
      });
  });
});
