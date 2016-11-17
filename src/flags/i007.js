const fs = require('fs');
const path = require('path');
const { Set: ImmSet } = require('immutable');
const { createIndicator } = require('../util');
const { hasAward, isOpen } = require('../preconditions');

const testFunction = release => {
  const supplierCombos = release.awards.map(award => ImmSet(award.suppliers.map(s => s._id)));
  const uniqueSupplierCombos = ImmSet(supplierCombos);
  return uniqueSupplierCombos.size === 1;
};

const i007 = createIndicator('i007', testFunction, {
  shortDesc: 'This competitive tender featured a single bidder only',
  docs: fs.readFileSync(path.join(__dirname, 'i007.md')).toString(),
  preconditions: [ hasAward, isOpen ],
  requiredOCDSFields: [ 'tender.procurementMethod' ],
  requiredCustomFields: [ 'awards.suppliers._id' ]
});

module.exports = i007;
