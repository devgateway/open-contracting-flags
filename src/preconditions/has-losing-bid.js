const { createPrecondition } = require('../util');

const description = 'The release must have at least one losing bid';

const testFunction = release =>
  release.awards.reduce(
    (result, award) => award.status === 'unsuccessful' ? true : result,
    false
  );

const precondition = createPrecondition('Has Unsuccessful Award', testFunction, { description });

module.exports = precondition;
