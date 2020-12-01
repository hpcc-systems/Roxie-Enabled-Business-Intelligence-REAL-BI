// Constants
const { tableNames } = require('../constants');

// Utils
const { createTablePK, createString, createFKField, createDateTimeStamps } = require('../utils/sequelize');

module.exports = (sequelize, DataTypes) => {
  const ClusterCredentials = sequelize.define(
    tableNames.clusterCredentials,
    {
      id: createTablePK(DataTypes),
      username: createString(DataTypes, 255, true),
      hash: createString(DataTypes, 255, true),
      userID: createFKField(DataTypes),
      clusterID: createFKField(DataTypes),
      ...createDateTimeStamps(DataTypes),
    },
    { charset: 'utf8', collate: 'utf8_general_ci', paranoid: true, tableName: tableNames.clusterCredentials },
  );

  return ClusterCredentials;
};
