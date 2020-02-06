'use strict';

module.exports = {
  async up(queryInterface) {
    return await queryInterface.bulkInsert('clusters', [
      { name: 'Dev Cluster', host: 'http://10.173.147.1', infoPort: 8010, dataPort: 8002 },
    ]);
  },
  async down(queryInterface) {
    return await queryInterface.bulkDelete('clusters', {});
  },
};
