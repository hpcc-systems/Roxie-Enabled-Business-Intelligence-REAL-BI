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
} = require('../utils/sequelize');

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable(tableNames.workspacePermission, {
      id: createTablePK(DataTypes),
      userID: createFKField(DataTypes),
      workspaceID: createFKField(DataTypes),
      roleID: createFKField(DataTypes),
      ...createDateTimeStamps(DataTypes),
    });

    // Create foreign key indexes
    await queryInterface.addConstraint(
      tableNames.workspacePermission,
      createForeignKeyConstraint(tableNames.workspacePermission, tableNames.user, ['userID']),
    );
    await queryInterface.addConstraint(
      tableNames.workspacePermission,
      createForeignKeyConstraint(tableNames.workspacePermission, tableNames.workspace, ['workspaceID']),
    );
    await queryInterface.addConstraint(
      tableNames.workspacePermission,
      createForeignKeyConstraint(tableNames.workspacePermission, tableNames.role, ['roleID']),
    );

    // Create unique composite index
    await queryInterface.addConstraint(
      tableNames.workspacePermission,
      createUniqueConstraint(tableNames.workspacePermission, ['userID', 'workspaceID']),
    );
  },

  down: async queryInterface => {
    await queryInterface.dropTable(tableNames.workspacePermission);
  },
};
