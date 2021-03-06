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

const twoDecimals = num => Math.round(num * 10000) / 10000;

flagIds.forEach(flagId => {
  const flaggedRecords = records.filter(record => record[flagId]);
  console.log(flagId, flaggedRecords.length);
  console.log('-----------------');
  const proportions = flagIds.map(fId => {
    if (fId === flagId) {
      return 'null';
    } else {
      const count = flaggedRecords.filter(record => record[fId]).length;
      const proportion = twoDecimals(count / flaggedRecords.length);
      return proportion;
    }
  });
  console.log(flagIds.join('\t'));
  console.log(proportions.join('\t'));
  console.log();
});

