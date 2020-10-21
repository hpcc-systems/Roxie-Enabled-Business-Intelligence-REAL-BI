/*
  Utility file containing functions pertaining to ECL Scripts
*/

const moment = require('moment');

module.exports = {
  createEclScriptLastModifiedDate: () => {
    const datetime = moment()
      .utc()
      .format('L HH:mm:ss');

    // Return last modified date;
    return `${datetime} UTC`;
  },
};
