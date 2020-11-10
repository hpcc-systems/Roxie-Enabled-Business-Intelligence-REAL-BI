'use strict';

const { v4: uuidv4 } = require('uuid');

// Constants
const { tableNames } = require('../constants');

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(tableNames.sourceType, [
      { id: uuidv4(), name: 'query', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'file', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'ecl', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  down: (queryInterface, { Op }) => {
    return queryInterface.bulkDelete(
      tableNames.sourceType,
      {
        name: {
          [Op.in]: ['query', 'file', 'ecl'],
        },
      },
      {},
    );
  },
};
