'use strict';

const { v4: uuidv4 } = require('uuid');

// Constants
const { tableNames } = require('../constants');

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(tableNames.cluster, [
      {
        id: uuidv4(),
        name: 'cluster name',
        host: 'https://clusterhost',
        infoPort: 18010,
        dataPort: 18002,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: (queryInterface, { Op }) => {
    return queryInterface.bulkDelete(
      tableNames.cluster,
      {
        host: { [Op.in]: ['https://clusterhost'] },
      },
      {},
    );
  },
};
