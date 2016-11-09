const fs = require('fs');
const path = require('path');
const { createIndicator } = require('../util');
const { hasAward } = require('../preconditions');

const testFunction = release => {
  const { awards } = release;
  const uniqueSuppliers = awards
    .reduce((suppliers, award) => suppliers.concat(award.suppliers.map(s => s._id)), [])
    .filter((s, i, arr) => arr.indexOf(s) === i);
  return uniqueSuppliers.length === 1;
};

const i007 = createIndicator('i007', testFunction, {
  shortDesc: 'This competitive tender featured a single bidder only',
  docs: fs.readFileSync(path.join(__dirname, 'i007.md')).toString(),
  preconditions: [ hasAward ],
  requiredOCDSFields: [],
  requiredCustomFields: [ 'awards.suppliers._id' ]
});

module.exports = i007;
