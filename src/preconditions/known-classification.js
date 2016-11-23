const { createPrecondition } = require('../util');

const KNOWN_CLASSIFICATIONS = [1, 3, 5, 10];

const description = 'The release\'s award is of a bid type that we know the sole source limit for';

const testFunction = release => {
  const { tender: { items } } = release;
  const classifications = items.map(item => item.classification._id);
  const unique = classifications.filter((c, i) => classifications.indexOf(c) === i);
  if (unique.length !== 1) {
    throw new Error(`Release with ${unique.length} unique classifications passed to Known Classification precondition`);
  }
  const classification = Number(unique[0]);
  return KNOWN_CLASSIFICATIONS.indexOf(classification) > -1;
};

const precondition = createPrecondition('Known Classification', testFunction, { description });

module.exports = precondition;
