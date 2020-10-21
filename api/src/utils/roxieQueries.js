/*
  Utility file containing functions pertaining to ROXIE Queries
*/

const moment = require('moment');

module.exports = {
  createQueryLastModifiedDate: () => {
    const datetime = moment()
      .utc()
      .format('L HH:mm:ss');

    // Return last modified date;
    return `${datetime} UTC`;
  },
};
