// I004: Multiple sole source awards above or just below the sole source threshold

const test = require('tape');
const i004 = require('../i004.js');

test('i004 should return false for an award below the sole-source threshold', assert => {
  assert.plan(1);
  const release = {
    tender: {
      procurementMethod: 'limited',
      items: [ { classification: { _id: 1 } } ]
    },
    awards: [ { status: 'active', value: { amount: 10 } } ]
  };
  const result = i004(release, { soleSourceLimits: { 1: 15 } });
  assert.strictEqual(result, false);
});

test('i004 should return true for an award above the sole-source threshold', assert => {
  assert.plan(1);
  const release = {
    tender: {
      procurementMethod: 'limited',
      items: [ { classification: { _id: 1 } } ]
    },
    awards: [ { status: 'active', value: { amount: 20 } } ]
  };
  const result = i004(release, { soleSourceLimits: { 1: 15 } });
  assert.strictEqual(result, true);
});
