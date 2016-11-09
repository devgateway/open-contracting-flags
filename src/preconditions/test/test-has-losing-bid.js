const test = require('tape');
const hasLosingBid = require('../has-losing-bid.js');

test('hasAward should return false for a release with no awards', assert => {
  assert.plan(1);
  const release = { awards: [] };
  assert.strictEqual(hasLosingBid(release), false);
});

test('hasAward should return false when there is only an active award', assert => {
  assert.plan(1);
  const release = { awards: [ { id: 1, status: 'active' } ] };
  assert.strictEqual(hasLosingBid(release), false);
});

test('hasAward should return true when there is an unsuccessful bid', assert => {
  assert.plan(1);
  const release = { awards: [ { id: 1, status: 'unsuccessful' } ] };
  assert.strictEqual(hasLosingBid(release), true);
});
