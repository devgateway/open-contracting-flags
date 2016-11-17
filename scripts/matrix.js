/* eslint-disable no-console */

const path = require('path');
const BabyParse = require('babyparse');
const flags = require('../src/flags');

const FILE_NAME = 'release-1479294377924.csv';
const csvPath = path.join(__dirname, '..', 'output', FILE_NAME);

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
      typedRecord[flagId] = record[flagId] === 'null' ? null : record[flagId] === 'true'
      return typedRecord;
    }, {})
  );

const twoDecimals = num => Math.round(num * 10000) / 10000;

flagIds.forEach(flagId => {
  const otherflagIds = flagIds.filter(f => f !== flagId);
  const flaggedRecords = records.filter(record => record[flagId]);
  console.log(flagId, flaggedRecords.length);
  console.log('-----------------');
  const proportions = otherflagIds.map(otherflagId => {
    const count = flaggedRecords.filter(record => record[otherflagId]).length;
    const proportion = twoDecimals(count / flaggedRecords.length);
    return proportion;
  });
  console.log(otherflagIds.join('\t'));
  console.log(proportions.join('\t'));
  console.log();
});

