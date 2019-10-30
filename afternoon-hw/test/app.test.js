const { expect } = require('chai');
const app = require('../app');
const data = require('../playstore');
const supertest = require('supertest');
const store = require('../playstore');
const date = require('date-and-time');

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

  it('should return properly sorted by rating', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'rating' })
      .then(res => {
        expect(res.body).eql(
          store.sort((a, b) => {
            if (a.Rating - b.Rating) {
              return a.Rating - b.Rating;
            }
            return a.App > b.App ? 1 : -1; 
            //app names should never be identical, so useful tiebreaker
          })
        );
      });
  });

  it('should return properly sorted by app name', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'app' })
      .then(res => {
        expect(res.body).eql(store.sort((a, b) => (a.App > b.App ? 1 : -1)));
      });
  });

  it('should return a filtered list if given a genre', () => {
    return supertest(app)
      .get('/apps')
      .query({ genre: 'casual' })
      .then(res => {
        expect(res.body).eql(
          store.filter(app => app.Genres.toLowerCase().includes('casual'))
        );
      });
  });

  it('should return a sorted, filtered list if given a genre and sort', () => {
    let expected = store
      .filter(app => app.Genres.toLowerCase().includes('casual'))
      .sort((a, b) => {
        if (a.Rating - b.Rating) {
          return a.Rating - b.Rating;
        }
        return a.App > b.App ? 1 : -1; 
        //app names should never be identical, so useful tiebreaker
      });
    return supertest(app)
      .get('/apps')
      .query({ sort: 'rating', genre: 'casual' })
      .then(res => {
        expect(res.body).eql(expected);
      });
  });

  it('should return with 400 error when sort parameter is invalid', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'INVALID' })
      .expect(400, "Sort must be one of 'app' and 'rating' ");
  });

  it('should return with 400 error when genre parameter is invalid', () => {
    return supertest(app)
      .get('/apps')
      .query({ genre: 'invalid' })
      .expect(400, 'Genre must one of Card, Arcade, Casual, Action, and Puzzle');
  });

  it('should return 400 error when genre is null', () => {
    return supertest(app)
      .get('/apps')
      .query({genre: ''})
      .expect(400, 'Genre must one of Card, Arcade, Casual, Action, and Puzzle')
  });

  it('should sort by last updated date', () => {
    return supertest(app)
      .get('/apps')
      .query({sort: 'updated'})
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        let expected = store.sort((a, b) => {
          if(date.parse(a['Last Updated'], 'MMMM D, YYYY') > date.parse(b['Last Updated'], 'MMMM D, YYYY')) {
            return -1;
          }
          return 1;
        })
        expect(res.body).to.deep.equal(expected);
      });
  });
});
