const { createPrecondition } = require('../util');

const description = 'The release must have permitted electronic submission';

const testFunction = release => release.tender.submissionMethod.indexOf('electronicSubmission') > -1;

const precondition = createPrecondition('Electronic Submission (OCVN-Specific)', testFunction, { description });

module.exports = precondition;
