const test = require('tape');
const knownClassification = require('../known-classification.js');

test('knownClassification returns false for a release without a known classification', assert => {
  assert.plan(1);
  const release = { tender: { items: [ { classification: { _id: 732 } } ] } };
  assert.strictEqual(knownClassification(release), false);
});

test('knownClassification returns true for a release with a known classification', assert => {
  assert.plan(1);
  const release = { tender: { items: [ { classification: { _id: 1 } } ] } };
  assert.strictEqual(knownClassification(release), true);
});

test('knownClassification returns true for a release with the same known classification repeated', assert => {
  assert.plan(1);
  const release = {
    tender: {
      items: [
        { classification: { _id: 1 } },
        { classification: { _id: 1 } }
      ]
    }
  };
  assert.strictEqual(knownClassification(release), true);
});

test('knownClassification throws for a release with different classifications', assert => {
  assert.plan(1);
  const release = {
    tender: {
      items: [
        { classification: { _id: 1 } },
        { classification: { _id: 2 } }
      ]
    }
  };
  assert.throws(() => {
    knownClassification(release);
  });
});
