'use strict';

module.exports = {
  async up(queryInterface) {
    return await queryInterface.bulkInsert('clusterAuth', [
      { clusterID: 1, userID: 1, username: null, hash: null },
    ]);
  },
  async down(queryInterface) {
    return await queryInterface.bulkDelete('clusterAuth', {});
  },
};
