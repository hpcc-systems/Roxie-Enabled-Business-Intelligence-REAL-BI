'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert('clusters', [
      { id: uuidv4(), name: 'Cluster Name', host: 'http://0.0.0.0', infoPort: 8010, dataPort: 8002 },
    ]);
  },

  down: (queryInterface, { Op }) => {
    return queryInterface.bulkDelete(
      'clusters',
      {
        host: { [Op.in]: ['http://0.0.0.0'] },
      },
      {},
    );
  },
};
