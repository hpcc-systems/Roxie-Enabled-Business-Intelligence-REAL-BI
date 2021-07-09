'use strict';
const { tableNames } = require('../constants');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.addColumn(tableNames.dashboard, 'layout', Sequelize.TEXT('long'));
  },

  down: async queryInterface => {
    return await queryInterface.removeColumn(tableNames.dashboard, 'layout');
  },
};
