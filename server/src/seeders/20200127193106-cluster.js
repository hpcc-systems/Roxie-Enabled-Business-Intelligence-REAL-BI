'use strict';

module.exports = {
  async up(queryInterface) {
    return await queryInterface.bulkInsert('clusters', [
      { name: 'Dev Cluster', host: 'http://10.173.147.1', port: 8010 },
    ]);
  },
  async down(queryInterface) {
    return await queryInterface.bulkDelete('clusters', {});
  },
};
