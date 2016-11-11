/* eslint-disable no-console */

const mongodb = require('mongodb');
const { i038 } = require('../src/flags');
const { mongoUri } = require('../config.js');

const THRESHOLDS = [0, 1, 3, 5, 7, 14, 21, 28, 60, 90, 120, 365];

let connectionRef;

const cleanup = () => connectionRef.close();

mongodb.connect(mongoUri)
.then(dbConnection => {

  connectionRef = dbConnection;
  const calcPromises = THRESHOLDS.map(threshold => new Promise((resolve, reject) => {
    const cursor = connectionRef.collection('release').find();
    const result = [threshold, 0, 0, 0];
    let i = 0;
    cursor.forEach(release => {
      ++i % 100 === 0 && console.log('processing threshold', threshold, 'release', i);
      const releaseResult = i038(release, { threshold });
      switch (releaseResult) {
        case true:
          result[1]++;
          break;
        case false:
          result[2]++;
          break;
        case null:
          result[3]++;
      }
    }, err => err ? reject(err) : resolve(result));
  }));

  return Promise.all(calcPromises);

})
.then(results => {
  console.log('here', 'results');
  console.log(results);
  console.log(results.map(r => r.join(' ')).join('\n'));
})
.then(
  cleanup,
  err => {
    console.log(err.stack);
    cleanup();
  }
);
