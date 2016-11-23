const fs = require('fs');
const path = require('path');
const { createIndicator } = require('../util');
const { hasAward, isLimited, knownClassification } = require('../preconditions');

const testFunction = (release, options) => {

  const { soleSourceLimits } = options;
  const { awards, tender: { items } } = release;

  const classificationId = items[0].classification._id;
  const limit = soleSourceLimits[classificationId];

  for (let i = 0; i < awards.length; i++) {
    let { value: { amount }, status } = awards[i];
    if (status === 'active' && amount > limit) {
      return true;
    }
  }
  return false;

};

const i004 = createIndicator('i004', testFunction, {
  shortDesc: 'Sole source award above the threshold',
  docs: fs.readFileSync(path.join(__dirname, 'i004.md')).toString(),
  requiredOCDSFields: [
    'awards.status',
    'tender.procurementMethod',
    'awards.value.amount'
  ],
  requiredCustomFields: [
    'tender.items.classification._id'
  ],
  preconditions: [ isLimited, hasAward, knownClassification ]
});

module.exports = i004;
