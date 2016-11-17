const test = require('tape');
const hasMultipleSuppliers = require('../has-multiple-suppliers.js');

test('hasMultipleSuppliers returns false for a release with one supplier', assert => {
  assert.plan(1);
  const release = {
    ocid: 'foo',
    awards: [
      { suppliers: [ { _id: 'supplierOne' } ] }
    ]
  };
  assert.strictEqual(hasMultipleSuppliers(release), false);
});

test('hasMultipleSuppliers returns false for a release with one repeated supplier', assert => {
  assert.plan(1);
  const release = {
    ocid: 'foo',
    awards: [
      { suppliers: [ { _id: 'supplierOne' } ] },
      { suppliers: [ { _id: 'supplierOne' } ] }
    ]
  };
  assert.strictEqual(hasMultipleSuppliers(release), false);
});

test('hasMultipleSuppliers returns true for a release with multiple suppliers', assert => {
  assert.plan(1);
  const release = {
    ocid: 'foo',
    awards: [
      { suppliers: [ { _id: 'supplierOne' } ] },
      { suppliers: [ { _id: 'supplierTwo' } ] }
    ]
  };
  assert.strictEqual(hasMultipleSuppliers(release), true);
});
