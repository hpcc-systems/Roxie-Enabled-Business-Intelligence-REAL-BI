'use strict';

// Constants
const { tableNames } = require('../constants');

// Utils
const {
  createTablePK,
  createString,
  createFKField,
  createDateTimeStamps,
  createForeignKeyConstraint,
  createUniqueConstraint,
} = require('../utils/sequelize');

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable(tableNames.clusterCredentials, {
      id: createTablePK(DataTypes),
      username: createString(DataTypes, 255, true),
      hash: createString(DataTypes, 255, true),
      userID: createFKField(DataTypes),
      clusterID: createFKField(DataTypes),
      ...createDateTimeStamps(DataTypes),
    });

    // Create foreign key indexes
    await queryInterface.addConstraint(
      tableNames.clusterCredentials,
      createForeignKeyConstraint(tableNames.clusterCredentials, tableNames.user, ['userID']),
    );
    await queryInterface.addConstraint(
      tableNames.clusterCredentials,
      createForeignKeyConstraint(tableNames.clusterCredentials, tableNames.cluster, ['clusterID']),
    );

    // Create unique composite index
    await queryInterface.addConstraint(
      tableNames.clusterCredentials,
      createUniqueConstraint(tableNames.clusterCredentials, ['userID', 'clusterID']),
    );
  },

  down: async queryInterface => {
    await queryInterface.dropTable(tableNames.clusterCredentials);
  },
};
