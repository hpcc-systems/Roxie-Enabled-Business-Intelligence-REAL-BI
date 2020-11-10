'use strict';

// Constants
const { tableNames } = require('../constants');

// Utils
const { createTablePK, createString, createDateTimeStamps } = require('../utils/sequelize');

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable(tableNames.workspace, {
      id: createTablePK(DataTypes),
      name: createString(DataTypes, 100),
      ...createDateTimeStamps(DataTypes),
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable(tableNames.workspace);
  },
};
