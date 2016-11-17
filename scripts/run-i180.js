const mongodb = require('mongodb');
const { i172 } = require('../src/flags');
const conf = require('../config.js');

mongodb.connect(conf.mongoUri)
  .then(dbConnection => dbConnection.collection('release').find().toArray())
  .then(releases => {
    const result = i172(releases);
    console.log(result); // eslint-disable-line no-console
  })
  .catch(err => {
    console.log(err.stack); // eslint-disable-line no-console
  });
