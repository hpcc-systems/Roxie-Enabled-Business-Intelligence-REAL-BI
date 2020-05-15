'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface) {
    return await queryInterface.bulkInsert('users', [
      { id: uuidv4(), firstName: 'Chris', lastName: 'Human', directory: '[]', directoryDepth: '[]' },
    ]);
  },
  async down(queryInterface) {
    return await queryInterface.bulkDelete('users', {});
  },
};
