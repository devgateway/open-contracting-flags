const fs = require('fs');
const path = require('path');
const Immutable = require('immutable');
const { createCollectionIndicator } = require('../util');
const { hasAward, hasLosingBid, isOpen } = require('../preconditions');

const testFunction = collection => {

  // create a hashmap where keys are winner/loser combos and values are matching contract IDs
  const hashed = collection.reduce(
    (hash, release) => {

      const winners = release.awards
        .filter(a => a.status === 'active')
        .map(a => a.suppliers)
        .reduce((all, forAward) => all.concat(forAward), [])
        .map(s => s._id);

      const losers = release.awards
        .filter(a => a.status === 'unsuccessful')
        .map(a => a.suppliers)
        .reduce((all, forAward) => all.concat(forAward), [])
        .map(s => s._id);

      const key = Immutable.Map({
        winners: Immutable.Set(winners),
        losers: Immutable.Set(losers)
      });

      return hash.update(key, ocidSet => ocidSet ? ocidSet.add(release.ocid) : Immutable.Set([ release.ocid ]));

    },
    Immutable.Map()
  );

  // flag any ocid where its exact winner/loser combo matches more than one contract
  const result = {};
  hashed.forEach(ocidSet => {
    ocidSet.forEach(ocid => {
      result[ocid] = ocidSet.size > 1;
    });
  });

  return result;

};

const i083 = createCollectionIndicator('i083', testFunction, {
  shortDesc: 'The same companies always bid, the same companies always win and the same companies always lose',
  docs: fs.readFileSync(path.join(__dirname, 'i083.md')).toString(),
  requiredOCDSFields: [
    'ocid',
    'awards.status'
  ],
  requiredCustomFields: [
    'awards.suppliers._id'
  ],
  filters: [ hasAward, hasLosingBid, isOpen ]
});

module.exports = i083;
