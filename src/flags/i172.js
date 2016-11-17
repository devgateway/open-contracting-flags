const fs = require('fs');
const path = require('path');
const { Map: ImmMap, Set: ImmSet } = require('immutable');
const {
  createCollectionIndicator,
  getSupplierIds
} = require('../util');
const {
  hasAward,
  isOpen,
  hasMultipleSuppliers
} = require('../preconditions');

const testFunction = collection => {

  const ocids = collection.map(release => release.ocid);
  const result = {};

  const supplierMap = collection.reduce((hashed, release) => {
    const supplierIds = ImmSet(getSupplierIds(release));
    return hashed.update(supplierIds, releaseIds => releaseIds ? releaseIds.add(release.ocid) : ImmSet([ release.ocid ]));
  }, ImmMap());

  supplierMap.forEach(ocidSet => {
    if (ocidSet.size > 1) {
      ocidSet.forEach(ocid => {
        result[ocid] = true;
      });
    }
  });

  ocids.forEach(ocid => {
    result[ocid] = result[ocid] || false;
  });

  return result;

};

const i172 = createCollectionIndicator('i172', testFunction, {
  shortDesc: 'Bidders sometimes bid together and sometimes against one another in groups of common suppliers',
  docs: fs.readFileSync(path.join(__dirname, 'i172.md')).toString(),
  requiredOCDSFields: [
    'ocid',
    'tender.procurementMethod'
  ],
  requiredCustomFields: [
    'awards.suppliers._id'
  ],
  filters: [
    hasAward,
    isOpen,
    hasMultipleSuppliers
  ]
});

module.exports = i172;
