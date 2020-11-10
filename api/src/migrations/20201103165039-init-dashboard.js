'use strict';

// Constants
const { tableNames } = require('../constants');

// Utils
const {
  createTablePK,
  createFKField,
  createDateTimeStamps,
  createForeignKeyConstraint,
  createString,
} = require('../utils/sequelize');

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable(tableNames.dashboard, {
      id: createTablePK(DataTypes),
      name: createString(DataTypes),
      workspaceID: createFKField(DataTypes),
      clusterID: createFKField(DataTypes),
      ...createDateTimeStamps(DataTypes),
    });

    // Create foreign key indexes
    await queryInterface.addConstraint(
      tableNames.dashboard,
      createForeignKeyConstraint(tableNames.dashboard, tableNames.workspace, ['workspaceID']),
    );
    await queryInterface.addConstraint(
      tableNames.dashboard,
      createForeignKeyConstraint(tableNames.dashboard, tableNames.cluster, ['clusterID']),
    );
  },

  down: async queryInterface => {
    await queryInterface.dropTable(tableNames.dashboard);
  },
};
