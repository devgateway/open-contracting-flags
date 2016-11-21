// The same companies always bid, the same companies always win and the same companies always lose

const test = require('tape');
const i083 = require('../i083.js');

test('i083 should return false for no pattern of collusion', assert => {
  assert.plan(1);
  const collection = [
    {
      ocid: 'releaseOne',
      tender: { submissionMethod: [ 'electronicSubmission' ], procurementMethod: 'open' },
      awards: [
        { status: 'active', suppliers: [ { _id: 'supplierOne' } ] },
        { status: 'unsuccessful', suppliers: [ { _id: 'supplierTwo' } ] }
      ]
    },
    {
      ocid: 'releaseTwo',
      tender: { submissionMethod: [ 'electronicSubmission' ], procurementMethod: 'open' },
      awards: [
        { status: 'active', suppliers: [ { _id: 'supplierOne' } ] },
        { status: 'unsuccessful', suppliers: [ { _id: 'supplierThree' } ] }
      ]
    },
    {
      ocid: 'releaseThree',
      tender: { procurementMethod: 'open' },
      awards: []
    }
  ];
  const expectedResult = {
    releaseOne: false,
    releaseTwo: false
  };
  const result = i083(collection);
  assert.deepEqual(result, expectedResult);
});

test('i083 should flag patterns of collusion', assert => {
  assert.plan(1);
  const collection = [
    {
      ocid: 'releaseOne',
      tender: { submissionMethod: [ 'electronicSubmission' ], procurementMethod: 'open' },
      awards: [
        { status: 'active', suppliers: [ { _id: 'supplierOne' } ] },
        { status: 'unsuccessful', suppliers: [ { _id: 'supplierTwo' } ] }
      ]
    },
    {
      ocid: 'releaseTwo',
      tender: { submissionMethod: [ 'electronicSubmission' ], procurementMethod: 'open' },
      awards: [
        { status: 'active', suppliers: [ { _id: 'supplierOne' } ] },
        { status: 'unsuccessful', suppliers: [ { _id: 'supplierTwo' } ] }
      ]
    },
    {
      ocid: 'releaseThree',
      tender: { submissionMethod: [ 'electronicSubmission' ], procurementMethod: 'open' },
      awards: [
        { status: 'active', suppliers: [ { _id: 'supplierThree' } ] },
        { status: 'unsuccessful', suppliers: [ { _id: 'supplierOne' } ] }
      ]
    }
  ];
  const expectedResult = {
    releaseOne: true,
    releaseTwo: true,
    releaseThree: false
  };
  const result = i083(collection);
  assert.deepEqual(result, expectedResult);
});

