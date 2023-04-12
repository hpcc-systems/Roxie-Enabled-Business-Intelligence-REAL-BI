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
    await queryInterface.createTable(tableNames.chart, {
      id: createTablePK(DataTypes),
      configuration: createJsonObject(DataTypes),
      dashboardID: createFKField(DataTypes),
      sourceID: createFKField(DataTypes, true),
      ...createDateTimeStamps(DataTypes),
    });

    // Create foreign key indexes
    await queryInterface.addConstraint(
      tableNames.chart,
      createForeignKeyConstraint(tableNames.chart, tableNames.dashboard, ['dashboardID']),
    );
    await queryInterface.addConstraint(tableNames.chart, {
      ...createForeignKeyConstraint(tableNames.chart, tableNames.source, ['sourceID']),
      allowNull: true,
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable(tableNames.chart);
  },
};
