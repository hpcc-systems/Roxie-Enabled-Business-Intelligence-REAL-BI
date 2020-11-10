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
  createUniqueConstraint,
} = require('../utils/sequelize');

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable(tableNames.dashboardFilterValue, {
      id: createTablePK(DataTypes),
      dataType: createString(DataTypes, 50, true),
      value: createString(DataTypes, 255, true),
      userID: createFKField(DataTypes),
      dashboardFilterID: createFKField(DataTypes),
      ...createDateTimeStamps(DataTypes),
    });

    // Create foreign key indexes
    await queryInterface.addConstraint(
      tableNames.dashboardFilterValue,
      createForeignKeyConstraint(tableNames.dashboardFilterValue, tableNames.user, ['userID']),
    );
    await queryInterface.addConstraint(
      tableNames.dashboardFilterValue,
      createForeignKeyConstraint(tableNames.dashboardFilterValue, tableNames.dashboardFilter, [
        'dashboardFilterID',
      ]),
    );

    // Create unique composite index
    await queryInterface.addConstraint(
      tableNames.dashboardFilterValue,
      createUniqueConstraint(tableNames.dashboardFilterValue, ['userID', 'dashboardFilterID']),
    );
  },

  down: async queryInterface => {
    await queryInterface.dropTable(tableNames.dashboardFilterValue);
  },
};
