const mongodb = require('mongodb');
const { i004 } = require('../src/flags');
const conf = require('../config.js');

// mongodb.connect(conf.mongoUri)
//   .then(dbConnection => {
//     const cursor = dbConnection.collection('release').find();
//     cursor.forEach(release => {
//       i004(release, {
//         soleSourceLimits: {
//           1: 2000000000, // Goods (2 billion)
//           3: 5000000000, // Construction (5 billion)
//           5: 3000000000, // Services (3 billion)
//           10: 5000000000 // Construction (5 billion)
//         }
//       });
//     });
//   });


const options = {
  soleSourceLimits: {
    1: 2000000000, // Goods (2 billion)
    3: 5000000000, // Construction (5 billion)
    5: 3000000000, // Services (3 billion)
    10: 5000000000 // Construction (5 billion)
  }
};

mongodb.connect(conf.mongoUri)
  .then(dbConnection => {
    return dbConnection.collection('release').findOne({_id: mongodb.ObjectId('57ee83d6f23b562596b5e0ab')});
  })
  .then(release => {
    console.log(release.tender.items)
    console.log(i004(release, options));
  })
  .catch(err => {
    console.log(err.stack);
  });
