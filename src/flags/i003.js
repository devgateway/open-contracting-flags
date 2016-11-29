const path = require('path');
const fs = require('fs');
const { createIndicator } = require('../util');
const { eBidding, hasAward, hasLosingBid, isOpen } = require('../preconditions');

const testFunction = release => {

  const { awards } = release;

  const losersIneligible = awards
    .filter(a => a.status !== 'active')
    .reduce((ineligible, a) => a.inelibigleYN === 'N' ? false : ineligible, true);

  return losersIneligible;

};

const i003 = createIndicator('i003', testFunction, {
  shortDesc: 'Only winning bidder was eligible for a tender with multiple bidders',
  docs: fs.readFileSync(path.join(__dirname, 'i003.md')).toString(),
  preconditions: [
    eBidding,
    hasAward,
    hasLosingBid,
    isOpen
  ],
  requiredOCDSFields: [
    'tender.procurementMethod',
    'tender.submissionMethod',
    'awards.status'
  ],
  requiredCustomFields: [ 'awards.inelibigleYN' ]
});

module.exports = i003;
