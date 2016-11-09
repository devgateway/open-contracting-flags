const fs = require('fs');
const path = require('path');
const { createIndicator, pricesExactlyDifferent } = require('../util');
const { hasAward } = require('../preconditions');

const testFunction = release => {

  let flagged = false;

  const activeAwards = release.awards
    .filter(a => a.status === 'active')
    .map(a => a.value);

  const inactiveAwards = release.awards
    .filter(a => a.status !== 'active')
    .map(a => a.value);

  inactiveAwards.forEach(inactiveAward => {
    activeAwards.forEach(activeAward => {
      if (inactiveAward.currency !== activeAward.currency) {
        throw new Error('Trying to compare bid amounts which are not in the same currency');
      } else if (pricesExactlyDifferent(inactiveAward.amount, activeAward.amount)) {
        flagged = true;
      }
    });
  });

  return flagged;

};

const i085 = createIndicator('i085', testFunction, {
  shortDesc: 'Bids are an exact percentage apart',
  docs: fs.readFileSync(path.join(__dirname, 'i085.md')).toString(),
  preconditions: [ hasAward ],
  requiredOCDSFields: [
    'awards.status',
    'awards.value.amount',
    'awards.value.currency'
  ],
  requiredOtherFields: []
});

module.exports = i085;
