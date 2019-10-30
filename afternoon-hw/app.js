const express = require('express');
const morgan = require('morgan');

const appsData = require('./playstore');
const app = express();
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('server works');
});

app.get('/apps', (req, res) => {
  let sortedData;

  if ('sort' in req.query) {
    if (req.query.sort == 'app') {
      // sort by App (app name)
      sortedData = appsData.sort((a, b) =>
        a.App > b.App ? 1 : a.App === b.App ? 0 : -1
      );
    } else if (req.query.sort == 'rating') {
      // sort by rating
      sortedData = appsData.sort((a, b) => {
        if (a.Rating - b.Rating) {
          return a.Rating - b.Rating;
        }
        return a.App > b.App ? 1 : -1; //app names should never be identical, so useful tiebreaker
      });
    } else {
      res.status(400).send("Sort must be one of 'app' and 'rating' ");
      return;
    }
  } else {
    sortedData = appsData;
  }

  if ('genre' in req.query) {
    if (
      ['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'].indexOf(
        req.query.genre
      ) >= 0
    ) {
      sortedData = sortedData.filter(item =>
        item.Genres.toLowerCase().includes(req.query.genre)
      );
    } else {
      res.status(400).send('genre does not exist');
      return;
    }
  }
  res.status(200).json(sortedData);
});

module.exports = app;
