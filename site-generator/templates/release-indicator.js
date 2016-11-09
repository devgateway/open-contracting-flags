/* eslint-disable */

const marked = require('marked');
const requiredFields = require('./required-fields.js');

const template = details => `
  <div class="indicator release-indicator">
    <h3>${details.id}</h3>
    <p>${details.shortDesc || '<i>no description</i>'}</p>
    ${requiredFields({ ocds: true, fields: details.requiredOCDSFields })}
    ${requiredFields({ ocds: false, fields: details.requiredCustomFields })}
    <h4>Preconditions</h4>
    <ul class="preconditions">
      ${details.preconditions.length > 0 ? 
        details.preconditions.map(({ name }) => `<li>${name}</li>`) : 
        'None'
      }
    </ul>
    ${details.docs && marked(details.docs) || ''}
  </div>
`;

module.exports = template;
