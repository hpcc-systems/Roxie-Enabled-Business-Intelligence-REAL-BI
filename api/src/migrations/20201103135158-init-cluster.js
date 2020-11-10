'use strict';

// Constants
const { tableNames } = require('../constants');

// Utils
const { createTablePK, createString, createNumber, createDateTimeStamps } = require('../utils/sequelize');

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable(tableNames.cluster, {
      id: createTablePK(DataTypes),
      name: createString(DataTypes, 100),
      host: {
        ...createString(DataTypes, 100),
        unique: true,
      },
      infoPort: createNumber(DataTypes),
      dataPort: createNumber(DataTypes),
      ...createDateTimeStamps(DataTypes),
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable(tableNames.cluster);
  },
};
