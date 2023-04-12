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
    await queryInterface.createTable(tableNames.dashboardRelation, {
      id: createTablePK(DataTypes),
      sourceField: createString(DataTypes, 100),
      targetField: createString(DataTypes, 100),
      dashboardID: createFKField(DataTypes),
      sourceID: createFKField(DataTypes),
      targetID: createFKField(DataTypes),
      ...createDateTimeStamps(DataTypes),
    });

    // Create foreign key indexes
    await queryInterface.addConstraint(
      tableNames.dashboardRelation,
      createForeignKeyConstraint(tableNames.dashboardRelation, tableNames.dashboard, ['dashboardID']),
    );
    await queryInterface.addConstraint(
      tableNames.dashboardRelation,
      createForeignKeyConstraint(tableNames.dashboardRelation, tableNames.chart, ['sourceID']),
    );
    await queryInterface.addConstraint(
      tableNames.dashboardRelation,
      createForeignKeyConstraint(tableNames.dashboardRelation, tableNames.chart, ['targetID']),
    );
  },

  down: async queryInterface => {
    await queryInterface.dropTable(tableNames.dashboardRelation);
  },
};
