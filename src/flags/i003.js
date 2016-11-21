const path = require('path');
const fs = require('fs');
const { createIndicator } = require('../util');
const { hasAward, hasLosingBid, isOpen } = require('../preconditions');

const testFunction = release => {

  const { awards } = release;

  const losersIneligible = awards
    .filter(a => a.status !== 'active')
    .reduce((ineligible, a) => a.inelibigleYN === 'N' ? false : ineligible, true);

  return losersIneligible;

};

const i003 = createIndicator('i003', testFunction, {
  shortDesc: 'Only winning bidder was eligible',
  docs: fs.readFileSync(path.join(__dirname, 'i003.md')).toString(),
  preconditions: [
    hasAward,
    hasLosingBid,
    isOpen
  ],
  requiredOCDSFields: [
    'tender.procurementMethod',
    'awards.status'
  ],
  requiredCustomFields: [ 'awards.inelibigleYN' ]
});

module.exports = i003;
