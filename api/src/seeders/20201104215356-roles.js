'use strict';

const { v4: uuidv4 } = require('uuid');

// Constants
const { tableNames } = require('../constants');

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(tableNames.role, [
      { id: uuidv4(), name: 'Owner', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Read-Only', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  down: (queryInterface, { Op }) => {
    return queryInterface.bulkDelete(
      tableNames.role,
      {
        name: {
          [Op.in]: ['Owner', 'Read-Only'],
        },
      },
      {},
    );
  },
};
