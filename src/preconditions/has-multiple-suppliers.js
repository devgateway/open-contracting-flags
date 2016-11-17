const {
  createPrecondition,
  getSupplierIds
} = require('../util');

const description = 'More than one supplier must have bid on the tender (cooperatively or competitively)';

const testFunction = release => getSupplierIds(release).length > 1;

const precondition = createPrecondition('Has Multiple Suppliers', testFunction, { description });

module.exports = precondition;
