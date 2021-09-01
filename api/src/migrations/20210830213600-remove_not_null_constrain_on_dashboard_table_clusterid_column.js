'use strict';
const { tableNames } = require('../constants');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(tableNames.dashboard, 'clusterID', {
      type: Sequelize.UUID,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(tableNames.dashboard, 'clusterID', {
      type: Sequelize.UUID,
      allowNull: false,
    });
  },
};
