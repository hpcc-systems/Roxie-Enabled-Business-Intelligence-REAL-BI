'use strict';

// Constants
const { tableNames } = require('../constants');

// Utils
const {
  createTablePK,
  createFKField,
  createDateTimeStamps,
  createForeignKeyConstraint,
  createUniqueConstraint,
  createJsonArray,
} = require('../utils/sequelize');

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable(tableNames.workspaceDirectory, {
      id: createTablePK(DataTypes),
      directory: createJsonArray(DataTypes),
      userID: createFKField(DataTypes),
      workspaceID: createFKField(DataTypes),
      ...createDateTimeStamps(DataTypes),
    });

    // Create foreign key indexes
    await queryInterface.addConstraint(
      tableNames.workspaceDirectory,
      createForeignKeyConstraint(tableNames.workspaceDirectory, tableNames.user, ['userID']),
    );
    await queryInterface.addConstraint(
      tableNames.workspaceDirectory,
      createForeignKeyConstraint(tableNames.workspaceDirectory, tableNames.workspace, ['workspaceID']),
    );

    // Create unique composite index
    await queryInterface.addConstraint(
      tableNames.workspaceDirectory,
      createUniqueConstraint(tableNames.workspaceDirectory, ['userID', 'workspaceID']),
    );
  },

  down: async queryInterface => {
    await queryInterface.dropTable(tableNames.workspaceDirectory);
  },
};
