const fs = require('fs');
const path = require('path');
const { createIndicator } = require('../util');
const { hasAward, isOpen } = require('../preconditions');

const testFunction = (release, options) => {

  let flagged = false;

  const { awards, tender } = release;
  const { threshold } = options;
  const { value: estimatedPrice } = tender;

  const activeAwards = awards
    .filter(a => a.status === 'active')
    .map(a => a.value);

  activeAwards.forEach(award => {
    if (estimatedPrice.currency !== award.currency) {
      throw new Error('Trying to compare estimated price and winning bid w/ different currencies');
    }
    const percentDiff = Math.abs((estimatedPrice.amount - award.amount) / estimatedPrice.amount);
    if (percentDiff <= threshold) {
      flagged = true;
    }
  });

  return flagged;

};

const i171 = createIndicator('i171', testFunction, {
  shortDesc: 'Bid is too close to budget, estimate or preferred solution',
  docs: fs.readFileSync(path.join(__dirname, 'i171.md')).toString(),
  preconditions: [ hasAward, isOpen ],
  requiredOCDSFields: [
    'awards.status',
    'awards.value.amount',
    'awards.value.currency',
    'tender.procurementMethod',
    'tender.value.amount',
    'tender.value.currency'
  ],
  requiredOtherFields: []
});

module.exports = i171;
