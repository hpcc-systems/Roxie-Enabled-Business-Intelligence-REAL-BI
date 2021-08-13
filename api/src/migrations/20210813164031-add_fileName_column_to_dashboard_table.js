'use strict';
const { tableNames } = require('../constants');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.addColumn(tableNames.dashboard, 'fileName', Sequelize.STRING(100), {
      allowNull: true,
    });
  },

  down: async queryInterface => {
    return await queryInterface.removeColumn(tableNames.dashboard, 'fileName');
  },