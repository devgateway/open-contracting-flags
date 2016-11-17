const path = require('path');
const fs = require('fs');
const { createIndicator } = require('../util');
const { isOpen } = require('../preconditions');

const testFunction = (release, options) => {
  const { threshold } = options;
  const { tender: { tenderPeriod: { startDate, endDate } } } = release;
  const daysBetween = (endDate.getTime() - startDate.getTime()) / (24 * 3600 * 1000);
  return daysBetween < threshold;
};

const i038 = createIndicator('i038', testFunction, {
  shortDesc: 'Allowing an unreasonable short time to respond to requests',
  docs: fs.readFileSync(path.join(__dirname, 'i038.md')).toString(),
  preconditions: [ isOpen ],
  requiredOCDSFields: [
    'tender.tenderPeriod.startDate',
    'tender.tenderPeriod.endDate'
  ],
  requiredCustomFields: []
});

module.exports = i038;
