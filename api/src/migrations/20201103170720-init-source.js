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
    await queryInterface.createTable(tableNames.source, {
      id: createTablePK(DataTypes),
      name: createString(DataTypes, 255),
      hpccID: createString(DataTypes, 255),
      target: createString(DataTypes, 255),
      typeID: createFKField(DataTypes),
      ...createDateTimeStamps(DataTypes),
    });

    // Create foreign key index
    await queryInterface.addConstraint(
      tableNames.source,
      createForeignKeyConstraint(tableNames.source, tableNames.sourceType, ['typeID']),
    );
  },

  down: async queryInterface => {
    await queryInterface.dropTable(tableNames.source);
  },
};
