/* eslint-disable no-console */

// big old ugly file....

const fs = require('fs');
const path = require('path');
const mongodb = require('mongodb');
const { mongoUri } = require('../config.js');
const flags = require('../src/flags');

const outFile = `release-${new Date().getTime()}.csv`;
const outPath = path.join(__dirname, '..', 'output', outFile);

const setup = [ mongodb.connect(mongoUri), fs.createWriteStream(outPath) ];

const flagIds = Object.keys(flags);

const cleanup = (dbConnection, writeStream) =>
  Promise.all([dbConnection.close(), writeStream.end()])
    .catch(err => console.log(err));

let collectionFlagResults;

// http://www.cipe.org/sites/default/files/publication-docs/TI-Report-Vietnam.pdf
const INDICATOR_OPTIONS = {
  i004: {
    soleSourceLimits: {
      1: 2000000000, // Goods (2 billion)
      3: 5000000000, // Construction (5 billion)
      5: 3000000000, // Services (3 billion)
      10: 5000000000 // Construction (5 billion)
    }
  },
  i038: { threshold: 7 },
  i077: { maxAwards: 3, timePeriod: 365 },
  i171: { threshold: 0.01 },
  i180: { threshold: 365 * 3 }
};

let dbConnection;
let writeStream;

Promise.all(setup)
  .then(([d, w]) => {
    dbConnection = d;
    writeStream = w;
    writeStream.write(`${[ 'ocid', ...flagIds].join(',')}\n`);
    return dbConnection.collection('release').find({}).toArray();
  })
  .then(releases => {

    console.log('releases loaded');
    console.log('calculating + cacheing aggregate results');

    // pre-compute results for flags that required looking at entire collection
    collectionFlagResults = flagIds
      .filter(f => flags[f].type === 'collection')
      .reduce(
        (results, f) => Object.assign({}, results, {
          [f]: flags[f](releases, INDICATOR_OPTIONS[f] || {}) || {}
        }), {}
      );

    console.log('done calculating aggregate results');

  })
  .then(() => dbConnection.collection('release').find({}))
  .then(cursor => new Promise((resolve, reject) => {

    let count = 0;

    console.log('starting release-level result calculations');

    cursor.forEach(release => {

      console.log('processing release', ++count);
      const releaseResult = [ release.ocid ];

      flagIds.forEach(f => {
        let flagResult;
        if (flags[f].type === 'collection') {
          const lookedUp = collectionFlagResults[f][release.ocid];
          flagResult = (typeof lookedUp === 'boolean') ? lookedUp : null;
        } else {
          // if not a collection indicator then calculate directly
          flagResult = flags[f](release, INDICATOR_OPTIONS[f] || {});
        }
        releaseResult.push(flagResult);
      });

      writeStream.write(`${releaseResult.map(r => r === null ? 'null' : r).join(',')}\n`);

    }, err => {
      console.log('done processing releases');
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });

  }))
  .catch(err => {
    console.log(err);
  })
  .then(() => cleanup(dbConnection, writeStream))
  .then(() => console.log('Done!'))
  .catch(err => {
    console.log(err.stack);
  });
