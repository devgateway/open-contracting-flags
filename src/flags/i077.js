const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { createCollectionIndicator } = require('../util');
const { hasAward } = require('../preconditions');

const testFunction = (collection, options) => {

  const { timePeriod, maxAwards } = options;
  const bySupplier = {};

  const result = {};

  const activeAwards = collection
    .reduce((allAwards, release) => allAwards.concat(
      release.awards.map(a => Object.assign({}, a, {
        ocid: release.ocid,
        peId: release.tender.procuringEntity.identifier._id
      }))
    ), [])
    .filter(award => award.status === 'active');

  // cache everything we need for calculations
  activeAwards.forEach(award => {
    award.suppliers.forEach(supplier => {
      bySupplier[supplier._id] = bySupplier[supplier._id] || [];
      bySupplier[supplier._id].push({
        ocid: award.ocid,
        peId: award.peId,
        date: award.date
      });
    });
  });

  // not ugly code at all...
  for (let supplierId in bySupplier) {
    let peIds = bySupplier[supplierId]
      .map(record => record.peId);
    peIds = peIds.filter((peId, i) => peIds.indexOf(peId) === i); // get unique
    peIds.forEach(peId => {
      const records = bySupplier[supplierId]
        .filter(record => record.peId === peId);
      const awardDates = records.map(record => record.date);
      awardDates.sort((a, b) => b.getTime() < a.getTime());
      for (let i = 0; i < awardDates.length; i++) {
        let endIndex = i;
        let awardCount = 1; // we start the loop at `i` so one award included by default
        for (let j = i + 1; j < awardDates.length; j++) {
          if (moment(awardDates[j]).diff(awardDates[i], 'days') > timePeriod) {
            break;
          } else {
            awardCount++;
          }
          endIndex = j;
        }
        if (awardCount > maxAwards) {
          // flag every contract which fell in the time period
          for (let k = i; k <= endIndex; k++) {
            let ocidToFlag = records[k].ocid;
            result[ocidToFlag] = true;
          }
        }
      }
    });
  }

  collection.forEach(release => {
    if (!result[release.ocid]) {
      result[release.ocid] = false;
    }
  });

  return result;

};

const i077 = createCollectionIndicator('i077', testFunction, {
  shortDesc: 'High number of contract awards to one bidder',
  docs: fs.readFileSync(path.join(__dirname, 'i077.md')),
  requiredOCDSFields: [
    'ocid',
    'awards.date',
    'awards.status'
  ],
  requiredCustomFields: [
    'awards.suppliers._id',
    'tender.procuringEntity.identifier._id'
  ],
  filters: [ hasAward ]
});

module.exports = i077;
