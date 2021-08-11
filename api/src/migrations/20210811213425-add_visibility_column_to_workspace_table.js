'use strict';
const { tableNames } = require('../constants');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.addColumn(tableNames.workspace, 'visibility', Sequelize.STRING(45), {
      defaultValue: 'private',
      allowNull: false,
    });
  },

  down: async queryInterface => {
    return await queryInterface.removeColumn(tableNames.workspace, 'visibility');
  },
};
