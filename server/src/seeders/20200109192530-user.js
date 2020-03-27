'use strict';

module.exports = {
  async up(queryInterface) {
    return await queryInterface.bulkInsert('users', [
      { firstName: 'Chris', lastName: 'Human', directory: '[]' },
    ]);
  },
  async down(queryInterface) {
    return await queryInterface.bulkDelete('users', {});
  },
};
