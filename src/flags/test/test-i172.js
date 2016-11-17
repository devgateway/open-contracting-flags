const test = require('tape');
const i172 = require('../i172.js');

test('i172 returns false when no pattern of repeated suppliers exists', assert => {
  assert.plan(1);
  const collection = [
    {
      ocid: 'releaseOne',
      tender: { procurementMethod: 'open' },
      awards: [
        { status: 'active', suppliers: [ { _id: 'supplierOne' } ] },
        { status: 'unsuccessful', suppliers: [ { _id: 'supplierTwo' } ] }
      ]
    },
    {
      ocid: 'releaseTwo',
      tender: { procurementMethod: 'open' },
      awards: [
        { status: 'active', suppliers: [ { _id: 'supplierOne' } ] },
        { status: 'unsuccessful', suppliers: [ { _id: 'supplierThree' } ] }
      ]
    }
  ];
  const expectedResult = { releaseOne: false, releaseTwo: false };
  const result = i172(collection);
  assert.deepEqual(result, expectedResult);
});

test('i172 flags suppliers appearing repeatedly in bids', assert => {
  assert.plan(1);
  const collection = [
    {
      ocid: 'releaseOne',
      tender: { procurementMethod: 'open' },
      awards: [
        { status: 'active', suppliers: [ { _id: 'supplierOne' } ] },
        { status: 'unsuccessful', suppliers: [ { _id: 'supplierTwo' } ] }
      ]
    },
    {
      ocid: 'releaseTwo',
      tender: { procurementMethod: 'open' },
      awards: [
        { status: 'active', suppliers: [ { _id: 'supplierTwo' } ] },
        { status: 'unsuccessful', suppliers: [ { _id: 'supplierOne' } ] }
      ]
    },
    {
      ocid: 'releaseThree',
      tender: { procurementMethod: 'open' },
      awards: [
        { status: 'active', suppliers: [ { _id: 'supplierOne' } ] },
        { status: 'unsuccessful', suppliers: [ { _id: 'supplierThree' } ] }
      ]
    }
  ];
  const expectedResult = {
    releaseOne: true,
    releaseTwo: true,
    releaseThree: false
  };
  const result = i172(collection);
  assert.deepEqual(result, expectedResult);
});

