'use strict';

module.exports = {
  async up(queryInterface) {
    return await queryInterface.bulkInsert('clusters', [
      { name: 'HPCC Dev', host: 'http://10.173.147.1', infoPort: 8010, dataPort: 8002 },
      {
        name: 'HPCC Playground',
        host: 'http://play.hpccsystems.com',
        infoPort: 8010,
        dataPort: 8002,
      },
    ]);
  },
  async down(queryInterface) {
    return await queryInterface.bulkDelete('clusters', {});
  },
};
