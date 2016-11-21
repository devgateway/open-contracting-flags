const fs = require('fs');
const path = require('path');
const { createIndicator } = require('../util');
const { eBidding, hasAward, isOpen } = require('../preconditions');

const testFunction = release => release.awards.length === 1;

const i007 = createIndicator('i007', testFunction, {
  shortDesc: 'This awarded competitive tender only featured a single bidder',
  docs: fs.readFileSync(path.join(__dirname, 'i007.md')).toString(),
  preconditions: [ eBidding, hasAward, isOpen ],
  requiredOCDSFields: [ 'tender.procurementMethod', 'tender.submissionMethod' ],
  requiredCustomFields: [ 'awards.suppliers._id' ]
});

module.exports = i007;
