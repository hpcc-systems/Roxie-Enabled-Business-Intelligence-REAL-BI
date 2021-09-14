'use strict';

const { v4: uuidv4 } = require('uuid');

// Constants
const { tableNames } = require('../constants');

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(tableNames.cluster, [
      {
        id: uuidv4(),
        name: 'hpccDemoCluster',
        host: 'http://13.77.97.16',
        infoPort: 8010,
        dataPort: 8002,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: (queryInterface, { Op }) => {
    return queryInterface.bulkDelete(
      tableNames.cluster,
      {
        host: { [Op.in]: ['http://13.77.97.16'] },
      },
      {},
    );
  },
};
