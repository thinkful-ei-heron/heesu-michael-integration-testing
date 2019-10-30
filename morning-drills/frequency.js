const express = require('express');
const app = express();

app.get('/frequency', (req, res) => {
  const { s } = req.query;

  if (!s) {
    return res.status(400).send('Invalid request');
  }

  const counts = s
    .toLowerCase()
    .split('')
    .reduce((acc, curr) => {
      if (acc[curr]) {
        acc[curr]++;
      } else {
        acc[curr] = 1;
      }
      return acc;
    }, {});

  const unique = Object.keys(counts).length;
  const average = s.length / unique;
  let highest = '';
  let highestVal = 0;

  Object.keys(counts).forEach(k => {
    if (counts[k] > highestVal) {
      highestVal = counts[k];
      highest = k;
    }
  });

  counts.count = unique;
  counts.average = average;
  counts.highest = highest;
  res.json(counts);
});

module.exports = app;
