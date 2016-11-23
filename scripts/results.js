/* eslint-disable no-console */

const path = require('path');
const BabyParse = require('babyparse');
const flags = require('../src/flags');

const FILE_NAME = process.argv[2];

if (!FILE_NAME) {
  throw new Error('No release CSV path specified');
}

const csvPath = path.join(process.cwd(), FILE_NAME);

const { data } = BabyParse.parseFiles(csvPath, {
  dynamicType: true,
  header: true
});
const flagIds = Object.keys(flags);

const records = data
  .map(record => {
    delete record.ocid;
    return record;
  })
  .map(record => Object.keys(record)
    .reduce((typedRecord, flagId) => {
      typedRecord[flagId] = record[flagId] === 'null' ? null : record[flagId] === 'true';
      return typedRecord;
    }, {})
  );

flagIds.forEach(flagId => {
  const flaggedTrue = records.filter(record => record[flagId] === true).length;
  const flaggedFalse = records.filter(record => record[flagId] === false).length;
  const flaggedNull = records.filter(record => record[flagId] === null).length;
  console.log(flagId);
  console.log('------------------');
  console.log(['true', 'false', 'null'].join('\t'));
  console.log([flaggedTrue, flaggedFalse, flaggedNull].join('\t'));
  console.log();
});

