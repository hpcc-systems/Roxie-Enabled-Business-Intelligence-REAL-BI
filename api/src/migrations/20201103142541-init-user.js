'use strict';

// Constants
const { tableNames } = require('../constants');

// Utils
const { createTablePK, createString, createDateTimeStamps, createFKField } = require('../utils/sequelize');

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable(tableNames.user, {
      id: createTablePK(DataTypes),
      email: {
        ...createString(DataTypes, 254),
        unique: true,
      },
      username: createString(DataTypes, 255, true),
      lastViewedWorkspace: createFKField(DataTypes, true),
      ...createDateTimeStamps(DataTypes),
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable(tableNames.user);
  },
};
