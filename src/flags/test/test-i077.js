const test = require('tape');
const moment = require('moment');
const i077 = require('../i077.js');

test('i077 returns false for awards w/ suppliers below the contract limit', assert => {
  assert.plan(1);
  const collection = [
    {
      ocid: 'releaseOne',
      tender: { procuringEntity: { identifier: { _id: 'peOne' } } },
      awards: [ { status: 'active', date: moment('2015-01-01').toDate(), suppliers: [ { _id: 'supplierOne' } ] } ]
    },
    {
      ocid: 'releaseTwo',
      tender: { procuringEntity: { identifier: { _id: 'peOne' } } },
      awards: [ { status: 'active', date: moment('2015-01-01').toDate(), suppliers: [ { _id: 'supplierTwo' } ] } ]
    }
  ];
  const expectedResult = { releaseOne: false, releaseTwo: false };
  const result = i077(collection, { timePeriod: 365, maxAwards: 2 });
  assert.deepEqual(result, expectedResult);
});

test('i077 returns true for awards w/ suppliers above the contract limit during the time period', assert => {
  assert.plan(1);
  const collection = [
    {
      ocid: 'releaseOne',
      tender: { procuringEntity: { identifier: { _id: 'peOne' } } },
      awards: [ { status: 'active', date: moment('2015-01-01').toDate(), suppliers: [ { _id: 'supplierOne' } ] } ]
    },
    {
      ocid: 'releaseTwo',
      tender: { procuringEntity: { identifier: { _id: 'peOne' } } },
      awards: [ { status: 'active', date: moment('2015-02-01').toDate(), suppliers: [ { _id: 'supplierOne' } ] } ]
    },
    {
      ocid: 'releaseThree',
      tender: { procuringEntity: { identifier: { _id: 'peOne' } } },
      awards: [ { status: 'active', date: moment('2015-01-17').toDate(), suppliers: [ { _id: 'supplierTwo' } ] } ]
    },
    {
      ocid: 'releaseFour',
      tender: { procuringEntity: { identifier: { _id: 'peOne' } } },
      awards: [ { status: 'active', date: moment('2015-06-29').toDate(), suppliers: [ { _id: 'supplierOne' } ] } ]
    }
  ];
  const expectedResult = {
    releaseOne: true,
    releaseTwo: true,
    releaseThree: false,
    releaseFour: true
  };
  const result = i077(collection, { timePeriod: 365, maxAwards: 2 });
  assert.deepEqual(result, expectedResult);
});

test('i077 returns false for awards w/ suppliers above the contract limit but outside of the time period', assert => {
  assert.plan(1);
  const collection = [
    {
      ocid: 'releaseOne',
      tender: { procuringEntity: { identifier: { _id: 'peOne' } } },
      awards: [ { status: 'active', date: moment('2015-01-01').toDate(), suppliers: [ { _id: 'supplierOne' } ] } ]
    },
    {
      ocid: 'releaseTwo',
      tender: { procuringEntity: { identifier: { _id: 'peOne' } } },
      awards: [ { status: 'active', date: moment('2015-01-01').add(366, 'days').toDate(), suppliers: [ { _id: 'supplierOne' } ] } ]
    },
    {
      ocid: 'releaseThree',
      tender: { procuringEntity: { identifier: { _id: 'peOne' } } },
      awards: [ { status: 'active', date: moment('2015-01-17').toDate(), suppliers: [ { _id: 'supplierTwo' } ] } ]
    },
    {
      ocid: 'releaseFour',
      tender: { procuringEntity: { identifier: { _id: 'peOne' } } },
      awards: [ { status: 'active', date: moment('2015-06-29').toDate(), suppliers: [ { _id: 'supplierOne' } ] } ]
    }
  ];
  const expectedResult = {
    releaseOne: false,
    releaseTwo: false,
    releaseThree: false,
    releaseFour: false
  };
  const result = i077(collection, { timePeriod: 365, maxAwards: 2 });
  assert.deepEqual(result, expectedResult);
});

test('i077 returns false for awards w/ suppliers above the contract limit during the time period if differnet PEs', assert => {
  assert.plan(1);
  const collection = [
    {
      ocid: 'releaseOne',
      tender: { procuringEntity: { identifier: { _id: 'peOne' } } },
      awards: [ { status: 'active', date: moment('2015-01-01').toDate(), suppliers: [ { _id: 'supplierOne' } ] } ]
    },
    {
      ocid: 'releaseTwo',
      tender: { procuringEntity: { identifier: { _id: 'peTwo' } } },
      awards: [ { status: 'active', date: moment('2015-02-01').toDate(), suppliers: [ { _id: 'supplierOne' } ] } ]
    },
    {
      ocid: 'releaseThree',
      tender: { procuringEntity: { identifier: { _id: 'peOne' } } },
      awards: [ { status: 'active', date: moment('2015-01-17').toDate(), suppliers: [ { _id: 'supplierTwo' } ] } ]
    },
    {
      ocid: 'releaseFour',
      tender: { procuringEntity: { identifier: { _id: 'peOne' } } },
      awards: [ { status: 'active', date: moment('2015-06-29').toDate(), suppliers: [ { _id: 'supplierOne' } ] } ]
    }
  ];
  const expectedResult = {
    releaseOne: false,
    releaseTwo: false,
    releaseThree: false,
    releaseFour: false
  };
  const result = i077(collection, { timePeriod: 365, maxAwards: 2 });
  assert.deepEqual(result, expectedResult);
});
