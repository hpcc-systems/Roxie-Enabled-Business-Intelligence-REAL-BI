'use strict';

// Constants
const { tableNames } = require('../constants');

// Utils
const {
  createTablePK,
  createFKField,
  createDateTimeStamps,
  createForeignKeyConstraint,
  createJsonObject,
} = require('../utils/sequelize');

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable(tableNames.dashboardFilter, {
      id: createTablePK(DataTypes),
      configuration: createJsonObject(DataTypes),
      clusterID: createFKField(DataTypes),
      dashboardID: createFKField(DataTypes),
      sourceID: createFKField(DataTypes),
      ...createDateTimeStamps(DataTypes),
    });

    // Create foreign key indexes
    await queryInterface.addConstraint(
      tableNames.dashboardFilter,
      createForeignKeyConstraint(tableNames.dashboardFilter, tableNames.cluster, ['clusterID']),
    );
    await queryInterface.addConstraint(
      tableNames.dashboardFilter,
      createForeignKeyConstraint(tableNames.dashboardFilter, tableNames.dashboard, ['dashboardID']),
    );
    await queryInterface.addConstraint(
      tableNames.dashboardFilter,
      createForeignKeyConstraint(tableNames.dashboardFilter, tableNames.source, ['sourceID']),
    );
  },

  down: async queryInterface => {
    await queryInterface.dropTable(tableNames.dashboardFilter);
  },
};
