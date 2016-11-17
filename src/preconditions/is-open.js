const { createPrecondition } = require('../util');

const description = 'The release\'s tender must use the "open" procurement method';

const testFunction = release =>
  // see: http://standard.open-contracting.org/latest/en/schema/codelists/#method
  release.tender.procurementMethod === 'open';

const precondition = createPrecondition('Is Open', testFunction, { description });

module.exports = precondition;
