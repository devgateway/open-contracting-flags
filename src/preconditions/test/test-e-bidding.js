const test = require('tape');
const eBidding = require('../e-bidding.js');

test('eBidding should return false for a contract with no submissionMethod', assert => {
  assert.plan(1);
  const release = { tender: { submissionMethod: [] } };
  assert.strictEqual(eBidding(release), false);
});

test('eBidding should return false for a contract with a the wrong submissionMethod', assert => {
  assert.plan(1);
  const release = { tender: { submissionMethod: [ 'written' ] } };
  assert.strictEqual(eBidding(release), false);
});

test('eBidding should return true for a contract with electronic submission', assert => {
  assert.plan(1);
  const release = { tender: { submissionMethod: [ 'electronicSubmission' ] } };
  assert.strictEqual(eBidding(release), true);
});

test('eBidding should return true for a contract with electronic and written submission', assert => {
  assert.plan(1);
  const release = { tender: { submissionMethod: [ 'electronicSubmission', 'written' ] } };
  assert.strictEqual(eBidding(release), true);
});
