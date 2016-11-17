// TODO: clean up all of this code

const fs = require('fs');
const path = require('path');
const { createCollectionIndicator } = require('../util');
const { hasAward, isLimited } = require('../preconditions');

const testFunction = (collection, options) => {

  const { soleSourceLimit, threshold } = options;

  // create a count of awards within the threshold of the sole source limit by supplier
  const flaggedBySupplier = {};
  collection.forEach(release => {
    release.awards
      .filter(award => award.status === 'active')
      .forEach(award => {
        if (Math.abs((award.value.amount - soleSourceLimit) / soleSourceLimit) <= threshold ||
          award.value.amount > soleSourceLimit) {
          award.suppliers.forEach(supplier => {
            flaggedBySupplier[supplier._id] = flaggedBySupplier[supplier._id] || 0;
            flaggedBySupplier[supplier._id]++;
          });
        }
      });
  });

  // create a list of all suppliers who have multiple problematic sole source awards
  const riskySuppliers = Object.keys(flaggedBySupplier).filter(key => flaggedBySupplier[key] > 1);

  // TODO: we should only flag the sole-source contracts within the threshold
  // return true for any release that features a winning supplier who is on the naughty list
  const result = collection.reduce(
    (resultByRelease, release) => {
      let result = false;
      release.awards
        .filter(award => award.status === 'active')
        .forEach(award => {
          award.suppliers.forEach(supplier => {
            if (riskySuppliers.indexOf(supplier._id) > -1) {
              result = true;
            }
          });
        });
      return Object.assign({}, resultByRelease, { [release.ocid]: result });
    },
    {}
  );

  return result;

};

const i004 = createCollectionIndicator('i004', testFunction, {
  shortDesc: 'Multiple sole source awards above or just below the sole source limit',
  docs: fs.readFileSync(path.join(__dirname, 'i004.md')).toString(),
  requiredOCDSFields: [
    'ocid',
    'awards.status',
    'tender.procurementMethod',
    'awards.value.amount'
  ],
  requiredCustomFields: [ 'awards.suppliers._id' ],
  filters: [ isLimited, hasAward ]
});

module.exports = i004;
