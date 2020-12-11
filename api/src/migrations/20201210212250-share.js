'use strict';

// Constants
const { tableNames } = require('../constants');

// Utils
const {
  createTablePK,
  createString,
  createDateTimeStamps,
  createForeignKeyConstraint,
  createJsonObject,
  createJsonArray,
  createFKField,
} = require('../utils/sequelize');

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable(tableNames.share, {
      id: createTablePK(DataTypes),
      email: createString(DataTypes, 254),
      directory: createJsonObject(DataTypes),
      dashboards: createJsonArray(DataTypes),
      userID: createFKField(DataTypes),
      workspaceID: createFKField(DataTypes),
      ...createDateTimeStamps(DataTypes),
    });

    // Create foreign key indexes
    await queryInterface.addConstraint(
      tableNames.share,
      createForeignKeyConstraint(tableNames.share, tableNames.user, ['userID']),
    );
    await queryInterface.addConstraint(
      tableNames.share,
      createForeignKeyConstraint(tableNames.share, tableNames.workspace, ['workspaceID']),
    );
  },

  down: async queryInterface => {
    await queryInterface.dropTable(tableNames.share);
  },
};
