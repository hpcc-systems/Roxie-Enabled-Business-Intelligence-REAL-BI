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
    await queryInterface.createTable(tableNames.openDashboard, {
      id: createTablePK(DataTypes),
      userID: createFKField(DataTypes),
      workspaceID: createFKField(DataTypes),
      dashboardID: createFKField(DataTypes),
      ...createDateTimeStamps(DataTypes),
    });

    // Create foreign key indexes
    await queryInterface.addConstraint(
      tableNames.openDashboard,
      createForeignKeyConstraint(tableNames.openDashboard, tableNames.user, ['userID']),
    );
    await queryInterface.addConstraint(
      tableNames.openDashboard,
      createForeignKeyConstraint(tableNames.openDashboard, tableNames.workspace, ['workspaceID']),
    );
    await queryInterface.addConstraint(
      tableNames.openDashboard,
      createForeignKeyConstraint(tableNames.openDashboard, tableNames.dashboard, ['dashboardID']),
    );

    // Create unique composite index
    await queryInterface.addConstraint(
      tableNames.openDashboard,
      createUniqueConstraint(tableNames.openDashboard, ['userID', 'workspaceID', 'dashboardID']),
    );
  },

  down: async queryInterface => {
    await queryInterface.dropTable(tableNames.openDashboard);
  },
};
