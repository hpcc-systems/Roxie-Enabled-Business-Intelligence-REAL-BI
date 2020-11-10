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
    await queryInterface.createTable(tableNames.dashboardPermission, {
      id: createTablePK(DataTypes),
      userID: createFKField(DataTypes),
      dashboardID: createFKField(DataTypes),
      roleID: createFKField(DataTypes),
      ...createDateTimeStamps(DataTypes),
    });

    // Create foreign key indexes
    await queryInterface.addConstraint(
      tableNames.dashboardPermission,
      createForeignKeyConstraint(tableNames.dashboardPermission, tableNames.user, ['userID']),
    );
    await queryInterface.addConstraint(
      tableNames.dashboardPermission,
      createForeignKeyConstraint(tableNames.dashboardPermission, tableNames.dashboard, ['dashboardID']),
    );
    await queryInterface.addConstraint(
      tableNames.dashboardPermission,
      createForeignKeyConstraint(tableNames.dashboardPermission, tableNames.role, ['roleID']),
    );

    // Create unique composite index
    await queryInterface.addConstraint(
      tableNames.dashboardPermission,
      createUniqueConstraint(tableNames.dashboardPermission, ['userID', 'dashboardID']),
    );
  },

  down: async queryInterface => {
    await queryInterface.dropTable(tableNames.dashboardPermission);
  },
};
